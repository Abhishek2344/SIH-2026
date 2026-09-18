import uuid
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.booking import Booking

class TokenService:
    @staticmethod
    def get_next_token_number(db: Session, centre_id: int, booking_date: date) -> int:
        """
        Calculates the next sequential token number for the given centre and date.
        Tokens start at 101 for each date.
        """
        max_token = db.query(func.max(Booking.token_number)).filter(
            Booking.centre_id == centre_id,
            Booking.booking_date == booking_date
        ).scalar()

        if max_token is None:
            return 101
        return max_token + 1

    @staticmethod
    def generate_booking_number(centre_code: str) -> str:
        """
        Generates a human-friendly unique booking number, e.g. BK-2026-CTR1-8F3A
        """
        short_id = uuid.uuid4().hex[:6].upper()
        clean_code = centre_code.replace("-", "")[:6]
        return f"BK-2026-{clean_code}-{short_id}"

    @staticmethod
    def format_token_display(token_number: int) -> str:
        """
        Formats integer token number to display string, e.g. TK-101
        """
        return f"TK-{token_number}"
