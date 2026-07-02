from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, text, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.db.database import Base

class ApiKey(Base):
    __tablename__ = "api_keys"

    id = Column(
        UUID(as_uuid=True), 
        primary_key=True, 
        server_default=text("gen_random_uuid()")
    )
    # References public.users table
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    key = Column(Text, unique=True, nullable=False)
    name = Column(Text, nullable=True)
    
    # Use server_default to ensure the DB applies the default if inserted outside SQLAlchemy
    requests_used = Column(Integer, default=0, server_default="0")
    requests_limit = Column(Integer, default=50, server_default="50")
    
    is_active = Column(Boolean, default=True, server_default="true")
    
    created_at = Column(DateTime, server_default=func.now())
    last_used_at = Column(DateTime, nullable=True)