from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.application.schemas.auth import ProfileUpdate, UserResponse
from app.application.schemas.settings import SettingsResponse, SettingsUpdate
from app.application.services.user_service import UserService
from app.core.config import get_settings as get_app_settings
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.infrastructure.models.user import User
from app.infrastructure.services.gemini_service import GeminiService, is_gemini_configured

router = APIRouter(prefix="/settings", tags=["Settings"])
app_settings = get_app_settings()


@router.get("", response_model=SettingsResponse)
def read_settings(current_user: User = Depends(get_current_user)):
    gemini = GeminiService()
    message = None
    if not is_gemini_configured():
        message = (
            "Gemini API key is not configured. Set GEMINI_API_KEY in backend/.env "
            "to enable AI question generation and evaluation."
        )
    elif gemini.last_error:
        message = f"Gemini is configured but last request failed: {gemini.last_error}"

    return SettingsResponse(
        user=UserResponse.model_validate(current_user),
        gemini_configured=is_gemini_configured(),
        gemini_message=message,
        app_name=app_settings.app_name,
        app_env=app_settings.app_env,
    )


@router.put("", response_model=UserResponse)
def update_settings(
    data: SettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = UserService(db)
    profile_data = ProfileUpdate(**data.model_dump(exclude_unset=True))
    return service.update_profile(current_user, profile_data)
