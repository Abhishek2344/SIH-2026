from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
import uuid
from app.database import get_db
from app.models.user import User, Farmer, Staff, UserRole
from app.schemas.auth import FarmerRegisterRequest, LoginRequest, TokenResponse, UserResponse
from app.utils.security import hash_password, verify_password, create_access_token
from app.middleware.auth import get_current_user
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register_farmer(req: FarmerRegisterRequest, db: Session = Depends(get_db)):
    # Check if mobile already exists
    existing_user = db.query(User).filter(User.mobile == req.mobile).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this mobile number is already registered"
        )

    # Generate or validate Farmer ID
    farmer_id = req.farmer_id
    if not farmer_id:
        random_suffix = str(uuid.uuid4().int)[:5]
        farmer_id = f"FID-2026-{random_suffix}"
    else:
        existing_fid = db.query(Farmer).filter(Farmer.farmer_id == farmer_id).first()
        if existing_fid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Farmer ID is already registered"
            )

    # Create User
    new_user = User(
        mobile=req.mobile,
        hashed_password=hash_password(req.password),
        role=UserRole.FARMER.value,
        is_active=True
    )
    db.add(new_user)
    db.flush()

    # Create Farmer profile
    farmer_profile = Farmer(
        user_id=new_user.id,
        farmer_id=farmer_id,
        full_name=req.name,
        mobile=req.mobile,
        address=req.address,
        district=req.district,
        state=req.state,
        preferred_language=req.preferred_language or "en"
    )
    db.add(farmer_profile)
    db.commit()
    db.refresh(new_user)

    # Create welcome notification
    await NotificationService.create_notification(
        db=db,
        user_id=new_user.id,
        title="Welcome to Smart Farmer Procurement",
        message=f"Welcome {req.name}! Your Farmer ID is {farmer_id}. You can now book procurement slots.",
        notif_type="system"
    )

    access_token = create_access_token(data={"sub": str(new_user.id), "role": new_user.role})
    return TokenResponse(access_token=access_token, user=new_user)

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    # Look up user by mobile, email, or linked Farmer ID / Staff code
    user = db.query(User).filter(
        or_(
            User.mobile == req.username,
            User.email == req.username
        )
    ).first()

    if not user:
        # Check by Farmer ID
        farmer = db.query(Farmer).filter(Farmer.farmer_id == req.username).first()
        if farmer:
            user = db.query(User).filter(User.id == farmer.user_id).first()

    if not user:
        # Check by Staff Code
        staff = db.query(Staff).filter(Staff.staff_code == req.username).first()
        if staff:
            user = db.query(User).filter(User.id == staff.user_id).first()

    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Please verify your mobile/email/ID and password."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated. Please contact your procurement administrator."
        )

    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return TokenResponse(access_token=access_token, user=user)

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
