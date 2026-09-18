from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class CentreBase(BaseModel):
    code: str
    name: str
    state: str
    district: str
    address: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    opening_time: str = "08:00 AM"
    closing_time: str = "05:00 PM"
    contact_phone: Optional[str] = None
    commodities: str = "Wheat, Paddy, Mustard, Gram"
    daily_capacity: int = 50
    is_active: bool = True

class CentreCreate(CentreBase):
    pass

class CentreUpdate(BaseModel):
    name: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    opening_time: Optional[str] = None
    closing_time: Optional[str] = None
    contact_phone: Optional[str] = None
    commodities: Optional[str] = None
    daily_capacity: Optional[int] = None
    is_active: Optional[bool] = None

class CentreResponse(CentreBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    current_queue_size: Optional[int] = 0
    available_slots_count: Optional[int] = 0
