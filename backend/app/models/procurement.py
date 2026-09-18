from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Procurement(Base):
    __tablename__ = "procurements"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id", ondelete="CASCADE"), unique=True, nullable=False)
    centre_id = Column(Integer, ForeignKey("centres.id", ondelete="CASCADE"), nullable=False)
    farmer_id = Column(Integer, ForeignKey("farmers.id", ondelete="CASCADE"), nullable=False)
    staff_id = Column(Integer, ForeignKey("staff.id", ondelete="SET NULL"), nullable=True)
    receipt_number = Column(String(50), unique=True, index=True, nullable=False)  # REC-2026-XXXX
    crop_name = Column(String(100), nullable=False)
    variety = Column(String(100), nullable=True)
    grade = Column(String(50), default="Grade A", nullable=False)
    moisture_percentage = Column(Float, default=12.0, nullable=False)
    quantity_quintals = Column(Float, nullable=False)
    msp_rate_per_quintal = Column(Float, nullable=False)  # ₹ MSP per quintal
    total_amount = Column(Float, nullable=False)          # quantity * msp_rate
    procurement_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    remarks = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    booking = relationship("Booking", back_populates="procurement")
    centre = relationship("Centre", back_populates="procurements")
    farmer = relationship("Farmer", back_populates="procurements")
    staff = relationship("Staff", back_populates="procurements")
    payment = relationship("Payment", back_populates="procurement", uselist=False, cascade="all, delete-orphan")
