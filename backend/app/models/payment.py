import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    PAID = "paid"
    FAILED = "failed"

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    procurement_id = Column(Integer, ForeignKey("procurements.id", ondelete="CASCADE"), unique=True, nullable=False)
    farmer_id = Column(Integer, ForeignKey("farmers.id", ondelete="CASCADE"), nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String(20), default=PaymentStatus.PENDING.value, nullable=False, index=True)
    transaction_id = Column(String(100), unique=True, nullable=True, index=True)  # UTR or Bank Ref
    payment_method = Column(String(50), default="Direct Benefit Transfer (DBT)", nullable=False)
    payment_date = Column(DateTime, nullable=True)
    bank_name = Column(String(100), default="State Bank of India", nullable=True)
    account_last4 = Column(String(10), default="9012", nullable=True)
    remarks = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    procurement = relationship("Procurement", back_populates="payment")
    farmer = relationship("Farmer", back_populates="payments")
