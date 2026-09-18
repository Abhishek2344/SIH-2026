from datetime import date, datetime
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.queue import QueueEntry, QueueStatus
from app.models.booking import Booking, BookingStatus
from app.models.centre import Centre
from app.config import settings
from app.services.websocket_manager import ws_manager

class QueueService:
    @staticmethod
    def calculate_estimated_wait_time(people_ahead: int, avg_minutes: Optional[int] = None) -> int:
        """
        Modular calculation of estimated waiting time in minutes:
        people_ahead * average_processing_time.
        This function is kept modular so an AI prediction model can plug in seamlessly.
        """
        if people_ahead <= 0:
            return 0
        rate = avg_minutes if avg_minutes is not None else settings.AVG_PROCESSING_MINUTES_PER_FARMER
        return people_ahead * rate

    @staticmethod
    def get_live_queue_data(db: Session, centre_id: int, target_date: Optional[date] = None, farmer_id: Optional[int] = None) -> Dict[str, Any]:
        """
        Retrieves real-time queue snapshot for a centre.
        """
        if target_date is None:
            target_date = date.today()

        centre = db.query(Centre).filter(Centre.id == centre_id).first()
        centre_name = centre.name if centre else f"Centre #{centre_id}"

        # Get all queue entries for this centre and date ordered by token_number / position
        entries = (
            db.query(QueueEntry, Booking)
            .join(Booking, QueueEntry.booking_id == Booking.id)
            .filter(
                QueueEntry.centre_id == centre_id,
                QueueEntry.queue_date == target_date,
                QueueEntry.status.in_([QueueStatus.WAITING.value, QueueStatus.CALLED.value, QueueStatus.SERVING.value])
            )
            .order_by(QueueEntry.token_number.asc())
            .all()
        )

        serving_entry = next((q for q, b in entries if q.status == QueueStatus.SERVING.value), None)
        called_entries = [f"TK-{q.token_number}" for q, b in entries if q.status == QueueStatus.CALLED.value]
        waiting_entries = [(q, b) for q, b in entries if q.status == QueueStatus.WAITING.value]
        upcoming_tokens = [f"TK-{q.token_number}" for q, b in waiting_entries]

        serving_token = f"TK-{serving_entry.token_number}" if serving_entry else None
        serving_token_number = serving_entry.token_number if serving_entry else None

        # If farmer_id is provided, calculate their specific position
        farmer_token = None
        farmer_token_number = None
        farmer_status = None
        people_ahead = 0
        estimated_wait_minutes = 0

        if farmer_id:
            farmer_booking = (
                db.query(Booking, QueueEntry)
                .join(QueueEntry, Booking.id == QueueEntry.booking_id)
                .filter(
                    Booking.farmer_id == farmer_id,
                    Booking.centre_id == centre_id,
                    Booking.booking_date == target_date,
                    Booking.status != BookingStatus.CANCELLED.value
                )
                .order_by(Booking.id.desc())
                .first()
            )

            if farmer_booking:
                b, q = farmer_booking
                farmer_token = b.token_display
                farmer_token_number = b.token_number
                farmer_status = q.status

                if q.status == QueueStatus.WAITING.value:
                    # Count how many people in WAITING or CALLED or SERVING have a lower token number
                    ahead_count = (
                        db.query(func.count(QueueEntry.id))
                        .filter(
                            QueueEntry.centre_id == centre_id,
                            QueueEntry.queue_date == target_date,
                            QueueEntry.token_number < q.token_number,
                            QueueEntry.status.in_([QueueStatus.WAITING.value, QueueStatus.CALLED.value, QueueStatus.SERVING.value])
                        )
                        .scalar() or 0
                    )
                    # Also include current serving if any
                    people_ahead = ahead_count
                    estimated_wait_minutes = QueueService.calculate_estimated_wait_time(people_ahead)
                elif q.status in [QueueStatus.CALLED.value, QueueStatus.SERVING.value]:
                    people_ahead = 0
                    estimated_wait_minutes = 0

        total_active_in_queue = len(entries)
        waiting_count = len(waiting_entries)

        return {
            "centre_id": centre_id,
            "centre_name": centre_name,
            "current_date": str(target_date),
            "total_in_queue": total_active_in_queue,
            "waiting_count": waiting_count,
            "serving_token": serving_token,
            "serving_token_number": serving_token_number,
            "called_tokens": called_entries,
            "upcoming_tokens": upcoming_tokens,
            "farmer_token": farmer_token,
            "farmer_token_number": farmer_token_number,
            "people_ahead": people_ahead,
            "estimated_wait_minutes": estimated_wait_minutes,
            "farmer_status": farmer_status
        }

    @staticmethod
    async def advance_queue_on_completion(db: Session, centre_id: int, target_date: date) -> Optional[QueueEntry]:
        """
        When staff completes the current serving token,
        the next waiting token automatically becomes Serving.
        Broadcasts update to WebSockets.
        """
        next_waiting = (
            db.query(QueueEntry)
            .filter(
                QueueEntry.centre_id == centre_id,
                QueueEntry.queue_date == target_date,
                QueueEntry.status == QueueStatus.WAITING.value
            )
            .order_by(QueueEntry.token_number.asc())
            .first()
        )

        if next_waiting:
            next_waiting.status = QueueStatus.SERVING.value
            next_waiting.serving_start_time = datetime.utcnow()
            
            # Sync booking status
            booking = db.query(Booking).filter(Booking.id == next_waiting.booking_id).first()
            if booking:
                booking.status = BookingStatus.SERVING.value
            
            db.commit()
            db.refresh(next_waiting)

        # Broadcast real-time update
        live_data = QueueService.get_live_queue_data(db, centre_id, target_date)
        await ws_manager.broadcast_centre_queue(centre_id, {
            "type": "QUEUE_UPDATED",
            "data": live_data
        })

        return next_waiting
