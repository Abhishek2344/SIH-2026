from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class PaymentUpdate(BaseModel):
    status: str  # pending, processing, paid, failed
    transaction_id: Optional[str] = None
    payment_method: Optional[str] = "Direct Benefit Transfer (DBT)"
    bank_name: Optional[str] = None
    account_last4: Optional[str] = None
    remarks: Optional[str] = None

class PaymentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    procurement_id: int
    farmer_id: int
    amount: float
    status: str
    transaction_id: Optional[str] = None
    payment_method: str
    payment_date: Optional[datetime] = None
    bank_name: Optional[str] = None
    account_last4: Optional[str] = None
    remarks: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    crop_name: Optional[str] = None
    quantity_quintals: Optional[float] = None
    receipt_number: Optional[str] = None
    farmer_name: Optional[str] = None
