from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

from app.domain.enums import DifficultyLevel, ExperienceLevel, InterviewType


class InterviewCreate(BaseModel):
    role: str = Field(min_length=2, max_length=100)
    experience_level: ExperienceLevel
    difficulty: DifficultyLevel
    interview_type: InterviewType
    question_count: int = Field(default=5, ge=1, le=15)
    resume_id: Optional[int] = None


class AnswerSubmit(BaseModel):
    answer_text: str = Field(min_length=1)
    transcript: Optional[str] = None


class QuestionResponse(BaseModel):
    id: int
    order_index: int
    question_text: str
    category: Optional[str] = None
    answered: bool = False

    model_config = {"from_attributes": True}


class AnswerResponse(BaseModel):
    id: int
    answer_text: str
    transcript: Optional[str] = None
    score: Optional[float] = None
    evaluation: Optional[str] = None

    model_config = {"from_attributes": True}


class InterviewResponse(BaseModel):
    id: int
    role: str
    experience_level: str
    difficulty: str
    interview_type: str
    question_count: int
    status: str
    overall_score: Optional[float] = None
    communication_score: Optional[float] = None
    technical_score: Optional[float] = None
    confidence_score: Optional[float] = None
    grammar_score: Optional[float] = None
    overall_rating: Optional[str] = None
    strengths: Optional[str] = None
    weaknesses: Optional[str] = None
    suggestions: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    questions: List[QuestionResponse] = []

    model_config = {"from_attributes": True}


class InterviewListItem(BaseModel):
    id: int
    role: str
    difficulty: str
    interview_type: str
    status: str
    overall_score: Optional[float] = None
    overall_rating: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
