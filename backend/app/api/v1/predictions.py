# app/routers/predict.py
from fastapi import APIRouter
from fastapi.concurrency import run_in_threadpool
import pandas as pd

from app.schemas.customer_data import CustomerData
from app.services.prediction_service import PredictionService
from app.services.explanation_service import ExplanationService

# 1. Create the router (you can optionally group them with tags and a prefix)
router = APIRouter(prefix="/models", tags=["Predictions"])

# Initialize your ML services
prediction_service = PredictionService()
explanation_service = ExplanationService()

# 2. Use @router instead of @app
@router.post("/predict")
async def predict(customer: CustomerData):
    input_df = pd.DataFrame([customer.model_dump()])
    result = await run_in_threadpool(prediction_service.predict, input_df)
    return result

@router.post("/explain")
async def explain(customer: CustomerData):
    input_df = pd.DataFrame([customer.model_dump()])
    factors = await run_in_threadpool(explanation_service.explain, input_df, 0.5)
    return {"shap_values": factors}