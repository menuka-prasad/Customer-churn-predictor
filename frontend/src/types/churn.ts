export interface CustomerData {
  gender: string;
  seniorCitizen: boolean;
  partner: string;
  dependents: string;
  phoneService: string;
  multipleLines: string;
  internetService: string;
  onlineSecurity: string;
  onlineBackup: string;
  deviceProtection: string;
  techSupport: string;
  streamingTV: string;
  streamingMovies: string;
  contract: string;
  paperlessBilling: string;
  paymentMethod: string;
  tenure: number;
  monthlyCharges: number;
  totalCharges: number;
}

export interface PredictionResult {
  probability: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  prediction: string;
  assessment: string;
}
