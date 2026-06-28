from sqlalchemy.orm import Session

from app.application.schemas.auth import UserRegister
from app.core.exceptions import ConflictException, UnauthorizedException
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.domain.enums import UserRole
from app.infrastructure.models.user import User
from app.infrastructure.repositories.user_repository import UserRepository


class AuthService:
    def __init__(self, db: Session):
        self.repo = UserRepository(db)

    def register(self, data: UserRegister) -> User:
        if self.repo.get_by_email(data.email):
            raise ConflictException("Email already registered")
        user = User(
            email=data.email.lower(),
            hashed_password=hash_password(data.password),
            full_name=data.full_name,
            role=UserRole.USER.value,
        )
        return self.repo.create(user)

    def login(self, email: str, password: str) -> dict:
        user = self.repo.get_by_email(email)
        if not user or not verify_password(password, user.hashed_password):
            raise UnauthorizedException("Invalid email or password")
        if not user.is_active:
            raise UnauthorizedException("Account is deactivated")
        return {
            "access_token": create_access_token(str(user.id), {"role": user.role}),
            "refresh_token": create_refresh_token(str(user.id)),
            "token_type": "bearer",
        }

    def refresh(self, refresh_token: str) -> dict:
        try:
            payload = decode_token(refresh_token)
        except ValueError as exc:
            raise UnauthorizedException("Invalid refresh token") from exc
        if payload.get("type") != "refresh":
            raise UnauthorizedException("Invalid token type")
        user = self.repo.get_by_id(int(payload["sub"]))
        if not user or not user.is_active:
            raise UnauthorizedException("User not found or inactive")
        return {
            "access_token": create_access_token(str(user.id), {"role": user.role}),
            "refresh_token": create_refresh_token(str(user.id)),
            "token_type": "bearer",
        }

    def get_current_user(self, token: str) -> User:
        try:
            payload = decode_token(token)
        except ValueError as exc:
            raise UnauthorizedException() from exc
        if payload.get("type") != "access":
            raise UnauthorizedException("Invalid token type")
        user = self.repo.get_by_id(int(payload["sub"]))
        if not user or not user.is_active:
            raise UnauthorizedException("User not found or inactive")
        return user
