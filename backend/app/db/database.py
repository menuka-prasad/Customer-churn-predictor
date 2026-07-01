import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy.pool import NullPool

# 1. Explicitly locate the .env file in the root 'backend' folder
env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=env_path)

# Example: postgresql+asyncpg://user:password@aws-0-region.pooler.supabase.com:6543/postgres
DATABASE_URL = os.getenv("DATABASE_URL")


# 2. Add a safety check so we get a clear error if the .env variable is missing
if not DATABASE_URL:
    raise ValueError(f"DATABASE_URL is missing! Checked for .env at: {env_path}")


engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    # Crucial: Disables SQLAlchemy's internal pooling to let Supabase handle it
    poolclass=NullPool 
)

SessionLocal = async_sessionmaker(bind=engine, expire_on_commit=False, autoflush=False)
Base = declarative_base()