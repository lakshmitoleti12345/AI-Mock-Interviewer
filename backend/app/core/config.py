from functools import lru_cache
from pathlib import Path
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    app_name: str = "AI Mock Interviewer"
    app_env: str = "development"
    debug: bool = True

    database_url: str = "sqlite:///./mock_interviewer.db"

    secret_key: str = "change-this-to-a-long-random-secret-key-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    refresh_token_expire_days: int = 7

    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.0-flash"

    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    upload_dir: str = str(BASE_DIR / "uploads")
    max_upload_size_mb: int = 10

    rate_limit: str = "60/minute"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def upload_path(self) -> Path:
        path = Path(self.upload_dir)
        path.mkdir(parents=True, exist_ok=True)
        return path


@lru_cache
def get_settings() -> Settings:
    return Settings()
