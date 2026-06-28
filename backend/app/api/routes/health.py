from datetime import datetime, timezone

from fastapi import APIRouter
from pydantic import BaseModel

from app.core.config import get_settings
from app.infrastructure.services.gemini_service import is_gemini_configured

router = APIRouter(tags=["health"])
settings = get_settings()


class HealthResponse(BaseModel):
    status: str
    app_name: str
    environment: str
    timestamp: str
    gemini_configured: bool
    gemini_message: str | None = None


@router.get("/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    gemini_ok = is_gemini_configured()
    gemini_message = None
    if not gemini_ok:
        gemini_message = (
            "GEMINI_API_KEY is missing or invalid in .env. "
            "The app will use fallback questions and basic scoring."
        )

    return HealthResponse(
        status="ok",
        app_name=settings.app_name,
        environment=settings.app_env,
        timestamp=datetime.now(timezone.utc).isoformat(),
        gemini_configured=gemini_ok,
        gemini_message=gemini_message,
    )
