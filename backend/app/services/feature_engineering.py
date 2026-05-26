from pathlib import Path
import pandas as pd  


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    
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
    
    return df



if __name__ == "__main__":

    PROJECT_ROOT = Path(__file__).resolve().parents[3]

    input_path = (
        PROJECT_ROOT /
        "data" /
        "eda" /
        "eda2.csv"
    )

    output_path = (
        PROJECT_ROOT /
        "data" /
        "feature_engineering" /
        "feature_engineered.csv"
    )

    output_path.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    df = pd.read_csv(input_path)

    df = engineer_features(df)

    df.to_csv(output_path, index=False)

    print("Feature engineering completed.")
    print(df.head())