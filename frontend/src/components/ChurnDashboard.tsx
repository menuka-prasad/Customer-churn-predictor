import { useState } from 'react';
import { CustomerForm } from './CustomerForm';
import { PredictionResults } from './PredictionResults';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

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

export function ChurnDashboard() {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = async (data: CustomerData) => {
    setIsLoading(true);

    // Simulate AI prediction with realistic logic
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Calculate probability based on risk factors
    let probability = 50;

    // Contract type impact
    if (data.contract === 'Month-to-month') probability += 20;
    else if (data.contract === 'One year') probability -= 10;
    else if (data.contract === 'Two year') probability -= 20;

    // Tenure impact
    if (data.tenure < 12) probability += 15;
    else if (data.tenure > 48) probability -= 20;

    // Service subscriptions
    const hasServices = [
      data.onlineSecurity,
      data.onlineBackup,
      data.deviceProtection,
      data.techSupport,
      data.streamingTV,
      data.streamingMovies
    ].filter(s => s === 'Yes').length;

    probability -= hasServices * 5;

    // Payment method
    if (data.paymentMethod === 'Electronic check') probability += 10;

    // Monthly charges
    if (data.monthlyCharges > 80) probability += 10;

    // Clamp between 5 and 95
    probability = Math.max(5, Math.min(95, probability + Math.random() * 10 - 5));

    const riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' =
      probability < 30 ? 'LOW' : probability < 70 ? 'MEDIUM' : 'HIGH';

    const predictionText = probability > 50 ? 'Likely To Churn' : 'Likely To Stay';

    const assessment = generateAssessment(data, riskLevel, probability);

    setPrediction({
      probability: Math.round(probability),
      riskLevel,
      prediction: predictionText,
      assessment
    });

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

function generateAssessment(data: CustomerData, riskLevel: string, probability: number): string {
  const factors = [];

  if (data.tenure < 12) factors.push('short tenure');
  if (data.contract === 'Month-to-month') factors.push('month-to-month contract');

  const services = [
    data.onlineSecurity,
    data.onlineBackup,
    data.deviceProtection,
    data.techSupport,
    data.streamingTV,
    data.streamingMovies
  ].filter(s => s === 'Yes').length;

  if (services < 2) factors.push('lack of additional service subscriptions');
  if (data.paymentMethod === 'Electronic check') factors.push('electronic check payment method');
  if (data.monthlyCharges > 80) factors.push('high monthly charges');

  if (riskLevel === 'HIGH') {
    return `Customer demonstrates elevated churn risk due to ${factors.slice(0, 3).join(', ')}. Immediate retention initiatives recommended to prevent customer loss.`;
  } else if (riskLevel === 'MEDIUM') {
    return `Customer shows moderate churn risk. Consider proactive engagement strategies and service enhancements to strengthen retention.`;
  } else {
    return `Customer exhibits strong retention indicators with stable usage patterns and long-term commitment. Continue maintaining service quality and engagement.`;
  }
}
