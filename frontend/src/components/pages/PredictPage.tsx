'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ClipboardCheck, BarChart3 } from 'lucide-react';
import { CustomerForm } from '../CustomerForm';
import { PredictionResults } from '../PredictionResults';
import type { CustomerData, PredictionResult } from '../../types/churn';
import { usePredictionStore, buildShapFor } from '../../context/PredictionStore';
import { calculateChurnProbability } from '../../lib/churn';
import { getExplanation } from '../../lib/api';
import { CustomerData as ApiCustomerData } from '@/types/customer';

export function PredictPage() {
  const router = useRouter();
  const { addRecord, submitPrediction } = usePredictionStore();
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRecordId, setLastRecordId] = useState<string | null>(null);

  const handlePredict = async (data: CustomerData) => {
    setIsLoading(true);

    let probability = 50;
    let riskLevel: PredictionResult['riskLevel'] = 'MEDIUM';
    let predictionText = 'Likely To Stay';
    let shapData = null;

    try {
      // 1. Try to get prediction from real backend
      const apiResponse = await submitPrediction(data);
      
      if (apiResponse) {
        probability = Math.round(apiResponse.churn_probability * 100);
        // backend risk_level is 'Low', 'Medium', 'High' or 'Very Low', convert to 'LOW' | 'MEDIUM' | 'HIGH'
        const upperRisk = apiResponse.risk_level.toUpperCase();
        riskLevel = (upperRisk.includes('LOW') ? 'LOW' : upperRisk.includes('HIGH') ? 'HIGH' : 'MEDIUM') as PredictionResult['riskLevel'];
        predictionText = apiResponse.churn_prediction === 1 ? 'Likely To Churn' : 'Likely To Stay';
        
        // Fetch SHAP explanations from the separate endpoint
        try {
          const apiData = {
            tenure: data.tenure, MonthlyCharges: data.monthlyCharges, TotalCharges: data.totalCharges,
            gender: data.gender, SeniorCitizen: data.seniorCitizen, Partner: data.partner, Dependents: data.dependents,
            PhoneService: data.phoneService, MultipleLines: data.multipleLines, InternetService: data.internetService,
            OnlineSecurity: data.onlineSecurity, OnlineBackup: data.onlineBackup, DeviceProtection: data.deviceProtection,
            TechSupport: data.techSupport, StreamingTV: data.streamingTV, StreamingMovies: data.streamingMovies,
            Contract: data.contract, PaperlessBilling: data.paperlessBilling, PaymentMethod: data.paymentMethod,
          } as ApiCustomerData;
          const explResponse = await getExplanation(apiData as any);
          if (explResponse.shap_values) shapData = explResponse.shap_values;
        } catch (e) {
          console.warn("Could not fetch SHAP values, using fallback", e);
        }
      }
    } catch (error) {
      console.warn("Backend API failed, falling back to dummy prediction", error);
      // 2. Dev Fallback: Dummy prediction
      await new Promise((r) => setTimeout(r, 1000)); // fake delay
      probability = calculateChurnProbability(data);
      riskLevel = probability < 30 ? 'LOW' : probability < 70 ? 'MEDIUM' : 'HIGH';
      predictionText = probability > 50 ? 'Likely To Churn' : 'Likely To Stay';
    }

    // Generate dummy assessment and SHAP (backend doesn't provide these yet)
    const assessment = riskLevel === 'HIGH'
      ? `Customer demonstrates elevated churn risk. Immediate retention initiatives recommended to prevent customer loss.`
      : riskLevel === 'MEDIUM'
      ? `Customer shows moderate churn risk. Consider proactive engagement and service enhancements.`
      : `Customer exhibits strong retention indicators with stable usage patterns and long-term commitment.`;

    const result: PredictionResult = {
      probability,
      riskLevel,
      prediction: predictionText,
      assessment,
    };
    setPrediction(result);

    const rec = addRecord({
      customerName: `Customer ${new Date().toLocaleTimeString()}`,
      customerData: data,
      result,
      shap: shapData || buildShapFor(data, result.probability),
      actual: null,
      source: 'manual',
    });
    setLastRecordId(rec.id);
    setIsLoading(false);
  };

  const handleReset = () => {
    setPrediction(null);
    setLastRecordId(null);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Customer Churn Prediction</h1>
        </div>
        <p className="text-slate-400 text-base sm:text-lg max-w-3xl">
          Score a single customer using machine learning. Drill into SHAP drivers or log the actual outcome afterward.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-6 lg:gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <CustomerForm onPredict={handlePredict} onReset={handleReset} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
          className="lg:sticky lg:top-6 h-fit space-y-4"
        >
          <PredictionResults prediction={prediction} isLoading={isLoading} />

          <AnimatePresence>
            {prediction && lastRecordId && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-4 space-y-2"
              >
                <p className="text-xs uppercase tracking-wider text-indigo-300/80 mb-2">Next steps</p>
                <button
                  onClick={() => router.push(`/history/${lastRecordId}`)}
                  className="w-full group flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-700/30"
                >
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <BarChart3 className="w-4 h-4" /> View detailed analysis
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => router.push(`/history/${lastRecordId}/review`)}
                  className="w-full group flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <span className="flex items-center gap-2 text-sm">
                    <ClipboardCheck className="w-4 h-4 text-emerald-300" /> Log actual outcome
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default PredictPage;
