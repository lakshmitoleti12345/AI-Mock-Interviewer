import json
import logging
from typing import Any

import google.generativeai as genai

from app.core.config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)

PLACEHOLDER_KEYS = {
    "",
    "your-gemini-api-key-here",
    "your_api_key_here",
    "changeme",
}


def is_gemini_configured() -> bool:
    key = (settings.gemini_api_key or "").strip()
    return bool(key) and key.lower() not in PLACEHOLDER_KEYS


class GeminiService:
    def __init__(self):
        self._configured = is_gemini_configured()
        self._last_error: str | None = None
        if self._configured:
            genai.configure(api_key=settings.gemini_api_key.strip())
            self._model = genai.GenerativeModel(settings.gemini_model)
        else:
            self._last_error = (
                "Gemini API key is not configured. Set GEMINI_API_KEY in backend/.env "
                "to enable AI question generation and evaluation."
            )

    @property
    def configured(self) -> bool:
        return self._configured

    @property
    def last_error(self) -> str | None:
        return self._last_error

    def _generate(self, prompt: str) -> str | None:
        if not self._configured:
            return None
        try:
            response = self._model.generate_content(prompt)
            return response.text.strip()
        except Exception as exc:
            self._last_error = str(exc)
            logger.warning("Gemini API call failed: %s", exc)
            return None

    def generate_questions(
        self,
        role: str,
        experience_level: str,
        difficulty: str,
        interview_type: str,
        count: int,
        resume_context: str = "",
    ) -> list[dict[str, str]]:
        if not self._configured:
            return self._fallback_questions(role, count)

        prompt = f"""
You are a Senior Technical Interviewer at Google, Microsoft and Amazon.
...
Return ONLY JSON.
"""
        raw = self._generate(prompt)

        if not raw:
            return self._fallback_questions(role, count)

        cleaned = (
            raw.replace("```json", "")
            .replace("```", "")
            .strip()
        )

        try:
            data = json.loads(cleaned)
            if not isinstance(data, list):
                raise ValueError()
            return data[:count]
        except Exception:
            return self._fallback_questions(role, count)

    def evaluate_answer(
        self,
        question: str,
        answer: str,
        role: str,
        difficulty: str,
    ) -> dict[str, Any]:
        if not self._configured:
            return self._fallback_evaluation(answer)

        prompt = f"""Evaluate this interview answer. Return ONLY valid JSON:
...
No markdown, only JSON."""
        raw = self._generate(prompt)
        if not raw:
            return self._fallback_evaluation(answer)

        cleaned = raw.replace("```json", "").replace("```", "").strip()
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            return self._fallback_evaluation(answer)

    def generate_interview_summary(
        self,
        role: str,
        evaluations: list[dict[str, Any]],
    ) -> dict[str, Any]:
        if not self._configured:
            return self._fallback_summary(evaluations)

        prompt = f"""Summarize this mock interview session for role {role}.
...
No markdown, only JSON."""
        raw = self._generate(prompt)
        if not raw:
            return self._fallback_summary(evaluations)

        cleaned = raw.replace("```json", "").replace("```", "").strip()
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            return self._fallback_summary(evaluations)

    @staticmethod
    def _fallback_questions(role: str, count: int):
        role = role.lower()

        if "python" in role:
            base = [
                {"question": "Explain List vs Tuple.", "category": "Python"},
                {"question": "What are decorators?", "category": "Python"},
                {"question": "What is __name__=='__main__'?", "category": "Python"},
                {"question": "Difference between deep copy and shallow copy.", "category": "Python"},
                {"question": "Explain generators.", "category": "Python"},
                {"question": "Explain exception handling.", "category": "Python"},
                {"question": "Difference between multithreading and multiprocessing.", "category": "Python"},
                {"question": "Explain OOP concepts.", "category": "Python"},
            ]
        elif "react" in role:
            base = [
                {"question": "Difference between state and props.", "category": "React"},
                {"question": "What is Virtual DOM?", "category": "React"},
                {"question": "Explain useEffect.", "category": "React"},
                {"question": "What is Context API?", "category": "React"},
                {"question": "How does React rendering work?", "category": "React"},
            ]
        elif "software" in role or "testing" in role:
            base = [
                {"question": "Difference between Smoke and Sanity testing.", "category": "Testing"},
                {"question": "Explain STLC.", "category": "Testing"},
                {"question": "What is Regression Testing?", "category": "Testing"},
                {"question": "Difference between Severity and Priority.", "category": "Testing"},
                {"question": "Write test cases for Login page.", "category": "Testing"},
            ]
        else:
            base = [
                {"question": "Tell me about yourself.", "category": "HR"},
                {"question": "Explain your final year project.", "category": "Project"},
                {"question": "Describe a challenging problem you solved.", "category": "Behavioral"},
                {"question": "Why should we hire you?", "category": "HR"},
                {"question": "What are your strengths?", "category": "HR"},
            ]

        while len(base) < count:
            base.extend(base)

        return base[:count]

    @staticmethod
    def _fallback_evaluation(answer: str) -> dict[str, Any]:
        word_count = len(answer.split())
        length_score = min(max(word_count * 2, 40), 85)
        message = (
            "Answer recorded using basic scoring."
            if is_gemini_configured()
            else "Answer recorded. Configure GEMINI_API_KEY in backend/.env for AI-powered evaluation."
        )
        return {
            "score": length_score,
            "communication_score": length_score,
            "technical_score": max(length_score - 5, 35),
            "confidence_score": length_score,
            "grammar_score": length_score,
            "feedback": message,
            "strengths": ["Provided a complete response"],
            "weaknesses": ["Add more specific examples and metrics"],
            "suggestions": ["Structure answers using the STAR method"],
        }

    @staticmethod
    def _fallback_summary(evaluations: list[dict[str, Any]]) -> dict[str, Any]:
        scores = [e.get("score", 70) for e in evaluations]
        comm = [e.get("communication_score", e.get("score", 70)) for e in evaluations]
        tech = [e.get("technical_score", e.get("score", 70)) for e in evaluations]
        conf = [e.get("confidence_score", e.get("score", 70)) for e in evaluations]
        gram = [e.get("grammar_score", e.get("score", 70)) for e in evaluations]

        def avg(values: list) -> float:
            return round(sum(values) / len(values), 1) if values else 70.0

        overall = avg(scores)
        return {
            "overall_score": overall,
            "communication_score": avg(comm),
            "technical_score": avg(tech),
            "confidence_score": avg(conf),
            "grammar_score": avg(gram),
            "overall_rating": (
                "Excellent" if overall >= 85
                else "Good" if overall >= 70
                else "Average" if overall >= 55
                else "Needs Improvement"
            ),
            "strengths": ["Consistent effort across questions"],
            "weaknesses": ["Room for deeper technical detail"],
            "suggestions": ["Practice structured answers using STAR method"],
        }
