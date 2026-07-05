# Core Application Settings
# Auth is fully handled by Supabase — no custom secrets or token configs needed.

from typing import List, Optional, Union
import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl, validator

env_state = os.getenv("ENVIRONMENT", "development")
if env_state == "test":
    env_file = ".env.test"
elif env_state == "production":
    env_file = ".env.production"
else:
    env_file = ".env"


class Settings(BaseSettings):
    PROJECT_NAME: str = "CHURNLY API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # ── Supabase Auth ──
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_JWT_SECRET: Optional[str] = None
    SUPABASE_LEGACY_JWT_SECRET: Optional[str] = None

    @property
    def SUPABASE_ISSUER(self) -> str:
        return f"{self.SUPABASE_URL.rstrip('/')}/auth/v1"

    # ── Database ──
    # Set SQLALCHEMY_DATABASE_URI directly in .env for Supabase
    SQLALCHEMY_DATABASE_URI: Optional[str] = None

    # Fallback individual fields (only used if URI not set)
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "password"
    POSTGRES_DB: str = "postgres"
    POSTGRES_PORT: int = 5432

    @validator("SQLALCHEMY_DATABASE_URI", pre=True)
    def assemble_db_connection(cls, v: Optional[str], values: dict) -> str:
        if isinstance(v, str) and v.strip():
            return v.strip()
        return (
            f"postgresql://{values.get('POSTGRES_USER')}:{values.get('POSTGRES_PASSWORD')}"
            f"@{values.get('POSTGRES_SERVER')}:{values.get('POSTGRES_PORT', 5432)}"
            f"/{values.get('POSTGRES_DB')}"
        )

    SUPABASE_URL: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None

    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=env_file,
        extra="ignore",   # Ignore unrecognised env vars instead of raising
    )


settings = Settings()
