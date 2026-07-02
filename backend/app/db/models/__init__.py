# 1. Import the Base
from app.db.database import Base

# 2. Import all your model classes here
from .user import User
from .subscription import Subscription
from .api_key import ApiKey 
from .prediction import Prediction