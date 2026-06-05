'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, CheckCircle2, XCircle, ClipboardCheck, AlertTriangle,
  Sparkles, ThumbsUp, ThumbsDown,
} from 'lucide-react';
import { usePredictionStore } from '../../context/PredictionStore';
import Link from 'next/link';

export function ReviewPage() {
  const { id } = useParams() as { id?: string };
  const router = useRouter();
  const { getById, updateActual } = usePredictionStore();
  const record = id ? getById(id) : undefined;
  const [submitted, setSubmitted] = useState(false);
  const [choice, setChoice] = useState<'CHURNED' | 'STAYED' | null>(record?.actual ?? null);

  if (!record) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="w-10 h-10 text-amber-300 mx-auto mb-4" />
        <p className="text-slate-300">Prediction not found.</p>
        <Link href="/history" className="inline-block mt-4 text-indigo-300 hover:text-white">← Back to history</Link>
      </div>
    );
  }

  const predictedChurn = record.result.probability > 50;
  const correct = choice && ((choice === 'CHURNED' && predictedChurn) || (choice === 'STAYED' && !predictedChurn));

  const submit = (actual: 'CHURNED' | 'STAYED') => {
    setChoice(actual);
    updateActual(record.id, actual);
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
            <ClipboardCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold">Manual review</h1>
        </div>
        <p className="text-slate-400">
          Log the actual outcome for <span className="text-white font-medium">{record.customerName}</span> to improve future model accuracy.
        </p>
      </motion.div>

      {/* Side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div className="rounded-2xl border border-indigo-400/30 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 p-6">
          <div className="text-xs uppercase tracking-wider text-indigo-300 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Model prediction
          </div>
          <div className="text-3xl font-bold mb-1">{record.result.probability}%</div>
          <div className="text-slate-300 mb-3">{record.result.prediction}</div>
          <div className="text-xs text-slate-400">
            Risk tier: <span className="text-white">{record.result.riskLevel}</span>
          </div>
        </div>

        <div className={`rounded-2xl border p-6 ${choice ? (correct ? 'border-emerald-400/30 bg-emerald-500/10' : 'border-rose-400/30 bg-rose-500/10') : 'border-white/10 bg-slate-900/60'}`}>
          <div className="text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
            {choice ? (correct ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <XCircle className="w-3.5 h-3.5 text-rose-300" />) : <ClipboardCheck className="w-3.5 h-3.5 text-slate-400" />}
            <span className={choice ? (correct ? 'text-emerald-300' : 'text-rose-300') : 'text-slate-400'}>
              Your verdict
            </span>
          </div>
          {choice ? (
            <>
              <div className="text-3xl font-bold mb-1">{choice}</div>
              <div className="text-slate-300 mb-3">
                {correct ? 'Model was correct ✓' : 'Model was incorrect ✗'}
              </div>
              <div className="text-xs text-slate-400">
                Logged {record.reviewedAt ? new Date(record.reviewedAt).toLocaleString() : 'just now'}
              </div>
            </>
          ) : (
            <div className="text-sm text-slate-400">Select an outcome below.</div>
          )}
        </div>
      </div>

      {/* Choice buttons */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 mb-6">
        <h3 className="font-semibold mb-1">What actually happened?</h3>
        <p className="text-sm text-slate-400 mb-5">Only mark an outcome if you have ground-truth data for this customer.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => submit('CHURNED')}
            className={`group p-5 rounded-xl border transition-all flex items-center gap-4 ${
              choice === 'CHURNED'
                ? 'border-rose-400/60 bg-rose-500/15'
                : 'border-white/10 bg-white/[0.03] hover:border-rose-400/40 hover:bg-rose-500/10'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center">
              <ThumbsDown className="w-5 h-5 text-rose-300" />
            </div>
            <div className="text-left">
              <div className="font-semibold">Customer churned</div>
              <div className="text-xs text-slate-400">They cancelled or did not renew</div>
            </div>
          </button>
          <button
            onClick={() => submit('STAYED')}
            className={`group p-5 rounded-xl border transition-all flex items-center gap-4 ${
              choice === 'STAYED'
                ? 'border-emerald-400/60 bg-emerald-500/15'
                : 'border-white/10 bg-white/[0.03] hover:border-emerald-400/40 hover:bg-emerald-500/10'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
              <ThumbsUp className="w-5 h-5 text-emerald-300" />
            </div>
            <div className="text-left">
              <div className="font-semibold">Customer stayed</div>
              <div className="text-xs text-slate-400">They remained an active customer</div>
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-5 flex items-start gap-4"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-300 mt-0.5 shrink-0" />
            <div className="flex-1">
              <div className="font-semibold mb-1">Outcome saved</div>
              <p className="text-sm text-slate-300">
                This review now contributes to model performance metrics on the History page.
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/history" className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm whitespace-nowrap">
                View metrics
              </Link>
              <Link href={`/history/${record.id}`} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm whitespace-nowrap">
                Open analysis
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
