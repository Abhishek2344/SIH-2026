from typing import Optional
from datetime import date, datetime
from pydantic import BaseModel, ConfigDict

class SlotBase(BaseModel):
    centre_id: int
    slot_date: date
    start_time: str
    end_time: str
    capacity: int = 10
    is_active: bool = True

class SlotCreate(SlotBase):
    pass

class SlotUpdate(BaseModel):
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    capacity: Optional[int] = None
    is_active: Optional[bool] = None

class SlotResponse(SlotBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    booked_count: int
    available_count: int
    is_full: bool
    created_at: datetime
