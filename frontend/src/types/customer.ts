// src/types/customer.ts
export interface CustomerData {
  tenure: number;
  MonthlyCharges: number;
  TotalCharges: number;
  gender: string;
  SeniorCitizen: boolean;
  Partner: string;
  Dependents: string;
  PhoneService: string;
  MultipleLines: string;
  InternetService: string;
  OnlineSecurity: string;
  OnlineBackup: string;
  DeviceProtection: string;
  TechSupport: string;
  StreamingTV: string;
  StreamingMovies: string;
  Contract: string;
  PaperlessBilling: string;
  PaymentMethod: string;
}

export interface PredictionResponse {
  churn_prediction: number; // e.g., 0 or 1
  churn_probability: number; // e.g., 0.85 (float)
  risk_level: string; // e.g., 'Low', 'Medium', 'High'
}