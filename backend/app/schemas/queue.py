from typing import Optional, List
from datetime import date, datetime
from pydantic import BaseModel, ConfigDict

class QueueStatusUpdate(BaseModel):
    status: str  # waiting, called, serving, completed, cancelled, skipped

class QueueEntryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    booking_id: int
    centre_id: int
    token_number: int
    token_display: Optional[str] = None
    queue_date: date
    position: int
    status: str
    farmer_name: Optional[str] = None
    crop_type: Optional[str] = None
    estimated_quantity: Optional[float] = None
    check_in_time: datetime
    called_time: Optional[datetime] = None
    serving_start_time: Optional[datetime] = None
    completed_time: Optional[datetime] = None

class LiveQueueResponse(BaseModel):
    centre_id: int
    centre_name: str
    current_date: date
    total_in_queue: int
    waiting_count: int
    serving_token: Optional[str] = None
    serving_token_number: Optional[int] = None
    called_tokens: List[str] = []
    upcoming_tokens: List[str] = []
    farmer_token: Optional[str] = None
    farmer_token_number: Optional[int] = None
    people_ahead: Optional[int] = 0
    estimated_wait_minutes: Optional[int] = 0
    farmer_status: Optional[str] = None
