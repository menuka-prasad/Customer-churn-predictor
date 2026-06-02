import sys
from pathlib import Path 
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_recall_curve
import matplotlib.pyplot as plt
import numpy as np
import json
import shap

# Add project root to sys.path to allow imports from backend
PROJECT_ROOT = Path(__file__).resolve().parents[1]
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


# -----------------------------
# LOAD DATA
# -----------------------------


input_path = (
    PROJECT_ROOT /
    "data" /
    "feature_engineering" /
    "feature_engineered.csv"
)

df = pd.read_csv(input_path)


# -----------------------------
# FEATURE ENGINEERING
# -----------------------------

df = engineer_features(df)


X = df.drop(columns=["Churn"])
y = df["Churn"].map({
    "Yes": 1,
    "No": 0
})


# -----------------------------
# TRAIN TEST SPLIT
# -----------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# -----------------------------
# LOAD MODEL
# -----------------------------

pipeline = joblib.load(model_path)

preprocessor = pipeline.named_steps["preprocessor"]
model = pipeline.named_steps["model"]


# -----------------------------
# TRANSFORM TEST DATA
# -----------------------------

X_test_transformed = preprocessor.transform(X_test)
feature_names = preprocessor.get_feature_names_out()

print(feature_names)
print(feature_names.shape)
# -----------------------------
# SHAP EXPLAINER
# -----------------------------

explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test_transformed)

# -----------------------------
# SHAP SUMMARY PLOT
# -----------------------------

shap.summary_plot(
    shap_values,
    X_test_transformed,
    feature_names=feature_names
)

X_test_df = pd.DataFrame(
    X_test_transformed,
    columns=feature_names
)
idx = 0  # first customer in test set

shap.plots.waterfall(explainer(X_test_df)[idx])
