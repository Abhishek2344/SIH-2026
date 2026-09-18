from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base

class Slot(Base):
    __tablename__ = "slots"

    id = Column(Integer, primary_key=True, index=True)
    centre_id = Column(Integer, ForeignKey("centres.id", ondelete="CASCADE"), nullable=False)
    slot_date = Column(Date, nullable=False, index=True)
    start_time = Column(String(20), nullable=False)  # e.g. "09:00 AM"
    end_time = Column(String(20), nullable=False)    # e.g. "11:00 AM"
    capacity = Column(Integer, default=10, nullable=False)
    booked_count = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint("centre_id", "slot_date", "start_time", "end_time", name="uq_centre_slot_time"),
    )

    centre = relationship("Centre", back_populates="slots")
    bookings = relationship("Booking", back_populates="slot")

    @property
    def is_full(self) -> bool:
        return self.booked_count >= self.capacity

    @property
    def available_count(self) -> int:
        return max(0, self.capacity - self.booked_count)
