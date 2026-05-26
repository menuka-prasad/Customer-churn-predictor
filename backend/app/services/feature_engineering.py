from pathlib import Path
import pandas as pd  #data manipulation
import numpy as np    # numerical operations

import matplotlib.pyplot as plt
import seaborn as sns

pd.set_option("display.max_columns", None)   #see all columns
sns.set_style("whitegrid")

# Get project root directory relative to this script
PROJECT_ROOT = Path(__file__).resolve().parents[3]
input_path = PROJECT_ROOT / "data" / "eda" / "eda2.csv"

df = pd.read_csv(input_path)

X = df.drop(columns=["Churn"])
y = df["Churn"]

y = y.map({
    "Yes": 1,
    "No": 0
})

### feature 1 we can create is total services count. because in practical we know that if user get lot of services from one provider that means they are less likely to churn

services = [
    "PhoneService",
    "MultipleLines",
    "InternetService",
    "OnlineSecurity",
    "OnlineBackup",
    "DeviceProtection",
    "TechSupport",
    "StreamingTV",
    "StreamingMovies"
]

df["TotalServices"] = (
    (df[services] != "No").sum(axis=1)
)

print(df.shape)


### 2 create Is new Customer feature
df["IsNewCustomer"] = (
    df["tenure"] < 12
).astype(int)


### 3 create feature with month-to-month contact customers
df["HighRiskContract"] = (
    df["Contract"] == "Month-to-month"
).astype(int)


### 4 protection happiness
df["HasProtection"] = (
    (
        (df["OnlineSecurity"] == "Yes") |
        (df["TechSupport"] == "Yes") |
        (df["DeviceProtection"] == "Yes")
    ).astype(int)
)

output_path = PROJECT_ROOT / "data" / "feature_engineering" / "feature_engineered.csv"
output_path.parent.mkdir(parents=True, exist_ok=True)
df.to_csv(index=False, path_or_buf=output_path)