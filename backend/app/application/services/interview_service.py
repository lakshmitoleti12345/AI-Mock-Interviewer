import json
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.application.schemas.interview import AnswerSubmit, InterviewCreate
from app.core.exceptions import NotFoundException, ValidationException
from app.domain.enums import InterviewStatus
from app.infrastructure.models.answer import Answer
from app.infrastructure.models.interview import Interview
from app.infrastructure.models.question import Question
from app.infrastructure.models.user import User
from app.infrastructure.repositories.interview_repository import InterviewRepository
from app.infrastructure.repositories.resume_repository import ResumeRepository
from app.infrastructure.services.gemini_service import GeminiService


class InterviewService:
    def __init__(self, db: Session):
        self.repo = InterviewRepository(db)
        self.resume_repo = ResumeRepository(db)
        self.gemini = GeminiService()

    def create_interview(self, user: User, data: InterviewCreate) -> Interview:
        resume_context = ""
        if data.resume_id:
            resume = self.resume_repo.get_by_id(data.resume_id)
            if not resume or resume.user_id != user.id:
                raise NotFoundException("Resume not found")
            resume_context = resume.extracted_text or ""

        questions_data = self.gemini.generate_questions(
            role=data.role,
            experience_level=data.experience_level.value,
            difficulty=data.difficulty.value,
            interview_type=data.interview_type.value,
            count=data.question_count,
            resume_context=resume_context,
        )

        interview = Interview(
            user_id=user.id,
            resume_id=data.resume_id,
            role=data.role,
            experience_level=data.experience_level.value,
            difficulty=data.difficulty.value,
            interview_type=data.interview_type.value,
            question_count=data.question_count,
            status=InterviewStatus.IN_PROGRESS.value,
        )
        interview = self.repo.create(interview)

        for idx, q in enumerate(questions_data):
            question = Question(
                interview_id=interview.id,
                order_index=idx,
                question_text=q.get("question", f"Question {idx + 1}"),
                category=q.get("category"),
            )
            self.repo.add_question(question)

        return self.repo.get_by_id(interview.id)

    def get_interview(self, user_id: int, interview_id: int) -> Interview:
        interview = self.repo.get_by_id(interview_id)
        if not interview or interview.user_id != user_id:
            raise NotFoundException("Interview not found")
        return interview

    def submit_answer(
        self, user: User, interview_id: int, question_id: int, data: AnswerSubmit
    ) -> dict:
        interview = self.get_interview(user.id, interview_id)
        if interview.status == InterviewStatus.COMPLETED.value:
            raise ValidationException("Interview already completed")

        question = self.repo.get_question(question_id)
        if not question or question.interview_id != interview_id:
            raise NotFoundException("Question not found")

        if question.answer:
            raise ValidationException("Question already answered")

        evaluation = self.gemini.evaluate_answer(
            question=question.question_text,
            answer=data.answer_text,
            role=interview.role,
            difficulty=interview.difficulty,
        )

        answer = Answer(
            question_id=question_id,
            answer_text=data.answer_text,
            transcript=data.transcript,
            evaluation=json.dumps(evaluation),
            score=evaluation.get("score"),
        )
        self.repo.add_answer(answer)
        return evaluation

    def complete_interview(self, user: User, interview_id: int) -> Interview:
        interview = self.get_interview(user.id, interview_id)
        if interview.status == InterviewStatus.COMPLETED.value:
            return interview

        evaluations = []
        for q in interview.questions:
            if q.answer and q.answer.evaluation:
                evaluations.append(json.loads(q.answer.evaluation))

        if not evaluations:
            raise ValidationException("No answers submitted yet")

        summary = self.gemini.generate_interview_summary(interview.role, evaluations)

        interview.overall_score = summary.get("overall_score")
        interview.communication_score = summary.get("communication_score")
        interview.technical_score = summary.get("technical_score")
        interview.confidence_score = summary.get("confidence_score")
        interview.grammar_score = summary.get("grammar_score")
        interview.overall_rating = summary.get("overall_rating")
        interview.strengths = json.dumps(summary.get("strengths", []))
        interview.weaknesses = json.dumps(summary.get("weaknesses", []))
        interview.suggestions = json.dumps(summary.get("suggestions", []))
        interview.status = InterviewStatus.COMPLETED.value
        interview.completed_at = datetime.now(timezone.utc)

        return self.repo.update(interview)

    def list_interviews(self, user_id: int) -> list[Interview]:
        return self.repo.get_by_user(user_id)
