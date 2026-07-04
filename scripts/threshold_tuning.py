import sys
from pathlib import Path 
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_recall_curve
import matplotlib.pyplot as plt
import numpy as np
import json

# Add project root to sys.path to allow imports from backend
PROJECT_ROOT = Path(__file__).resolve().parents[1]
BACKEND_DIR = PROJECT_ROOT / 'backend'
if str(BACKEND_DIR) not in sys.path:
    sys.path.append(str(BACKEND_DIR))
    

from app.services.feature_engineering import (
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


try:
    loaded_pipeline = joblib.load(model_path)
    print("Model loaded successfully!")
except FileNotFoundError:
    print(f"Error: Could not find the model at {model_path}")
    sys.exit(1)
    
y_prob = loaded_pipeline.predict_proba(X_test)[:, 1]

print("Predictions generated successfully.")


precisions, recalls, thresholds = precision_recall_curve(y_test, y_prob)

# here we define our recall threshold is 0.75 (this got by inspecting curve. in there precision also roughly 0.5). 
target_recall = 0.75
# Find index closest to target recall
idx = np.argmin(np.abs(recalls - target_recall))
best_threshold = thresholds[idx]
best_precision = precisions[idx]

print(f"At Recall ≥ {target_recall}:")
print(f"  Threshold : {best_threshold:.4f}")
print(f"  Precision : {best_precision:.4f}")

# Plotting the curve
plt.figure(figsize=(8, 6))
plt.plot(recalls, precisions, color='blue', linewidth=2, label='Model PR Curve')

plt.axvline(x=recalls[idx], color='red', linestyle='--', label=f'Target Recall={target_recall}')
plt.scatter([recalls[idx]], [precisions[idx]], color='red', zorder=5)

# Formatting the plot
plt.title("Precision-Recall Curve", fontsize=14)
plt.xlabel("Recall (Sensitivity)", fontsize=12)
plt.ylabel("Precision (Positive Predictive Value)", fontsize=12)
plt.xlim([0.0, 1.05])
plt.ylim([0.0, 1.05])
plt.grid(True, linestyle='--', alpha=0.7)
plt.legend(loc="lower left")

plt.show()


threshold_path = (
    PROJECT_ROOT /
    "backend" /
    "app" /
    "models" /
    "artifacts" /
    "threshold.json"
)

threshold_data = {
    "threshold": round(float(best_threshold), 4),
    "target_recall": target_recall,
    "precision_at_threshold": round(float(best_precision), 4)

}


with open(threshold_path, "w") as f:
    json.dump(threshold_data, f, indent=2)
    
print(f"Threshold is saved to {threshold_path}")
