import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from app.database import Base

class UserRole(str, enum.Enum):
    FARMER = "farmer"
    STAFF = "staff"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(120), unique=True, index=True, nullable=True)
    mobile = Column(String(20), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default=UserRole.FARMER.value, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    farmer_profile = relationship("Farmer", back_populates="user", uselist=False, cascade="all, delete-orphan")
    staff_profile = relationship("Staff", back_populates="user", uselist=False, cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    farmer_id = Column(String(50), unique=True, index=True, nullable=False)  # e.g. FID-2026-XXXX
    full_name = Column(String(100), nullable=False)
    mobile = Column(String(20), nullable=False)
    address = Column(Text, nullable=False)
    district = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    preferred_language = Column(String(10), default="en", nullable=False)  # 'en' or 'hi'
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="farmer_profile")
    bookings = relationship("Booking", back_populates="farmer")
    procurements = relationship("Procurement", back_populates="farmer")
    payments = relationship("Payment", back_populates="farmer")

class Staff(Base):
    __tablename__ = "staff"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    staff_code = Column(String(50), unique=True, index=True, nullable=False)  # e.g. STF-101
    full_name = Column(String(100), nullable=False)
    designation = Column(String(100), default="Procurement Officer", nullable=False)
    centre_id = Column(Integer, ForeignKey("centres.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="staff_profile")
    centre = relationship("Centre", back_populates="staff_members")
    procurements = relationship("Procurement", back_populates="staff")
