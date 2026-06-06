import { CustomerData } from '../types/churn';

export function mockCustomer(): CustomerData {
  return {
    gender: Math.random() > 0.5 ? 'Female' : 'Male',
    seniorCitizen: Math.random() > 0.7, partner: 'Yes', dependents: 'No',
    phoneService: 'Yes', multipleLines: 'No', internetService: 'Fiber optic',
    onlineSecurity: 'No', onlineBackup: 'No', deviceProtection: 'No',
    techSupport: 'No', streamingTV: 'Yes', streamingMovies: 'Yes',
    contract: ['Month-to-month', 'One year', 'Two year'][Math.floor(Math.random() * 3)],
    paperlessBilling: 'Yes', paymentMethod: 'Electronic check',
    tenure: Math.floor(Math.random() * 72) + 1,
    monthlyCharges: 30 + Math.random() * 90,
    totalCharges: Math.random() * 5000,
  };
}
