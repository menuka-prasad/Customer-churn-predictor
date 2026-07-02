from sqlalchemy import Column, Text, Float, DateTime, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func

from app.db.database import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(
        UUID(as_uuid=True), 
        primary_key=True, 
        server_default=text("gen_random_uuid()")
    )
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    api_key_id = Column(UUID(as_uuid=True), ForeignKey("api_keys.id"), nullable=False)
    
    # JSONB is highly recommended for PostgreSQL over standard JSON
    customer_data = Column(JSONB, nullable=False)
    churn_probability = Column(Float, nullable=False)
    risk_level = Column(Text, nullable=False)
    
    created_at = Column(DateTime, server_default=func.now())