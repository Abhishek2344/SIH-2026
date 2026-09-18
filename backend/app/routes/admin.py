from datetime import date
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.user import User, UserRole, Farmer, Staff
from app.models.centre import Centre
from app.models.booking import Booking, BookingStatus
from app.models.queue import QueueEntry, QueueStatus
from app.models.procurement import Procurement
from app.models.payment import Payment, PaymentStatus
from app.schemas.auth import UserResponse
from app.middleware.auth import require_roles
from app.utils.security import hash_password
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api/admin", tags=["Super Admin"])

class CreateStaffRequest(BaseModel):
    name: str = Field(..., min_length=2)
    mobile: str = Field(..., min_length=10)
    email: Optional[str] = None
    password: str = Field(..., min_length=6)
    role: str = "staff"  # staff or admin
    designation: str = "Procurement Officer"
    centre_id: Optional[int] = None
    staff_code: Optional[str] = None

@router.get("/stats")
def get_admin_dashboard_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(require_roles([UserRole.ADMIN.value]))
):
    today = date.today()

    total_farmers = db.query(func.count(Farmer.id)).scalar() or 0
    total_centres = db.query(func.count(Centre.id)).filter(Centre.is_active == True).scalar() or 0
    today_bookings = db.query(func.count(Booking.id)).filter(Booking.booking_date == today).scalar() or 0
    waiting_farmers = (
        db.query(func.count(QueueEntry.id))
        .filter(QueueEntry.queue_date == today, QueueEntry.status == QueueStatus.WAITING.value)
        .scalar() or 0
    )
    completed_procurements = db.query(func.count(Procurement.id)).scalar() or 0
    pending_procurements = (
        db.query(func.count(Booking.id))
        .filter(Booking.status.in_([BookingStatus.BOOKED.value, BookingStatus.WAITING.value, BookingStatus.CALLED.value, BookingStatus.SERVING.value]))
        .scalar() or 0
    )

    # Payment stats
    total_disbursed = (
        db.query(func.sum(Payment.amount))
        .filter(Payment.status == PaymentStatus.PAID.value)
        .scalar() or 0.0
    )
    total_pending_payment = (
        db.query(func.sum(Payment.amount))
        .filter(Payment.status.in_([PaymentStatus.PENDING.value, PaymentStatus.PROCESSING.value]))
        .scalar() or 0.0
    )

    # Centre-wise stats
    centres = db.query(Centre).filter(Centre.is_active == True).all()
    centre_stats = []
    for c in centres:
        c_bookings_today = db.query(func.count(Booking.id)).filter(Booking.centre_id == c.id, Booking.booking_date == today).scalar() or 0
        c_waiting = db.query(func.count(QueueEntry.id)).filter(QueueEntry.centre_id == c.id, QueueEntry.queue_date == today, QueueEntry.status == QueueStatus.WAITING.value).scalar() or 0
        c_proc_total = db.query(func.sum(Procurement.quantity_quintals)).filter(Procurement.centre_id == c.id).scalar() or 0.0
        centre_stats.append({
            "centre_id": c.id,
            "centre_name": c.name,
            "district": c.district,
            "state": c.state,
            "today_bookings": c_bookings_today,
            "waiting_count": c_waiting,
            "procured_quintals": round(c_proc_total, 2)
        })

    return {
        "total_farmers": total_farmers,
        "total_centres": total_centres,
        "today_bookings": today_bookings,
        "waiting_farmers": waiting_farmers,
        "completed_procurements": completed_procurements,
        "pending_procurements": pending_procurements,
        "total_disbursed_inr": round(total_disbursed, 2),
        "total_pending_payment_inr": round(total_pending_payment, 2),
        "centre_wise_statistics": centre_stats
    }

@router.get("/users", response_model=List[UserResponse])
def list_users(
    role: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(require_roles([UserRole.ADMIN.value]))
):
    query = db.query(User)
    if role:
        query = query.filter(User.role == role.lower())
    return query.order_by(User.id.desc()).all()

@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_staff_user(
    req: CreateStaffRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(require_roles([UserRole.ADMIN.value]))
):
    existing = db.query(User).filter(User.mobile == req.mobile).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Mobile number already registered")

    user = User(
        mobile=req.mobile,
        email=req.email,
        hashed_password=hash_password(req.password),
        role=req.role.lower(),
        is_active=True
    )
    db.add(user)
    db.flush()

    if req.role.lower() in [UserRole.STAFF.value, UserRole.ADMIN.value]:
        staff_code = req.staff_code or f"STF-{user.id:03d}"
        staff = Staff(
            user_id=user.id,
            staff_code=staff_code,
            full_name=req.name,
            designation=req.designation,
            centre_id=req.centre_id
        )
        db.add(staff)

    db.commit()
    db.refresh(user)
    return user

@router.put("/users/{id}/toggle-status")
def toggle_user_status(
    id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_roles([UserRole.ADMIN.value]))
):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if user.id == admin.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot deactivate own account")

    user.is_active = not user.is_active
    db.commit()
    return {"message": f"User status set to {'active' if user.is_active else 'deactivated'}", "is_active": user.is_active}

@router.get("/reports")
def get_reports(
    db: Session = Depends(get_db),
    admin: User = Depends(require_roles([UserRole.ADMIN.value]))
):
    # Summary of procurements by crop
    crop_breakdown = (
        db.query(
            Procurement.crop_name,
            func.sum(Procurement.quantity_quintals).label("total_quantity"),
            func.sum(Procurement.total_amount).label("total_payout"),
            func.count(Procurement.id).label("total_count")
        )
        .group_by(Procurement.crop_name)
        .all()
    )

    crop_data = [
        {
            "crop": c[0],
            "total_quintals": round(c[1] or 0.0, 2),
            "total_payout_inr": round(c[2] or 0.0, 2),
            "transactions_count": c[3]
        }
        for c in crop_breakdown
    ]

    return {
        "crop_summary": crop_data,
        "generated_date": str(date.today())
    }
