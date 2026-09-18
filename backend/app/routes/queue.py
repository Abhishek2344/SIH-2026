from datetime import date, datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.queue import QueueEntry, QueueStatus
from app.models.booking import Booking, BookingStatus
from app.models.centre import Centre
from app.schemas.queue import QueueEntryResponse, QueueStatusUpdate, LiveQueueResponse
from app.middleware.auth import get_current_user, require_roles, get_current_farmer
from app.models.user import User, UserRole, Farmer
from app.services.queue_service import QueueService
from app.services.notification_service import NotificationService
from app.services.websocket_manager import ws_manager

router = APIRouter(prefix="/api/queue", tags=["Queue Management"])

@router.get("/{centre_id}", response_model=LiveQueueResponse)
def get_centre_live_queue(
    centre_id: int,
    target_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    if not target_date:
        target_date = date.today()
    return QueueService.get_live_queue_data(db, centre_id, target_date)

@router.get("/farmer/status", response_model=LiveQueueResponse)
def get_farmer_queue_status(
    centre_id: Optional[int] = None,
    db: Session = Depends(get_db),
    farmer: Farmer = Depends(get_current_farmer)
):
    today = date.today()
    if not centre_id:
        # Find active booking today for this farmer
        booking = (
            db.query(Booking)
            .filter(
                Booking.farmer_id == farmer.id,
                Booking.booking_date == today,
                Booking.status != BookingStatus.CANCELLED.value
            )
            .order_by(Booking.id.desc())
            .first()
        )
        if not booking:
            # Look for upcoming booking
            booking = (
                db.query(Booking)
                .filter(
                    Booking.farmer_id == farmer.id,
                    Booking.booking_date >= today,
                    Booking.status != BookingStatus.CANCELLED.value
                )
                .order_by(Booking.booking_date.asc(), Booking.id.asc())
                .first()
            )
        if not booking:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No active bookings found for farmer")
        centre_id = booking.centre_id
        target_date = booking.booking_date
    else:
        target_date = today

    return QueueService.get_live_queue_data(db, centre_id, target_date, farmer_id=farmer.id)

@router.post("/{centre_id}/call-next", response_model=QueueEntryResponse)
async def call_next_farmer(
    centre_id: int,
    db: Session = Depends(get_db),
    staff_user: User = Depends(require_roles([UserRole.STAFF.value, UserRole.ADMIN.value]))
):
    today = date.today()
    # Find the earliest waiting token
    next_entry = (
        db.query(QueueEntry)
        .filter(
            QueueEntry.centre_id == centre_id,
            QueueEntry.queue_date == today,
            QueueEntry.status == QueueStatus.WAITING.value
        )
        .order_by(QueueEntry.token_number.asc())
        .first()
    )

    if not next_entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No waiting farmers in the queue")

    next_entry.status = QueueStatus.CALLED.value
    next_entry.called_time = datetime.utcnow()

    # Sync booking
    booking = db.query(Booking).filter(Booking.id == next_entry.booking_id).first()
    if booking:
        booking.status = BookingStatus.CALLED.value
        # Notify farmer that their token is called!
        await NotificationService.create_notification(
            db=db,
            user_id=booking.farmer.user_id,
            title="Your Token is Called!",
            message=f"Token {booking.token_display} is now being called at the procurement counter. Please proceed.",
            notif_type="token_called"
        )

    db.commit()
    db.refresh(next_entry)

    # Broadcast updated queue
    live_data = QueueService.get_live_queue_data(db, centre_id, today)
    await ws_manager.broadcast_centre_queue(centre_id, {
        "type": "TOKEN_CALLED",
        "token": f"TK-{next_entry.token_number}",
        "data": live_data
    })

    return next_entry

@router.put("/entries/{entry_id}/status", response_model=QueueEntryResponse)
async def update_queue_status(
    entry_id: int,
    req: QueueStatusUpdate,
    db: Session = Depends(get_db),
    staff_user: User = Depends(require_roles([UserRole.STAFF.value, UserRole.ADMIN.value]))
):
    entry = db.query(QueueEntry).filter(QueueEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Queue entry not found")

    new_status = req.status.lower()
    entry.status = new_status

    now = datetime.utcnow()
    if new_status == QueueStatus.CALLED.value:
        entry.called_time = now
    elif new_status == QueueStatus.SERVING.value:
        entry.serving_start_time = now
    elif new_status == QueueStatus.COMPLETED.value:
        entry.completed_time = now

    booking = db.query(Booking).filter(Booking.id == entry.booking_id).first()
    if booking:
        booking.status = new_status
        if new_status == QueueStatus.CALLED.value:
            await NotificationService.create_notification(
                db=db,
                user_id=booking.farmer.user_id,
                title="Token Called",
                message=f"Token {booking.token_display} has been called. Please head to Counter 1.",
                notif_type="token_called"
            )
        elif new_status == QueueStatus.SERVING.value:
            await NotificationService.create_notification(
                db=db,
                user_id=booking.farmer.user_id,
                title="Procurement In Progress",
                message=f"Token {booking.token_display} is currently being served for quality check & weighing.",
                notif_type="queue"
            )

    db.commit()
    db.refresh(entry)

    # If completed, automatically advance the next waiting token to serving!
    if new_status == QueueStatus.COMPLETED.value:
        await QueueService.advance_queue_on_completion(db, entry.centre_id, entry.queue_date)
    else:
        # Broadcast updated queue state
        live_data = QueueService.get_live_queue_data(db, entry.centre_id, entry.queue_date)
        await ws_manager.broadcast_centre_queue(entry.centre_id, {
            "type": "QUEUE_UPDATED",
            "data": live_data
        })

    return entry
