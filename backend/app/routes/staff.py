from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.booking import Booking, BookingStatus
from app.models.queue import QueueEntry
from app.models.centre import Centre
from app.models.user import User, UserRole, Staff
from app.schemas.booking import BookingDetailResponse
from app.schemas.queue import QueueEntryResponse
from app.schemas.centre import CentreResponse
from app.middleware.auth import get_current_user, require_roles

router = APIRouter(prefix="/api/staff", tags=["Staff Dashboard"])

def _get_staff_centre_id(staff_user: User, db: Session) -> Optional[int]:
    staff = db.query(Staff).filter(Staff.user_id == staff_user.id).first()
    if staff and staff.centre_id:
        return staff.centre_id
    # Default to first active centre for admin/demo fallback
    first_centre = db.query(Centre).filter(Centre.is_active == True).first()
    return first_centre.id if first_centre else None

@router.get("/centre", response_model=CentreResponse)
def get_staff_centre(
    db: Session = Depends(get_db),
    staff_user: User = Depends(require_roles([UserRole.STAFF.value, UserRole.ADMIN.value]))
):
    centre_id = _get_staff_centre_id(staff_user, db)
    if not centre_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No procurement centre assigned to this staff account")
    centre = db.query(Centre).filter(Centre.id == centre_id).first()
    return centre

@router.get("/today-bookings", response_model=List[BookingDetailResponse])
def get_today_bookings(
    centre_id: Optional[int] = None,
    db: Session = Depends(get_db),
    staff_user: User = Depends(require_roles([UserRole.STAFF.value, UserRole.ADMIN.value]))
):
    if not centre_id:
        centre_id = _get_staff_centre_id(staff_user, db)

    today = date.today()
    bookings = (
        db.query(Booking)
        .filter(Booking.centre_id == centre_id, Booking.booking_date == today)
        .order_by(Booking.token_number.asc())
        .all()
    )

    results = []
    for b in bookings:
        resp = BookingDetailResponse.model_validate(b)
        resp.centre_name = b.centre.name if b.centre else ""
        resp.centre_address = b.centre.address if b.centre else ""
        resp.slot_time = f"{b.slot.start_time} - {b.slot.end_time}" if b.slot else ""
        resp.farmer_name = b.farmer.full_name if b.farmer else ""
        resp.farmer_mobile = b.farmer.mobile if b.farmer else ""
        resp.queue_status = b.queue_entry.status if b.queue_entry else b.status
        results.append(resp)
    return results

@router.get("/all-tokens", response_model=List[QueueEntryResponse])
def get_all_today_tokens(
    centre_id: Optional[int] = None,
    db: Session = Depends(get_db),
    staff_user: User = Depends(require_roles([UserRole.STAFF.value, UserRole.ADMIN.value]))
):
    if not centre_id:
        centre_id = _get_staff_centre_id(staff_user, db)

    today = date.today()
    entries = (
        db.query(QueueEntry, Booking)
        .join(Booking, QueueEntry.booking_id == Booking.id)
        .filter(QueueEntry.centre_id == centre_id, QueueEntry.queue_date == today)
        .order_by(QueueEntry.token_number.asc())
        .all()
    )

    results = []
    for q, b in entries:
        resp = QueueEntryResponse.model_validate(q)
        resp.token_display = b.token_display
        resp.farmer_name = b.farmer.full_name if b.farmer else ""
        resp.crop_type = b.crop_type
        resp.estimated_quantity = b.estimated_quantity_quintals
        results.append(resp)
    return results
