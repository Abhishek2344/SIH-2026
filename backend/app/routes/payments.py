from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.payment import Payment, PaymentStatus
from app.models.procurement import Procurement
from app.models.user import User, UserRole, Farmer
from app.schemas.payment import PaymentUpdate, PaymentResponse
from app.middleware.auth import get_current_user, require_roles, get_current_farmer
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/api/payments", tags=["Payments"])

@router.get("/my", response_model=List[PaymentResponse])
def get_my_payments(
    db: Session = Depends(get_db),
    farmer: Farmer = Depends(get_current_farmer)
):
    payments = (
        db.query(Payment)
        .filter(Payment.farmer_id == farmer.id)
        .order_by(Payment.created_at.desc())
        .all()
    )

    results = []
    for p in payments:
        resp = PaymentResponse.model_validate(p)
        if p.procurement:
            resp.crop_name = p.procurement.crop_name
            resp.quantity_quintals = p.procurement.quantity_quintals
            resp.receipt_number = p.procurement.receipt_number
        resp.farmer_name = farmer.full_name
        results.append(resp)
    return results

@router.get("", response_model=List[PaymentResponse])
def list_payments(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    staff_user: User = Depends(require_roles([UserRole.STAFF.value, UserRole.ADMIN.value]))
):
    query = db.query(Payment)
    if status_filter:
        query = query.filter(Payment.status == status_filter.lower())

    payments = query.order_by(Payment.created_at.desc()).all()
    results = []
    for p in payments:
        resp = PaymentResponse.model_validate(p)
        if p.procurement:
            resp.crop_name = p.procurement.crop_name
            resp.quantity_quintals = p.procurement.quantity_quintals
            resp.receipt_number = p.procurement.receipt_number
        resp.farmer_name = p.farmer.full_name if p.farmer else ""
        results.append(resp)
    return results

@router.put("/{id}/status", response_model=PaymentResponse)
async def update_payment_status(
    id: int,
    req: PaymentUpdate,
    db: Session = Depends(get_db),
    staff_user: User = Depends(require_roles([UserRole.STAFF.value, UserRole.ADMIN.value]))
):
    payment = db.query(Payment).filter(Payment.id == id).first()
    if not payment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment record not found")

    new_status = req.status.lower()
    payment.status = new_status
    if req.transaction_id:
        payment.transaction_id = req.transaction_id
    if req.bank_name:
        payment.bank_name = req.bank_name
    if req.account_last4:
        payment.account_last4 = req.account_last4
    if req.remarks:
        payment.remarks = req.remarks

    if new_status == PaymentStatus.PAID.value:
        payment.payment_date = datetime.utcnow()

    db.commit()
    db.refresh(payment)

    # Notify farmer of payment status change
    if payment.farmer:
        title = "Payment Update"
        msg = f"Your procurement payment of ₹{payment.amount:,.2f} is now '{new_status.upper()}'."
        if new_status == PaymentStatus.PAID.value and payment.transaction_id:
            msg += f" Reference / UTR: {payment.transaction_id}."
        
        await NotificationService.create_notification(
            db=db,
            user_id=payment.farmer.user_id,
            title=title,
            message=msg,
            notif_type="payment_updated"
        )

    resp = PaymentResponse.model_validate(payment)
    if payment.procurement:
        resp.crop_name = payment.procurement.crop_name
        resp.quantity_quintals = payment.procurement.quantity_quintals
        resp.receipt_number = payment.procurement.receipt_number
    resp.farmer_name = payment.farmer.full_name if payment.farmer else ""
    return resp
