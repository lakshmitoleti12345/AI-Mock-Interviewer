from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.application.schemas.interview import (
    AnswerSubmit,
    InterviewCreate,
    InterviewListItem,
    InterviewResponse,
    QuestionResponse,
)
from app.application.services.interview_service import InterviewService
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.infrastructure.models.user import User

router = APIRouter(prefix="/interviews", tags=["Interviews"])


def _serialize_interview(interview) -> InterviewResponse:
    questions = []
    for q in sorted(interview.questions, key=lambda x: x.order_index):
        questions.append(
            QuestionResponse(
                id=q.id,
                order_index=q.order_index,
                question_text=q.question_text,
                category=q.category,
                answered=q.answer is not None,
            )
        )
    return InterviewResponse(
        id=interview.id,
        role=interview.role,
        experience_level=interview.experience_level,
        difficulty=interview.difficulty,
        interview_type=interview.interview_type,
        question_count=interview.question_count,
        status=interview.status,
        overall_score=interview.overall_score,
        communication_score=interview.communication_score,
        technical_score=interview.technical_score,
        confidence_score=interview.confidence_score,
        grammar_score=interview.grammar_score,
        overall_rating=interview.overall_rating,
        strengths=interview.strengths,
        weaknesses=interview.weaknesses,
        suggestions=interview.suggestions,
        created_at=interview.created_at,
        completed_at=interview.completed_at,
        questions=questions,
    )


@router.post("", response_model=InterviewResponse, status_code=201)
def create_interview(
    data: InterviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = InterviewService(db)
    interview = service.create_interview(current_user, data)
    return _serialize_interview(interview)


@router.get("", response_model=List[InterviewListItem])
def list_interviews(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = InterviewService(db)
    return service.list_interviews(current_user.id)


@router.get("/{interview_id}", response_model=InterviewResponse)
def get_interview(
    interview_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = InterviewService(db)
    interview = service.get_interview(current_user.id, interview_id)
    return _serialize_interview(interview)


@router.post("/{interview_id}/questions/{question_id}/answer")
def submit_answer(
    interview_id: int,
    question_id: int,
    data: AnswerSubmit,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = InterviewService(db)
    evaluation = service.submit_answer(current_user, interview_id, question_id, data)
    return {"message": "Answer submitted", "evaluation": evaluation}


@router.post("/{interview_id}/complete", response_model=InterviewResponse)
def complete_interview(
    interview_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = InterviewService(db)
    interview = service.complete_interview(current_user, interview_id)
    return _serialize_interview(interview)
