from datetime import date, datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.booking import Booking, BookingStatus
from app.models.slot import Slot
from app.models.centre import Centre
from app.models.queue import QueueEntry, QueueStatus
from app.models.user import Farmer, UserRole
from app.schemas.booking import BookingCreate, BookingResponse, BookingDetailResponse
from app.middleware.auth import get_current_farmer, get_current_user
from app.models.user import User
from app.services.token_service import TokenService
from app.services.queue_service import QueueService
from app.services.notification_service import NotificationService
from app.services.websocket_manager import ws_manager

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])

@router.post("", response_model=BookingDetailResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(
    req: BookingCreate,
    db: Session = Depends(get_db),
    farmer: Farmer = Depends(get_current_farmer)
):
    # 1. Validate slot
    slot = db.query(Slot).filter(Slot.id == req.slot_id, Slot.centre_id == req.centre_id).first()
    if not slot or not slot.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Selected slot is invalid or inactive"
        )

    if slot.is_full:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Selected slot is fully booked. Please choose another slot."
        )

    centre = db.query(Centre).filter(Centre.id == req.centre_id).first()
    if not centre or not centre.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Centre is not active")

    # 2. Check if farmer already has an active booking for this date at this centre
    existing = db.query(Booking).filter(
        Booking.farmer_id == farmer.id,
        Booking.booking_date == req.booking_date,
        Booking.status.in_([BookingStatus.BOOKED.value, BookingStatus.WAITING.value, BookingStatus.CALLED.value, BookingStatus.SERVING.value])
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"You already have an active booking on {req.booking_date} (Token: {existing.token_display})"
        )

    # 3. Generate sequential token number for this centre and date
    token_num = TokenService.get_next_token_number(db, req.centre_id, req.booking_date)
    token_display = TokenService.format_token_display(token_num)
    booking_num = TokenService.generate_booking_number(centre.code)

    # 4. Create booking
    booking = Booking(
        booking_number=booking_num,
        farmer_id=farmer.id,
        centre_id=req.centre_id,
        slot_id=req.slot_id,
        booking_date=req.booking_date,
        token_number=token_num,
        token_display=token_display,
        crop_type=req.crop_type,
        estimated_quantity_quintals=req.estimated_quantity_quintals,
        status=BookingStatus.BOOKED.value
    )
    db.add(booking)
    db.flush()

    # 5. Create queue entry
    queue_entry = QueueEntry(
        booking_id=booking.id,
        centre_id=req.centre_id,
        token_number=token_num,
        queue_date=req.booking_date,
        position=token_num - 100,  # relative starting position
        status=QueueStatus.WAITING.value,
        check_in_time=datetime.utcnow()
    )
    db.add(queue_entry)

    # 6. Update slot count
    slot.booked_count += 1
    db.commit()
    db.refresh(booking)

    # 7. Create notification for farmer
    await NotificationService.create_notification(
        db=db,
        user_id=farmer.user_id,
        title="Slot Booking Confirmed!",
        message=f"Booking confirmed at {centre.name} on {req.booking_date}. Your Token is {token_display}.",
        notif_type="booking_confirmed"
    )

    # 8. Broadcast live queue update if booking is for today
    if req.booking_date == date.today():
        live_data = QueueService.get_live_queue_data(db, req.centre_id, req.booking_date)
        await ws_manager.broadcast_centre_queue(req.centre_id, {
            "type": "QUEUE_UPDATED",
            "data": live_data
        })

    # Prepare response with extra details
    resp = BookingDetailResponse.model_validate(booking)
    resp.centre_name = centre.name
    resp.centre_address = centre.address
    resp.slot_time = f"{slot.start_time} - {slot.end_time}"
    resp.farmer_name = farmer.full_name
    resp.farmer_mobile = farmer.mobile
    resp.queue_status = queue_entry.status
    
    # Waiting time calculation
    live = QueueService.get_live_queue_data(db, req.centre_id, req.booking_date, farmer_id=farmer.id)
    resp.people_ahead = live.get("people_ahead", 0)
    resp.estimated_wait_minutes = live.get("estimated_wait_minutes", 0)

    return resp

