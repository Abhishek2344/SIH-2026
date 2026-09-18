import enum
from datetime import datetime, date
from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class QueueStatus(str, enum.Enum):
    WAITING = "waiting"
    CALLED = "called"
    SERVING = "serving"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    SKIPPED = "skipped"

class QueueEntry(Base):
    __tablename__ = "queue_entries"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id", ondelete="CASCADE"), unique=True, nullable=False)
    centre_id = Column(Integer, ForeignKey("centres.id", ondelete="CASCADE"), nullable=False, index=True)
    token_number = Column(Integer, nullable=False, index=True)
    queue_date = Column(Date, nullable=False, index=True)
    position = Column(Integer, default=1, nullable=False)
    status = Column(String(20), default=QueueStatus.WAITING.value, nullable=False, index=True)
    check_in_time = Column(DateTime, default=datetime.utcnow, nullable=False)
    called_time = Column(DateTime, nullable=True)
    serving_start_time = Column(DateTime, nullable=True)
    completed_time = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    booking = relationship("Booking", back_populates="queue_entry")
    centre = relationship("Centre", back_populates="queue_entries")
