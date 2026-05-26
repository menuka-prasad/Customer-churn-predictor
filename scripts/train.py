import sys
from pathlib import Path

# Add project root to sys.path to allow imports from backend
PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.append(str(PROJECT_ROOT))

import pandas as pd
import joblib

from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    roc_auc_score
)

import matplotlib.pyplot as plt
import seaborn as sns

from backend.app.services.feature_engineering import (
    engineer_features
)

from backend.app.services.preprocessing import (
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
# FEATURE ENGINEERING
# -----------------------------

df = engineer_features(df)


# -----------------------------
# TARGET ENCODING
# -----------------------------

X = df.drop(columns=["Churn"])
y = df["Churn"].map({
    "Yes": 1,
    "No": 0
})


# -----------------------------
# FEATURE GROUPS
# -----------------------------

numerical_features = [
    "tenure",
    "MonthlyCharges",
    "TotalCharges",
    "TotalServices"
]

categorical_features = [
    col for col in X.columns
    if col not in numerical_features
]


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
# PREPROCESSOR
# -----------------------------

preprocessor = create_preprocessor(
    numerical_features,
    categorical_features
)


# -----------------------------
# MODEL PIPELINE
# -----------------------------

model_pipeline = Pipeline([
    ("preprocessor", preprocessor),
    (
        "model",
        LogisticRegression(max_iter=1000)
    )
])


# -----------------------------
# TRAIN MODEL
# -----------------------------

model_pipeline.fit(X_train, y_train)


# -----------------------------
# PREDICTIONS
# -----------------------------

y_pred = model_pipeline.predict(X_test)

y_prob = model_pipeline.predict_proba(X_test)[:, 1]


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


# -----------------------------
# SAVE MODEL
# -----------------------------

artifact_path = (
    PROJECT_ROOT /
    "backend" /
    "app" /
    "models" /
    "artifacts" /
    "churn_pipeline.pkl"
)

artifact_path.parent.mkdir(
    parents=True,
    exist_ok=True
)

joblib.dump(
    model_pipeline,
    artifact_path
)

print("\nModel pipeline saved successfully.")