from typing import Optional

from pydantic import BaseModel, Field

from app.application.schemas.auth import UserResponse


class SettingsResponse(BaseModel):
    user: UserResponse
    gemini_configured: bool
    gemini_message: Optional[str] = None
    app_name: str
    app_env: str


class SettingsUpdate(BaseModel):
    full_name: Optional[str] = Field(default=None, min_length=2, max_length=150)
    photo_url: Optional[str] = Field(default=None, max_length=500)
    experience: Optional[str] = Field(default=None, max_length=50)
    preferred_role: Optional[str] = Field(default=None, max_length=100)
    skills: Optional[str] = None
