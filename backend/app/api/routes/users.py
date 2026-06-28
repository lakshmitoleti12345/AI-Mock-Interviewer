from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.application.schemas.auth import ProfileUpdate, UserResponse
from app.application.services.user_service import UserService
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.infrastructure.models.user import User

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/profile", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/profile", response_model=UserResponse)
def update_profile(
    data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = UserService(db)
    return service.update_profile(current_user, data)
