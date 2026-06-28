from typing import Annotated, Callable

from fastapi import Depends, Header
from sqlalchemy.orm import Session

from app.application.services.auth_service import AuthService
from app.core.database import get_db
from app.core.exceptions import ForbiddenException, UnauthorizedException
from app.domain.enums import UserRole
from app.infrastructure.models.user import User


def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    return AuthService(db)


def get_current_user(
    authorization: Annotated[str | None, Header()] = None,
    auth_service: AuthService = Depends(get_auth_service),
) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise UnauthorizedException("Missing authentication token")
    token = authorization.split(" ", 1)[1]
    return auth_service.get_current_user(token)


def require_roles(*roles: UserRole) -> Callable:
    def checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in [r.value for r in roles]:
            raise ForbiddenException()
        return current_user

    return checker
