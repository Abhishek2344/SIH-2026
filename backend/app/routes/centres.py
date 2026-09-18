from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.centre import Centre
from app.models.slot import Slot
from app.models.queue import QueueEntry, QueueStatus
from app.schemas.centre import CentreCreate, CentreUpdate, CentreResponse
from app.middleware.auth import get_current_user, require_roles
from app.models.user import User, UserRole

router = APIRouter(prefix="/api/centres", tags=["Procurement Centres"])

@router.get("", response_model=List[CentreResponse])
def get_all_centres(
    state: Optional[str] = None,
    district: Optional[str] = None,
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    query = db.query(Centre)
    if active_only:
        query = query.filter(Centre.is_active == True)
    if state:
        query = query.filter(Centre.state.ilike(f"%{state}%"))
    if district:
        query = query.filter(Centre.district.ilike(f"%{district}%"))

    centres = query.all()
    today = date.today()

    result = []
    for c in centres:
        # Calculate active waiting/serving queue count for today
        queue_count = (
            db.query(func.count(QueueEntry.id))
            .filter(
                QueueEntry.centre_id == c.id,
                QueueEntry.queue_date == today,
                QueueEntry.status.in_([QueueStatus.WAITING.value, QueueStatus.CALLED.value, QueueStatus.SERVING.value])
            )
            .scalar() or 0
        )

        # Calculate available slots remaining today
        slots_today = db.query(Slot).filter(
            Slot.centre_id == c.id,
            Slot.slot_date == today,
            Slot.is_active == True
        ).all()
        avail_count = sum(s.available_count for s in slots_today)

        centre_dict = CentreResponse.model_validate(c)
        centre_dict.current_queue_size = queue_count
        centre_dict.available_slots_count = avail_count
        result.append(centre_dict)

    return result

@router.get("/{id}", response_model=CentreResponse)
def get_centre_detail(id: int, db: Session = Depends(get_db)):
    centre = db.query(Centre).filter(Centre.id == id).first()
    if not centre:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Procurement centre not found")

    today = date.today()
    queue_count = (
        db.query(func.count(QueueEntry.id))
        .filter(
            QueueEntry.centre_id == id,
            QueueEntry.queue_date == today,
            QueueEntry.status.in_([QueueStatus.WAITING.value, QueueStatus.CALLED.value, QueueStatus.SERVING.value])
        )
        .scalar() or 0
    )

    slots_today = db.query(Slot).filter(
        Slot.centre_id == id,
        Slot.slot_date == today,
        Slot.is_active == True
    ).all()
    avail_count = sum(s.available_count for s in slots_today)

    centre_dict = CentreResponse.model_validate(centre)
    centre_dict.current_queue_size = queue_count
    centre_dict.available_slots_count = avail_count
    return centre_dict

@router.post("", response_model=CentreResponse, status_code=status.HTTP_201_CREATED)
def create_centre(
    req: CentreCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_roles([UserRole.ADMIN.value]))
):
    existing = db.query(Centre).filter(Centre.code == req.code).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Centre code already exists")

    centre = Centre(**req.dict())
    db.add(centre)
    db.commit()
    db.refresh(centre)
    return centre

@router.put("/{id}", response_model=CentreResponse)
def update_centre(
    id: int,
    req: CentreUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_roles([UserRole.ADMIN.value, UserRole.STAFF.value]))
):
    centre = db.query(Centre).filter(Centre.id == id).first()
    if not centre:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Centre not found")

    for key, val in req.dict(exclude_unset=True).items():
        setattr(centre, key, val)

    db.commit()
    db.refresh(centre)
    return centre

@router.delete("/{id}")
def delete_centre(
    id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_roles([UserRole.ADMIN.value]))
):
    centre = db.query(Centre).filter(Centre.id == id).first()
    if not centre:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Centre not found")
    centre.is_active = False
    db.commit()
    return {"message": "Centre deactivated successfully"}
