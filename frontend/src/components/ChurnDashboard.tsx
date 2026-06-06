import { useState } from 'react';
import { CustomerForm } from './CustomerForm';
import { PredictionResults } from './PredictionResults';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { CustomerData, PredictionResult } from '../types/churn';
import { simulateChurnPrediction } from '../lib/churn';

export function ChurnDashboard() {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = async (data: CustomerData) => {
    setIsLoading(true);

    const result = await simulateChurnPrediction(data);
    setPrediction(result);

    setIsLoading(false);
  };

  const handleReset = () => {
    setPrediction(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      {/* Animated background pattern */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(99, 102, 241, 0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="px-4 sm:px-6 lg:px-8 py-8 lg:py-12"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <motion.h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Customer Churn Prediction
              </motion.h1>
            </div>
            <motion.p
              className="text-slate-400 text-base sm:text-lg max-w-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Predict customer retention risk using machine learning insights
            </motion.p>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-6 lg:gap-8">
              {/* Left Panel - Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <CustomerForm onPredict={handlePredict} onReset={handleReset} />
              </motion.div>

              {/* Right Panel - Results */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="lg:sticky lg:top-6 h-fit"
              >
                <PredictionResults
                  prediction={prediction}
                  isLoading={isLoading}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
