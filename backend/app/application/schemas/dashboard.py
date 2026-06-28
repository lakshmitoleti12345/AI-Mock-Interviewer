from typing import List, Optional

from pydantic import BaseModel

from app.application.schemas.interview import InterviewListItem


class DashboardStats(BaseModel):
    total_interviews: int
    completed_interviews: int
    average_score: Optional[float]
    best_score: Optional[float]
    recent_interviews: List[InterviewListItem]
    weak_topics: List[str]
    strong_topics: List[str]
    score_trend: List[dict]
