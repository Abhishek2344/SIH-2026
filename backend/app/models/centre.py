from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Centre(Base):
    __tablename__ = "centres"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)  # e.g. CTR-PB-01
    name = Column(String(150), nullable=False)
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    address = Column(Text, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    opening_time = Column(String(10), default="08:00 AM", nullable=False)
    closing_time = Column(String(10), default="05:00 PM", nullable=False)
    contact_phone = Column(String(20), nullable=True)
    commodities = Column(String(255), default="Wheat, Paddy, Mustard, Gram", nullable=False)
    daily_capacity = Column(Integer, default=50, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    staff_members = relationship("Staff", back_populates="centre")
    slots = relationship("Slot", back_populates="centre", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="centre")
    queue_entries = relationship("QueueEntry", back_populates="centre")
    procurements = relationship("Procurement", back_populates="centre")
