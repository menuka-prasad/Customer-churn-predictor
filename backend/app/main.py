from fastapi import FastAPI
from app.services.prediction_service import PredictionService
from app.services.explanation_service import ExplanationService
import pandas as pd
from app.schemas.customer_data import CustomerData
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

prediction_service = PredictionService()
explanation_service = ExplanationService()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict(customer: CustomerData):
    # convert pydantic model to dataframe
    input_df = pd.DataFrame([customer.dict()])
    
    
    result = prediction_service.predict(input_df)
    
    return result

@app.post("/api/explain")
async def explain(customer: CustomerData):
    input_df = pd.DataFrame([customer.dict()])
    
    # Normally we'd get the prediction probability, but we can compute it or pass it.
    # For now, we'll just explain. The explanation_service calculates SHAP on the input.
    factors = explanation_service.explain(input_df, 0.5)
    
    return {"shap_values": factors}


