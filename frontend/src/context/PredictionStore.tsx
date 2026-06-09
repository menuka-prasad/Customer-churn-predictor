import { useState, useCallback } from 'react';
import type { CustomerData, PredictionResult } from '../types/churn';
import { PredictionResponse, CustomerData as ApiCustomerData } from '@/types/customer';
import { predictCustomerChurn } from '@/lib/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

function mapToApiCustomerData(data: CustomerData): ApiCustomerData {
  return {
    tenure: data.tenure,
    MonthlyCharges: data.monthlyCharges,
    TotalCharges: data.totalCharges,
    gender: data.gender,
    SeniorCitizen: data.seniorCitizen,
    Partner: data.partner,
    Dependents: data.dependents,
    PhoneService: data.phoneService,
    MultipleLines: data.multipleLines,
    InternetService: data.internetService,
    OnlineSecurity: data.onlineSecurity,
    OnlineBackup: data.onlineBackup,
    DeviceProtection: data.deviceProtection,
    TechSupport: data.techSupport,
    StreamingTV: data.streamingTV,
    StreamingMovies: data.streamingMovies,
    Contract: data.contract,
    PaperlessBilling: data.paperlessBilling,
    PaymentMethod: data.paymentMethod,
  };
}

export interface ShapFactor {
  feature: string;
  value: string | number;
  impact: number; // -100..100, positive pushes toward churn
  reason: string;
}

export interface PredictionRecord {
  id: string;
  createdAt: string;
  customerName: string;
  customerData: CustomerData;
  result: PredictionResult;
  shap: ShapFactor[];
  actual?: 'CHURNED' | 'STAYED' | null; // for manual review
  reviewedAt?: string;
  source: 'manual' | 'batch';
}



function seedRecords(): PredictionRecord[] {
  const seed: Array<Partial<PredictionRecord> & { customerName: string; prob: number; actual?: 'CHURNED' | 'STAYED' | null }> = [
    { customerName: 'Aiden Reyes', prob: 87, actual: 'CHURNED' },
    { customerName: 'Maria Chen', prob: 22, actual: 'STAYED' },
    { customerName: 'Jamal Patel', prob: 64, actual: 'CHURNED' },
    { customerName: 'Sofia Romano', prob: 12, actual: 'STAYED' },
    { customerName: 'Lukas Becker', prob: 73, actual: 'STAYED' },
    { customerName: 'Priya Nair', prob: 41, actual: null },
    { customerName: 'Noah Williams', prob: 91, actual: 'CHURNED' },
    { customerName: 'Emma Larsen', prob: 8, actual: 'STAYED' },
  ];
  return seed.map((s, i) => ({
    id: `seed-${i + 1}`,
    createdAt: new Date(Date.now() - (i + 1) * 1000 * 60 * 60 * 18).toISOString(),
    customerName: s.customerName,
    customerData: defaultCustomer(),
    source: i % 3 === 0 ? 'batch' : 'manual',
    result: {
      probability: s.prob,
      riskLevel: s.prob < 30 ? 'LOW' : s.prob < 70 ? 'MEDIUM' : 'HIGH',
      prediction: s.prob > 50 ? 'Likely To Churn' : 'Likely To Stay',
      assessment: 'Historical prediction generated from seed data for demonstration purposes.',
    },
    shap: defaultShap(s.prob),
    actual: s.actual ?? null,
    reviewedAt: s.actual ? new Date().toISOString() : undefined,
  }));
}

function defaultCustomer(): CustomerData {
  return {
    gender: 'Female', seniorCitizen: false, partner: 'Yes', dependents: 'No',
    phoneService: 'Yes', multipleLines: 'No', internetService: 'Fiber optic',
    onlineSecurity: 'No', onlineBackup: 'No', deviceProtection: 'No',
    techSupport: 'No', streamingTV: 'Yes', streamingMovies: 'Yes',
    contract: 'Month-to-month', paperlessBilling: 'Yes', paymentMethod: 'Electronic check',
    tenure: 8, monthlyCharges: 89.5, totalCharges: 716,
  };
}

function defaultShap(prob: number): ShapFactor[] {
  const sign = prob > 50 ? 1 : -1;
  return [
    { feature: 'Contract Type', value: 'Month-to-month', impact: 28 * sign, reason: 'Month-to-month customers churn 3.4× more than 2-year contracts.' },
    { feature: 'Tenure', value: '8 months', impact: 22 * sign, reason: 'Customers under 12 months tenure have weaker retention signals.' },
    { feature: 'Monthly Charges', value: '$89.50', impact: 14 * sign, reason: 'Higher monthly bills correlate with price-driven cancellations.' },
    { feature: 'Online Security', value: 'No', impact: 12 * sign, reason: 'Lack of bundled security service reduces stickiness.' },
    { feature: 'Payment Method', value: 'Electronic check', impact: 9 * sign, reason: 'Electronic check users churn more than auto-pay customers.' },
    { feature: 'Tech Support', value: 'No', impact: 7 * sign, reason: 'No tech support increases friction during issues.' },
    { feature: 'Internet Service', value: 'Fiber optic', impact: 5 * sign, reason: 'Fiber optic users have higher expectations and lower tolerance.' },
    { feature: 'Dependents', value: 'No', impact: -4 * sign, reason: 'Customers without dependents have slightly more flexibility.' },
  ];
}



