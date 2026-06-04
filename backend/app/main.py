from fastapi import FastAPI
from backend.app.services.prediction_service import PredictionService
import pandas as pd
from backend.app.schemas.customer_data import CustomerData

app = FastAPI()

prediction_service = PredictionService()


@app.post("/predict")
async def predict(customer: CustomerData):
    # convert pydantic model to dataframe
    input_df = pd.DataFrame([customer.dict()])
    
    
    result = prediction_service.predict(input_df)
    
    return result

