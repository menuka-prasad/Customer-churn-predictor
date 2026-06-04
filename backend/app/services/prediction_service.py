import joblib
import sys
from pathlib import Path
import json

PROJECT_ROOT = Path(__file__).resolve().parents[3]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.append(str(PROJECT_ROOT))
    
from backend.app.services.feature_engineering import (
    engineer_features
)
    
model_path = (
    PROJECT_ROOT /
    "backend" /
    "app" /
    "models" /
    "artifacts" /
    "churn_pipeline.pkl"
)

threshold_path = (
    PROJECT_ROOT /
    "backend" /
    "app" /
    "models" /
    "artifacts" /
    "threshold.json"
)

with open(threshold_path, "r") as f:
    threshold_data = json.load(f)
    

class PredictionService:
    def __init__(self):
        # load model and threshold here ONCE
        self.model = joblib.load(model_path)
        self.custom_threshold = threshold_data["threshold"]
        
    
    def predict(self, input_data):
        # use already-loaded model to predict
        input_data["SeniorCitizen"] = input_data["SeniorCitizen"].astype(int)
        input_data = engineer_features(input_data)
        
        y_prob = self.model.predict_proba(input_data)[:, 1]
        y_pred = (y_prob >= self.custom_threshold).astype(int)
        
        results = []
        
        for prob, pred in zip(y_prob, y_pred):
            if (prob < 0.30):
                risk_level = "Very Low"
            elif (prob < 0.50):
                risk_level = "Low"
            elif (prob < 0.70):
                risk_level = "Medium"
            else: 
                risk_level = "High"

            results.append({
                "churn_probability": round(float(prob), 4),
                "churn_prediction": int(pred),
                "risk_level": risk_level
            
            })
        
        if len(results) == 1:
            return results[0]
        
        return results