from sqlalchemy import Column, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    # Matches auth.users.id
    id = Column(UUID(as_uuid=True), primary_key=True)
    
    email = Column(Text, nullable=False)
    plan = Column(Text, default="free", server_default="free")
    created_at = Column(DateTime, server_default=func.now())
