from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.application.schemas.dashboard import DashboardStats
from app.application.services.dashboard_service import DashboardService
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.infrastructure.models.user import User

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = DashboardService(db)
    return service.get_stats(current_user.id)
