import sys
from pathlib import Path

    
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    roc_auc_score
)
import matplotlib.pyplot as plt
import seaborn as sns
import json


PROJECT_ROOT = Path(__file__).resolve().parents[1]
BACKEND_DIR = PROJECT_ROOT / 'backend'
if str(BACKEND_DIR) not in sys.path:
    sys.path.append(str(BACKEND_DIR))
    
from app.services.feature_engineering import (
    engineer_features
)

from app.services.preprocessing import (
    create_preprocessor
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
# LOAD Model
# -----------------------------

model_path = (
    PROJECT_ROOT /
    "backend" /
    "app" /
    "models" /
    "artifacts" /
    "churn_pipeline.pkl"
)

pipeline = joblib.load(model_path)

model = pipeline.named_steps["model"]
preprocessor = pipeline.named_steps["preprocessor"]


# -----------------------------
# LOAD Threshold
# -----------------------------

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

custom_threshold = threshold_data["threshold"]

# -----------------------------
# Clean Data
# -----------------------------

df = engineer_features(df)

X = df.drop(columns=["Churn"])
y = df["Churn"].map({
    "Yes": 1,
    "No": 0
})

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2, 
    random_state=42, 
    stratify=y
    )

X_test_transformed = preprocessor.transform(X_test)


y_prob = model.predict_proba(X_test_transformed)[:, 1]

y_pred = (y_prob >= custom_threshold).astype(int)


# -----------------------------
# EVALUATION
# -----------------------------

print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))

roc_auc = roc_auc_score(y_test, y_prob)

print(f"\nROC-AUC Score: {roc_auc:.4f}")


# -----------------------------
# CONFUSION MATRIX
# -----------------------------

cm = confusion_matrix(y_test, y_pred)

sns.heatmap(
    cm,
    annot=True,
    fmt="d"
)

plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix")

plt.show()
