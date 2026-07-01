import joblib
import pandas as pd
import numpy as np
from pathlib import Path
from collections import defaultdict
import shap
from backend.app.services.feature_engineering import engineer_features


PROJECT_ROOT = Path(__file__).resolve().parents[3]

model_path = (
    PROJECT_ROOT /
    "backend" /
    "app" /
    "ml_models" /
    "artifacts" /
    "churn_pipeline.pkl"
)

class ExplanationService:
    def __init__(self):
        self.model = joblib.load(model_path)
        self.preprocessor = self.model.named_steps['preprocessor']
        self.classifier = self.model.named_steps['model']
        
        # Initialize explainer for the classifier
        # We use a TreeExplainer assuming it's a Random Forest, XGBoost, etc.
        # If it's a linear model, we'd use LinearExplainer. 
        # SHAP's generic Explainer usually picks the right one.
        self.explainer = shap.Explainer(self.classifier)
        
    def explain(self, input_df: pd.DataFrame, probability: float):
        """
        Calculates SHAP values, aggregates One-Hot Encoded features back to their original names,
        and returns them in the frontend's expected format.
        """

        # Preprocess input data
        input_df["SeniorCitizen"] = input_df["SeniorCitizen"].astype(int)
        input_df = engineer_features(input_df)
        X_transformed = self.preprocessor.transform(input_df)
        
        # Calculate SHAP values
        shap_values = self.explainer(X_transformed)
        
        # Extract SHAP impacts for the positive class (Churn)
        # Depending on the model, shap_values.values could be 2D or 3D.
        # For tree ensembles with 2 classes, it's usually shape (n_samples, n_features, n_classes) or (n_samples, n_features).
        vals = shap_values.values[0]
        if len(vals.shape) == 2:  # Binary classification returning both classes
            vals = vals[:, 1]
            
        feature_names = self.preprocessor.get_feature_names_out()
        
        # Aggregate one-hot encoded features back to original
        # Scikit-learn outputs format like "pipeline-name__feature_value" or "feature_value"
        feature_impacts = defaultdict(float)
        feature_values = {}
        
        for name, impact in zip(feature_names, vals):
            # Clean up the scikit-learn prefix like "num__" or "cat__"
            clean_name = name.split("__")[-1] if "__" in name else name
            
            # Identify original feature and value
            # OneHotEncoder generates "OriginalFeature_Value"
            if "_" in clean_name and "Charges" not in clean_name: # Handle case where '_' might be in feature name natively
                parts = clean_name.split("_", 1)
                orig_feature = parts[0]
            else:
                orig_feature = clean_name
                
            # Accumulate impact
            feature_impacts[orig_feature] += float(impact)
            
            # Store original input value
            if orig_feature in input_df.columns:
                feature_values[orig_feature] = input_df[orig_feature].iloc[0]
                
        # Format for frontend
        factors = []
        for feature, impact in feature_impacts.items():
            val = feature_values.get(feature, "Unknown")
            # Convert log-odds impact back to a sensible scale (-40 to +40) to match UI if needed,
            # or just leave as raw SHAP impact and scale by 100 for display.
            scaled_impact = max(-40, min(40, round(impact * 20))) 
            
            factors.append({
                "feature": feature,
                "value": str(val),
                "impact": scaled_impact,
                "reason": f"Analyzed from model features."
            })
            
        # Sort by absolute impact descending
        factors.sort(key=lambda x: abs(x["impact"]), reverse=True)
        return factors
