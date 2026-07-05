from fastapi import APIRouter

from app.api.v1 import predictions


api_router = APIRouter()

api_router.include_router(predictions.router, prefix="/prediction", tags=["prediction"])