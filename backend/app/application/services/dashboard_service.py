import json

from sqlalchemy.orm import Session

from app.application.schemas.dashboard import DashboardStats
from app.application.schemas.interview import InterviewListItem
from app.infrastructure.repositories.interview_repository import InterviewRepository


class DashboardService:
    def __init__(self, db: Session):
        self.repo = InterviewRepository(db)

    def get_stats(self, user_id: int) -> DashboardStats:
        all_interviews = self.repo.get_by_user(user_id, limit=100)
        completed = [i for i in all_interviews if i.status == "completed"]
        scores = [i.overall_score for i in completed if i.overall_score is not None]

        weak_topics: set[str] = set()
        strong_topics: set[str] = set()
        for interview in completed:
            if interview.weaknesses:
                try:
                    for w in json.loads(interview.weaknesses):
                        weak_topics.add(str(w)[:80])
                except json.JSONDecodeError:
                    pass
            if interview.strengths:
                try:
                    for s in json.loads(interview.strengths):
                        strong_topics.add(str(s)[:80])
                except json.JSONDecodeError:
                    pass

        score_trend = [
            {
                "date": i.completed_at.isoformat() if i.completed_at else i.created_at.isoformat(),
                "score": i.overall_score,
                "role": i.role,
            }
            for i in completed[:10]
        ]

        return DashboardStats(
            total_interviews=len(all_interviews),
            completed_interviews=len(completed),
            average_score=round(sum(scores) / len(scores), 1) if scores else None,
            best_score=max(scores) if scores else None,
            recent_interviews=[InterviewListItem.model_validate(i) for i in all_interviews[:5]],
            weak_topics=list(weak_topics)[:5],
            strong_topics=list(strong_topics)[:5],
            score_trend=score_trend,
        )