export function buildShapFor(data: CustomerData, probability: number): ShapFactor[] {
  const sign = probability > 50 ? 1 : -1;
  const factors: ShapFactor[] = [];
  factors.push({
    feature: 'Contract Type', value: data.contract,
    impact: data.contract === 'Month-to-month' ? 28 : data.contract === 'One year' ? -14 : -26,
    reason: data.contract === 'Month-to-month'
      ? 'Month-to-month customers churn 3.4× more than 2-year contracts.'
      : 'Longer contract commitments strongly reduce churn risk.',
  });
  factors.push({
    feature: 'Tenure', value: `${data.tenure} months`,
    impact: data.tenure < 12 ? 22 : data.tenure > 48 ? -24 : -4,
    reason: data.tenure < 12 ? 'New customers are most at risk in the first year.' : 'Long-tenured customers have established loyalty.',
  });
  factors.push({
    feature: 'Monthly Charges', value: `$${data.monthlyCharges.toFixed(2)}`,
    impact: data.monthlyCharges > 80 ? 14 : data.monthlyCharges < 40 ? -8 : 2,
    reason: 'Higher monthly bills correlate with price-driven cancellations.',
  });
  factors.push({
    feature: 'Online Security', value: data.onlineSecurity,
    impact: data.onlineSecurity === 'Yes' ? -12 : 12,
    reason: 'Bundled security increases service stickiness.',
  });
  factors.push({
    feature: 'Tech Support', value: data.techSupport,
    impact: data.techSupport === 'Yes' ? -10 : 10,
    reason: 'Tech support reduces friction and frustration-driven churn.',
  });
  factors.push({
    feature: 'Payment Method', value: data.paymentMethod,
    impact: data.paymentMethod === 'Electronic check' ? 9 : -6,
    reason: 'Auto-pay customers have lower churn than electronic check users.',
  });
  factors.push({
    feature: 'Internet Service', value: data.internetService,
    impact: data.internetService === 'Fiber optic' ? 6 : -3,
    reason: 'Fiber optic users have higher expectations and lower tolerance.',
  });
  factors.push({
    feature: 'Dependents', value: data.dependents,
    impact: data.dependents === 'Yes' ? -5 : 3,
    reason: 'Customers with dependents are more rooted to their service.',
  });
  // Sort by absolute impact
  return factors.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact)).map(f => ({
    ...f,
    impact: probability > 50 ? f.impact : -f.impact * 0.6,
  })).map(f => ({ ...f, impact: Math.max(-40, Math.min(40, Math.round(f.impact))) }));
}

////////////////////////////////
/////////////
//// from here real api calls are shown. so when i complete real ones above script parts need to be come down below this
////////////
////////////////////////////////

interface PredictionState {
  result: PredictionResponse | null;
  isLoading: boolean;
  error: string | null;
  records: PredictionRecord[];
  submitPrediction: (data: CustomerData) => Promise<PredictionResponse | undefined>;
  reset: () => void;
  addRecord: (rec: Omit<PredictionRecord, 'id' | 'createdAt'>) => PredictionRecord;
  addBatch: (recs: Array<Omit<PredictionRecord, 'id' | 'createdAt'>>) => void;
  updateActual: (id: string, actual: 'CHURNED' | 'STAYED') => void;
  getById: (id: string) => PredictionRecord | undefined;
}

export const usePredictionStore = create<PredictionState>()(
  persist(
    (set, get) => ({
      result: null,
      isLoading: false,
      error: null,
      records: seedRecords(),
      
      submitPrediction: async (data: CustomerData) => {
        set({ isLoading: true, error: null });
        try {
          const apiData = mapToApiCustomerData(data);
          const response = await predictCustomerChurn(apiData);
          set({ result: response, isLoading: false });
          return response;
        } catch (error: any) {
          set({ 
            error: error.message || "Failed to get prediction from server", 
            isLoading: false 
          });
          throw error;
        }
      },

      reset: () => set({ result: null, error: null, isLoading: false }),

      addRecord: (rec) => {
        const full: PredictionRecord = {
          ...rec,
          id: `rec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ records: [full, ...state.records] }));
        return full;
      },

      addBatch: (recs) => {
        set((state) => ({
          records: [
            ...recs.map((rec, i) => ({
              ...rec,
              id: `batch-${Date.now()}-${i}`,
              createdAt: new Date().toISOString(),
            })),
            ...state.records,
          ],
        }));
      },

      updateActual: (id, actual) => {
        set((state) => ({
          records: state.records.map((rec) => 
            rec.id === id ? { ...rec, actual, reviewedAt: new Date().toISOString() } : rec
          ),
        }));
      },

      getById: (id) => {
        return get().records.find((r) => r.id === id);
      },
    }),
    {
      name: 'prediction-storage',
      partialize: (state) => ({ records: state.records }),
    }
  )
);