@router.get("/my", response_model=List[BookingDetailResponse])
def get_my_bookings(
    db: Session = Depends(get_db),
    farmer: Farmer = Depends(get_current_farmer)
):
    bookings = (
        db.query(Booking)
        .filter(Booking.farmer_id == farmer.id)
        .order_by(Booking.booking_date.desc(), Booking.id.desc())
        .all()
    )

    result = []
    today = date.today()
    for b in bookings:
        resp = BookingDetailResponse.model_validate(b)
        resp.centre_name = b.centre.name if b.centre else "Procurement Centre"
        resp.centre_address = b.centre.address if b.centre else ""
        resp.slot_time = f"{b.slot.start_time} - {b.slot.end_time}" if b.slot else ""
        resp.farmer_name = farmer.full_name
        resp.farmer_mobile = farmer.mobile
        resp.queue_status = b.queue_entry.status if b.queue_entry else b.status

        if b.booking_date == today:
            live = QueueService.get_live_queue_data(db, b.centre_id, today, farmer_id=farmer.id)
            resp.people_ahead = live.get("people_ahead", 0)
            resp.estimated_wait_minutes = live.get("estimated_wait_minutes", 0)
        else:
            resp.people_ahead = 0
            resp.estimated_wait_minutes = 0

        result.append(resp)

    return result

@router.get("/{id}", response_model=BookingDetailResponse)
def get_booking_detail(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.id == id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    resp = BookingDetailResponse.model_validate(booking)
    resp.centre_name = booking.centre.name if booking.centre else ""
    resp.centre_address = booking.centre.address if booking.centre else ""
    resp.slot_time = f"{booking.slot.start_time} - {booking.slot.end_time}" if booking.slot else ""
    resp.farmer_name = booking.farmer.full_name if booking.farmer else ""
    resp.farmer_mobile = booking.farmer.mobile if booking.farmer else ""
    resp.queue_status = booking.queue_entry.status if booking.queue_entry else booking.status

    live = QueueService.get_live_queue_data(db, booking.centre_id, booking.booking_date, farmer_id=booking.farmer_id)
    resp.people_ahead = live.get("people_ahead", 0)
    resp.estimated_wait_minutes = live.get("estimated_wait_minutes", 0)

    return resp

@router.post("/{id}/cancel")
async def cancel_booking(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.id == id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    # Only farmer who owns it or staff/admin can cancel
    if current_user.role == UserRole.FARMER.value:
        if not current_user.farmer_profile or booking.farmer_id != current_user.farmer_profile.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized to cancel this booking")

    if booking.status in [BookingStatus.COMPLETED.value, BookingStatus.CANCELLED.value]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Cannot cancel booking with status '{booking.status}'")

    booking.status = BookingStatus.CANCELLED.value
    if booking.queue_entry:
        booking.queue_entry.status = QueueStatus.CANCELLED.value

    # Free slot capacity
    if booking.slot and booking.slot.booked_count > 0:
        booking.slot.booked_count -= 1

    db.commit()

    # Notify farmer
    await NotificationService.create_notification(
        db=db,
        user_id=booking.farmer.user_id,
        title="Booking Cancelled",
        message=f"Your booking for {booking.booking_date} (Token: {booking.token_display}) has been cancelled.",
        notif_type="alert"
    )

    # Broadcast live queue update if today
    if booking.booking_date == date.today():
        live_data = QueueService.get_live_queue_data(db, booking.centre_id, booking.booking_date)
        await ws_manager.broadcast_centre_queue(booking.centre_id, {
            "type": "QUEUE_UPDATED",
            "data": live_data
        })

    return {"message": "Booking successfully cancelled", "booking_id": booking.id}
