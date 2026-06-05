import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { Brain, TrendingUp, Target, AlertCircle } from 'lucide-react';
import type { PredictionResult } from './ChurnDashboard';
import { GaugeChart } from './GaugeChart';
import { Skeleton } from './ui/skeleton';

interface PredictionResultsProps {
  prediction: PredictionResult | null;
  isLoading: boolean;
}

export function PredictionResults({ prediction, isLoading }: PredictionResultsProps) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (!prediction) {
    return <EmptyState />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Main Gauge Card */}
      <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
        <h3 className="text-lg font-semibold text-white mb-6 text-center">Churn Probability</h3>
        <GaugeChart value={prediction.probability} />

        {/* Risk Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="mt-6 flex justify-center"
        >
          <RiskBadge level={prediction.riskLevel} />
        </motion.div>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-3">
        <KPICard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Probability"
          value={`${prediction.probability}%`}
          delay={0.2}
        />
        <KPICard
          icon={<Target className="w-5 h-5" />}
          label="Prediction"
          value={prediction.prediction.includes('Churn') ? 'Will Churn' : 'Will Stay'}
          delay={0.3}
        />
        <KPICard
          icon={<AlertCircle className="w-5 h-5" />}
          label="Confidence"
          value={`${prediction.probability}%`}
          delay={0.4}
        />
      </div>

      {/* AI Assessment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-800/50 backdrop-blur-xl shadow-2xl p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Brain className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-2">AI Risk Assessment</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {prediction.assessment}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl shadow-2xl p-8 sm:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="inline-block p-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full mb-6"
        >
          <Brain className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-400" />
        </motion.div>
        <h3 className="text-xl font-semibold text-white mb-3">Ready to Analyze</h3>
        <p className="text-slate-400 max-w-md mx-auto">
          Submit customer information to generate an AI-powered churn prediction and risk assessment.
        </p>
      </motion.div>
    </Card>
  );
}

function LoadingState() {
  const steps = [
    'Analyzing customer profile...',
    'Evaluating churn probability...',
    'Generating risk assessment...'
  ];

  return (
    <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl shadow-2xl p-8">
      <div className="space-y-6">
        {steps.map((step, index) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.3 }}
            className="flex items-center gap-3"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full"
            />
            <span className="text-slate-300 text-sm">{step}</span>
          </motion.div>
        ))}

        <div className="space-y-4 pt-4">
          <Skeleton className="h-48 w-full bg-slate-800/50" />
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-20 bg-slate-800/50" />
            <Skeleton className="h-20 bg-slate-800/50" />
            <Skeleton className="h-20 bg-slate-800/50" />
          </div>
          <Skeleton className="h-32 w-full bg-slate-800/50" />
        </div>
      </div>
    </Card>
  );
}

function RiskBadge({ level }: { level: 'LOW' | 'MEDIUM' | 'HIGH' }) {
  const config = {
    LOW: {
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/50',
      text: 'text-emerald-400',
      label: 'LOW RISK'
    },
    MEDIUM: {
      bg: 'bg-amber-500/20',
      border: 'border-amber-500/50',
      text: 'text-amber-400',
      label: 'MEDIUM RISK'
    },
    HIGH: {
      bg: 'bg-red-500/20',
      border: 'border-red-500/50',
      text: 'text-red-400',
      label: 'HIGH RISK'
    }
  };

  const style = config[level];

  return (
    <div className={`px-6 py-3 ${style.bg} ${style.border} border-2 rounded-full`}>
      <span className={`${style.text} font-bold text-sm tracking-wider`}>
        {style.label}
      </span>
    </div>
  );
}

function KPICard({
  icon,
  label,
  value,
  delay
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-xl p-4 text-center">
        <div className="flex justify-center mb-2 text-indigo-400">
          {icon}
        </div>
        <div className="text-xs text-slate-400 mb-1">{label}</div>
        <div className="font-bold text-white text-sm sm:text-base">{value}</div>
      </Card>
    </motion.div>
  );
}
