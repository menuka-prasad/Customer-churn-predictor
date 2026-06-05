'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ClipboardCheck, BarChart3 } from 'lucide-react';
import { CustomerForm } from '../CustomerForm';
import { PredictionResults } from '../PredictionResults';
import type { CustomerData, PredictionResult } from '../ChurnDashboard';
import { usePredictionStore, buildShapFor } from '../../context/PredictionStore';

export function PredictPage() {
  const router = useRouter();
  const { addRecord } = usePredictionStore();
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRecordId, setLastRecordId] = useState<string | null>(null);

  const handlePredict = async (data: CustomerData) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 2200));

    let probability = 50;
    if (data.contract === 'Month-to-month') probability += 20;
    else if (data.contract === 'One year') probability -= 10;
    else if (data.contract === 'Two year') probability -= 20;
    if (data.tenure < 12) probability += 15; else if (data.tenure > 48) probability -= 20;
    const hasServices = [data.onlineSecurity, data.onlineBackup, data.deviceProtection, data.techSupport, data.streamingTV, data.streamingMovies].filter(s => s === 'Yes').length;
    probability -= hasServices * 5;
    if (data.paymentMethod === 'Electronic check') probability += 10;
    if (data.monthlyCharges > 80) probability += 10;
    probability = Math.max(5, Math.min(95, probability + Math.random() * 10 - 5));

    const riskLevel: PredictionResult['riskLevel'] = probability < 30 ? 'LOW' : probability < 70 ? 'MEDIUM' : 'HIGH';
    const result: PredictionResult = {
      probability: Math.round(probability),
      riskLevel,
      prediction: probability > 50 ? 'Likely To Churn' : 'Likely To Stay',
      assessment: riskLevel === 'HIGH'
        ? `Customer demonstrates elevated churn risk. Immediate retention initiatives recommended to prevent customer loss.`
        : riskLevel === 'MEDIUM'
        ? `Customer shows moderate churn risk. Consider proactive engagement and service enhancements.`
        : `Customer exhibits strong retention indicators with stable usage patterns and long-term commitment.`,
    };
    setPrediction(result);

    const rec = addRecord({
      customerName: `Customer ${new Date().toLocaleTimeString()}`,
      customerData: data,
      result,
      shap: buildShapFor(data, result.probability),
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
