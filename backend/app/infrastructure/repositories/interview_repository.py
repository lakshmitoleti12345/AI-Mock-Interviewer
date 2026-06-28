from typing import List, Optional

from sqlalchemy.orm import Session, joinedload

from app.infrastructure.models.answer import Answer
from app.infrastructure.models.interview import Interview
from app.infrastructure.models.question import Question


class InterviewRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, interview_id: int) -> Optional[Interview]:
        return (
            self.db.query(Interview)
            .options(joinedload(Interview.questions).joinedload(Question.answer))
            .filter(Interview.id == interview_id)
            .first()
        )

    def get_by_user(self, user_id: int, limit: int = 50) -> List[Interview]:
        return (
            self.db.query(Interview)
            .filter(Interview.user_id == user_id)
            .order_by(Interview.created_at.desc())
            .limit(limit)
            .all()
        )

    def create(self, interview: Interview) -> Interview:
        self.db.add(interview)
        self.db.commit()
        self.db.refresh(interview)
        return interview

    def update(self, interview: Interview) -> Interview:
        self.db.commit()
        self.db.refresh(interview)
        return interview

    def add_question(self, question: Question) -> Question:
        self.db.add(question)
        self.db.commit()
        self.db.refresh(question)
        return question

    def add_answer(self, answer: Answer) -> Answer:
        self.db.add(answer)
        self.db.commit()
        self.db.refresh(answer)
        return answer

    def get_question(self, question_id: int) -> Optional[Question]:
        return self.db.query(Question).filter(Question.id == question_id).first()

    def count_by_user(self, user_id: int) -> int:
        return self.db.query(Interview).filter(Interview.user_id == user_id).count()

    def completed_by_user(self, user_id: int) -> List[Interview]:
        return (
            self.db.query(Interview)
            .filter(Interview.user_id == user_id, Interview.status == "completed")
            .order_by(Interview.created_at.desc())
            .all()
        )
