from datetime import date, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.slot import Slot
from app.schemas.slot import SlotCreate, SlotUpdate, SlotResponse
from app.middleware.auth import require_roles
from app.models.user import User, UserRole

router = APIRouter(prefix="/api/slots", tags=["Slots"])

@router.get("", response_model=List[SlotResponse])
def get_slots(
    centre_id: int,
    slot_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Slot).filter(Slot.centre_id == centre_id, Slot.is_active == True)
    if slot_date:
        query = query.filter(Slot.slot_date == slot_date)
    else:
        # Default to today and future dates
        query = query.filter(Slot.slot_date >= date.today()).order_by(Slot.slot_date.asc(), Slot.start_time.asc())

    return query.all()

@router.get("/{id}", response_model=SlotResponse)
def get_slot_detail(id: int, db: Session = Depends(get_db)):
    slot = db.query(Slot).filter(Slot.id == id).first()
    if not slot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Slot not found")
    return slot

@router.post("", response_model=SlotResponse, status_code=status.HTTP_201_CREATED)
def create_slot(
    req: SlotCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.STAFF.value, UserRole.ADMIN.value]))
):
    existing = db.query(Slot).filter(
        Slot.centre_id == req.centre_id,
        Slot.slot_date == req.slot_date,
        Slot.start_time == req.start_time,
        Slot.end_time == req.end_time
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A slot with this time window already exists for this centre and date"
        )

    slot = Slot(**req.dict(), booked_count=0)
    db.add(slot)
    db.commit()
    db.refresh(slot)
    return slot

@router.put("/{id}", response_model=SlotResponse)
def update_slot(
    id: int,
    req: SlotUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.STAFF.value, UserRole.ADMIN.value]))
):
    slot = db.query(Slot).filter(Slot.id == id).first()
    if not slot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Slot not found")

    for key, val in req.dict(exclude_unset=True).items():
        setattr(slot, key, val)

    db.commit()
    db.refresh(slot)
    return slot

@router.post("/{id}/close", response_model=SlotResponse)
def close_slot(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.STAFF.value, UserRole.ADMIN.value]))
):
    slot = db.query(Slot).filter(Slot.id == id).first()
    if not slot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Slot not found")

    slot.is_active = False
    db.commit()
    db.refresh(slot)
    return slot

@router.delete("/{id}")
def delete_slot(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.STAFF.value, UserRole.ADMIN.value]))
):
    slot = db.query(Slot).filter(Slot.id == id).first()
    if not slot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Slot not found")

    if slot.booked_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete slot with active bookings. Close it instead."
        )

    db.delete(slot)
    db.commit()
    return {"message": "Slot deleted successfully"}
