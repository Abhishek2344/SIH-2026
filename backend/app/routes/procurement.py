import uuid
from datetime import datetime, date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.procurement import Procurement
from app.models.payment import Payment, PaymentStatus
from app.models.booking import Booking, BookingStatus
from app.models.queue import QueueEntry, QueueStatus
from app.models.user import User, UserRole, Staff
from app.schemas.procurement import ProcurementCreate, ProcurementResponse
from app.middleware.auth import get_current_user, require_roles
from app.services.queue_service import QueueService
from app.services.notification_service import NotificationService
from app.services.websocket_manager import ws_manager

router = APIRouter(prefix="/api/procurement", tags=["Procurement"])

@router.post("", response_model=ProcurementResponse, status_code=status.HTTP_201_CREATED)
async def record_procurement(
    req: ProcurementCreate,
    db: Session = Depends(get_db),
    staff_user: User = Depends(require_roles([UserRole.STAFF.value, UserRole.ADMIN.value]))
):
    booking = db.query(Booking).filter(Booking.id == req.booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    existing_proc = db.query(Procurement).filter(Procurement.booking_id == req.booking_id).first()
    if existing_proc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Procurement has already been recorded for this booking")

    # Staff ID
    staff = db.query(Staff).filter(Staff.user_id == staff_user.id).first()
    staff_id = staff.id if staff else None

    # Calculate total
    total_amount = round(req.quantity_quintals * req.msp_rate_per_quintal, 2)
    short_uuid = uuid.uuid4().hex[:6].upper()
    receipt_no = f"REC-2026-{short_uuid}"

    # 1. Create procurement
    proc = Procurement(
        booking_id=booking.id,
        centre_id=booking.centre_id,
        farmer_id=booking.farmer_id,
        staff_id=staff_id,
        receipt_number=receipt_no,
        crop_name=req.crop_name,
        variety=req.variety,
        grade=req.grade,
        moisture_percentage=req.moisture_percentage,
        quantity_quintals=req.quantity_quintals,
        msp_rate_per_quintal=req.msp_rate_per_quintal,
        total_amount=total_amount,
        procurement_date=datetime.utcnow(),
        remarks=req.remarks
    )
    db.add(proc)
    db.flush()

    # 2. Create pending Payment
    payment = Payment(
        procurement_id=proc.id,
        farmer_id=booking.farmer_id,
        amount=total_amount,
        status=PaymentStatus.PENDING.value,
        payment_method="Direct Benefit Transfer (DBT)",
        bank_name="State Bank of India",
        account_last4=booking.farmer.mobile[-4:] if booking.farmer else "1234",
        remarks=f"Payment for {req.quantity_quintals} Qtl {req.crop_name}"
    )
    db.add(payment)

    # 3. Update Booking & Queue status to COMPLETED
    booking.status = BookingStatus.COMPLETED.value
    if booking.queue_entry:
        booking.queue_entry.status = QueueStatus.COMPLETED.value
        booking.queue_entry.completed_time = datetime.utcnow()

    db.commit()
    db.refresh(proc)

    # 4. Notify farmer
    await NotificationService.create_notification(
        db=db,
        user_id=booking.farmer.user_id,
        title="Procurement Completed!",
        message=f"Procurement completed for {req.quantity_quintals} Qtl {req.crop_name}. Total payout: ₹{total_amount:,.2f}. Receipt #{receipt_no}.",
        notif_type="procurement_completed"
    )

    # 5. Automatically advance the queue on completion!
    await QueueService.advance_queue_on_completion(db, booking.centre_id, booking.booking_date)

    resp = ProcurementResponse.model_validate(proc)
    resp.farmer_name = booking.farmer.full_name
    resp.centre_name = booking.centre.name
    return resp

@router.get("/{booking_id}", response_model=ProcurementResponse)
def get_procurement_by_booking(booking_id: int, db: Session = Depends(get_db)):
    proc = db.query(Procurement).filter(Procurement.booking_id == booking_id).first()
    if not proc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Procurement record not found")

    resp = ProcurementResponse.model_validate(proc)
    resp.farmer_name = proc.farmer.full_name if proc.farmer else ""
    resp.centre_name = proc.centre.name if proc.centre else ""
    return resp

@router.get("", response_model=List[ProcurementResponse])
def list_procurements(
    centre_id: Optional[int] = None,
    farmer_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Procurement)
    if current_user.role == UserRole.FARMER.value:
        if current_user.farmer_profile:
            query = query.filter(Procurement.farmer_id == current_user.farmer_profile.id)
    else:
        if centre_id:
            query = query.filter(Procurement.centre_id == centre_id)
        if farmer_id:
            query = query.filter(Procurement.farmer_id == farmer_id)

    records = query.order_by(Procurement.procurement_date.desc()).all()
    results = []
    for p in records:
        resp = ProcurementResponse.model_validate(p)
        resp.farmer_name = p.farmer.full_name if p.farmer else ""
        resp.centre_name = p.centre.name if p.centre else ""
        results.append(resp)
    return results
