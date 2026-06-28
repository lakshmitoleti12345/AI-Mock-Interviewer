from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.application.schemas.interview import InterviewListItem
from app.application.services.interview_service import InterviewService
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.infrastructure.models.user import User

router = APIRouter(prefix="/history", tags=["History"])


@router.get("", response_model=List[InterviewListItem])
def get_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = InterviewService(db)
    return service.list_interviews(current_user.id)
