from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ResumeResponse(BaseModel):
    id: int
    user_id: int
    filename: str
    extracted_text: Optional[str] = None
    skills: Optional[str] = None
    projects: Optional[str] = None
    education: Optional[str] = None
    experience_data: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class ResumeUploadResponse(BaseModel):
    message: str
    resume: ResumeResponse
