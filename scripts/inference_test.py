import requests

sample_customer = {
    "tenure": 2,
    "MonthlyCharges": 70.0,
    "TotalCharges": 140.0,
    "gender": "Male",
    "SeniorCitizen": False,
    "Partner": "No",
    "Dependents": "No",
    "PhoneService": "Yes",
    "MultipleLines": "No",
    "InternetService": "Fiber optic",
    "OnlineSecurity": "No",
    "OnlineBackup": "No",
    "DeviceProtection": "No",
    "TechSupport": "No",
    "StreamingTV": "No",
    "StreamingMovies": "No",
    "Contract": "Month-to-month",
    "PaperlessBilling": "Yes",
    "PaymentMethod": "Electronic check"
}

response = requests.post(
    "http://localhost:8000/predict",
    json=sample_customer
)

print("Status Code:", response.status_code)
print("Response:", response.json())