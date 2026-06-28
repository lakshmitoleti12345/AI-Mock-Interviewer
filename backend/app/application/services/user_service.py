import uuid
from pathlib import Path

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.application.schemas.auth import ProfileUpdate
from app.core.config import get_settings
from app.core.exceptions import NotFoundException, ValidationException
from app.infrastructure.models.resume import Resume
from app.infrastructure.models.user import User
from app.infrastructure.repositories.resume_repository import ResumeRepository
from app.infrastructure.repositories.user_repository import UserRepository
from app.infrastructure.services.pdf_extractor import PDFExtractor

settings = get_settings()


class UserService:
    def __init__(self, db: Session):
        self.repo = UserRepository(db)

    def update_profile(self, user: User, data: ProfileUpdate) -> User:
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(user, key, value)
        return self.repo.update(user)


class ResumeService:
    def __init__(self, db: Session):
        self.repo = ResumeRepository(db)
        self.extractor = PDFExtractor()

    async def upload(self, user: User, file: UploadFile) -> Resume:
        if not file.filename or not file.filename.lower().endswith(".pdf"):
            raise ValidationException("Only PDF files are allowed")

        content = await file.read()
        max_bytes = settings.max_upload_size_mb * 1024 * 1024
        if len(content) > max_bytes:
            raise ValidationException(f"File exceeds {settings.max_upload_size_mb}MB limit")

        user_dir = settings.upload_path / str(user.id)
        user_dir.mkdir(parents=True, exist_ok=True)
        safe_name = f"{uuid.uuid4().hex}_{file.filename}"
        file_path = user_dir / safe_name

        with open(file_path, "wb") as f:
            f.write(content)

        extracted_text = self.extractor.extract_text(file_path)
        sections = self.extractor.parse_sections(extracted_text)

        resume = Resume(
            user_id=user.id,
            filename=file.filename,
            file_path=str(file_path),
            extracted_text=extracted_text[:10000],
            skills=sections["skills"],
            projects=sections["projects"],
            education=sections["education"],
            experience_data=sections["experience"],
        )
        return self.repo.create(resume)

    def list_resumes(self, user_id: int) -> list[Resume]:
        return self.repo.get_by_user(user_id)

    def get_resume(self, user_id: int, resume_id: int) -> Resume:
        resume = self.repo.get_by_id(resume_id)
        if not resume or resume.user_id != user_id:
            raise NotFoundException("Resume not found")
        return resume

    def delete_resume(self, user: User, resume_id: int) -> None:
        resume = self.get_resume(user.id, resume_id)
        path = Path(resume.file_path)
        if path.exists():
            path.unlink()
        self.repo.delete(resume)
