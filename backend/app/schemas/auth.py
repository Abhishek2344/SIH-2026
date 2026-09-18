from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class FarmerRegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    mobile: str = Field(..., min_length=10, max_length=15)
    password: str = Field(..., min_length=6)
    farmer_id: Optional[str] = Field(None, description="Optional custom Farmer ID or auto-generated")
    address: str = Field(..., min_length=3)
    district: Optional[str] = "Ludhiana"
    state: Optional[str] = "Punjab"
    preferred_language: Optional[str] = "en"  # 'en' or 'hi'

class LoginRequest(BaseModel):
    username: str = Field(..., description="Mobile, Email, or Farmer ID / Staff Code")
    password: str = Field(..., min_length=1)

class FarmerProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    farmer_id: str
    full_name: str
    mobile: str
    address: str
    district: Optional[str] = None
    state: Optional[str] = None
    preferred_language: str

class StaffProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    staff_code: str
    full_name: str
    designation: str
    centre_id: Optional[int] = None

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: Optional[str] = None
    mobile: str
    role: str
    is_active: bool
    created_at: datetime
    farmer_profile: Optional[FarmerProfileResponse] = None
    staff_profile: Optional[StaffProfileResponse] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
