from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class ProcurementCreate(BaseModel):
    booking_id: int
    crop_name: str
    variety: Optional[str] = "Standard"
    grade: str = "Grade A"
    moisture_percentage: float = Field(12.0, ge=0, le=100)
    quantity_quintals: float = Field(..., gt=0)
    msp_rate_per_quintal: float = Field(..., gt=0)
    remarks: Optional[str] = None

class ProcurementResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    booking_id: int
    centre_id: int
    farmer_id: int
    staff_id: Optional[int] = None
    receipt_number: str
    crop_name: str
    variety: Optional[str] = None
    grade: str
    moisture_percentage: float
    quantity_quintals: float
    msp_rate_per_quintal: float
    total_amount: float
    procurement_date: datetime
    remarks: Optional[str] = None
    created_at: datetime
    farmer_name: Optional[str] = None
    centre_name: Optional[str] = None
