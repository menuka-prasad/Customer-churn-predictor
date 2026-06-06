from fastapi import FastAPI
from app.services.prediction_service import PredictionService
import pandas as pd
from app.schemas.customer_data import CustomerData
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

prediction_service = PredictionService()


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

