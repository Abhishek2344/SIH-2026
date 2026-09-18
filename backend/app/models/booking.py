import enum
from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Float, DateTime, Date, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base

class BookingStatus(str, enum.Enum):
    BOOKED = "booked"
    WAITING = "waiting"
    CALLED = "called"
    SERVING = "serving"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    booking_number = Column(String(50), unique=True, index=True, nullable=False)  # BK-2026-XXXX
    farmer_id = Column(Integer, ForeignKey("farmers.id", ondelete="CASCADE"), nullable=False)
    centre_id = Column(Integer, ForeignKey("centres.id", ondelete="CASCADE"), nullable=False)
    slot_id = Column(Integer, ForeignKey("slots.id", ondelete="RESTRICT"), nullable=False)
    booking_date = Column(Date, nullable=False, index=True)
    token_number = Column(Integer, nullable=False, index=True)  # Sequential number per centre/date
    token_display = Column(String(20), nullable=False)          # e.g. "TK-101"
    crop_type = Column(String(100), default="Wheat", nullable=False)
    estimated_quantity_quintals = Column(Float, default=10.0, nullable=False)
    status = Column(String(20), default=BookingStatus.BOOKED.value, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint("centre_id", "booking_date", "token_number", name="uq_centre_date_token"),
    )

    farmer = relationship("Farmer", back_populates="bookings")
    centre = relationship("Centre", back_populates="bookings")
    slot = relationship("Slot", back_populates="bookings")
    queue_entry = relationship("QueueEntry", back_populates="booking", uselist=False, cascade="all, delete-orphan")
    procurement = relationship("Procurement", back_populates="booking", uselist=False)
