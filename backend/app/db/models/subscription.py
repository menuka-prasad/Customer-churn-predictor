from sqlalchemy import Column, Text, DateTime, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from backend.app.db.database import Base

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(
        UUID(as_uuid=True), 
        primary_key=True, 
        server_default=text("gen_random_uuid()")
    )
    
    # References our public.users table
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    stripe_customer_id = Column(Text, nullable=True)
    stripe_subscription_id = Column(Text, nullable=True)
    plan = Column(Text, nullable=False)
    status = Column(Text, nullable=False) # e.g. active, cancelled, past_due
    
    current_period_end = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
