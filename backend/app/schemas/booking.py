from typing import Optional
from datetime import date, datetime
from pydantic import BaseModel, Field, ConfigDict

class BookingCreate(BaseModel):
    centre_id: int
    slot_id: int
    booking_date: date
    crop_type: str = "Wheat"
    estimated_quantity_quintals: float = Field(..., gt=0)

class BookingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    booking_number: str
    farmer_id: int
    centre_id: int
    slot_id: int
    booking_date: date
    token_number: int
    token_display: str
    crop_type: str
    estimated_quantity_quintals: float
    status: str
    created_at: datetime
    updated_at: datetime

class BookingDetailResponse(BookingResponse):
    model_config = ConfigDict(from_attributes=True)

    centre_name: Optional[str] = None
    centre_address: Optional[str] = None
    slot_time: Optional[str] = None
    farmer_name: Optional[str] = None
    farmer_mobile: Optional[str] = None
    queue_position: Optional[int] = None
    queue_status: Optional[str] = None
    people_ahead: Optional[int] = 0
    estimated_wait_minutes: Optional[int] = 0
