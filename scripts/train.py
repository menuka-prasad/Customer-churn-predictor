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
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_validate
from xgboost import XGBClassifier
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    roc_auc_score
)

import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

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
# MODELS
# -----------------------------

models = {
    "LogisticRegression": LogisticRegression(max_iter=1000),
    "RandomForest": RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    min_samples_leaf=4,
    random_state=42
    ),
    "XGBoost": XGBClassifier(
    max_depth=4,
    learning_rate=0.1,
    n_estimators=100,
    eval_metric="logloss",
    random_state=42
    )
}

# -----------------------------
# MODEL PIPELINE
# -----------------------------
best_score = 0;
best_model = None;
model_pipeline = None;


for model_name, model_instance in models.items():
    current_pipeline = Pipeline([
    ("preprocessor", preprocessor),
    (
        "model",
        model_instance
    )
    ])
    results = cross_validate(
        current_pipeline,
        X_train,
        y_train,
        cv=5,
        scoring=["recall", "f1"],
        return_train_score=True # only set true if need to check for overfitting
    )
    
    combined_score = (0.6 * results["test_recall"].mean()) + (0.4 * results["test_f1"].mean())
    if combined_score > best_score:
        best_score = combined_score
        model_pipeline = current_pipeline
        best_model = model_name
    
    print("="*40)
    
    # 3. Calculate and print the metrics properly
    print(f"--- {model_name} ---")
    
    mean_recall = results["test_recall"].mean()
    std_recall = results["test_recall"].std()
    print(f"Recall: {mean_recall:.4f} (+/- {std_recall:.4f})")
    
    mean_f1 = results["test_f1"].mean()
    std_f1 = results["test_f1"].std()
    print(f"F1 Score: {mean_f1:.4f} (+/- {std_f1:.4f})\n")
    
    print("="*40)
    
    train_recall_mean = results["train_recall"].mean()
    print(f"Train Recall: {train_recall_mean:.4f} | Test Recall: {mean_recall:.4f} | Gap: {train_recall_mean - mean_recall:.4f}")

print("="*40)
print(f"Best Model: {best_model}")
print(f"Recall score of Best model: {best_score}")
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