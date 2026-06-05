'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2,
  Download, Sparkles, Trash2, Eye, X,
} from 'lucide-react';
import { usePredictionStore, buildShapFor } from '../../context/PredictionStore';
import type { CustomerData, PredictionResult } from '../ChurnDashboard';

interface ParsedRow {
  name: string;
  data: CustomerData;
  result: PredictionResult;
}

export function BatchPredictPage() {
  const router = useRouter();
  const { addBatch } = usePredictionStore();
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    setError(null);
    if (!f.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a .csv file');
      return;
    }
    setFile(f);
    setRows([]);
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const runBatch = async () => {
    if (!file) return;
    setProcessing(true);
    setProgress(0);

    // Mock processing - in real use, send file to FastAPI backend
    const total = Math.floor(20 + Math.random() * 30);
    const parsed: ParsedRow[] = [];
    for (let i = 0; i < total; i++) {
      await new Promise((r) => setTimeout(r, 60));
      const prob = Math.round(Math.random() * 95 + 5);
      const data = mockCustomer();
      const result: PredictionResult = {
        probability: prob,
        riskLevel: prob < 30 ? 'LOW' : prob < 70 ? 'MEDIUM' : 'HIGH',
        prediction: prob > 50 ? 'Likely To Churn' : 'Likely To Stay',
        assessment: 'Batch-generated prediction. Review individual analysis for SHAP drivers.',
      };
      parsed.push({ name: `Customer ${1000 + i}`, data, result });
      setProgress(Math.round(((i + 1) / total) * 100));
    }

    addBatch(parsed.map((r) => ({
      customerName: r.name,
      customerData: r.data,
      result: r.result,
      shap: buildShapFor(r.data, r.result.probability),
      actual: null,
      source: 'batch' as const,
    })));

    setRows(parsed);
    setProcessing(false);
  };

  const reset = () => {
    setFile(null);
    setRows([]);
    setProgress(0);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const downloadCsv = () => {
    const header = 'customer,probability,risk,prediction\n';
    const body = rows.map((r) => `${r.name},${r.result.probability},${r.result.riskLevel},${r.result.prediction}`).join('\n');
    const blob = new Blob([header + body], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'churn-predictions.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const stats = {
    total: rows.length,
    high: rows.filter(r => r.result.riskLevel === 'HIGH').length,
    medium: rows.filter(r => r.result.riskLevel === 'MEDIUM').length,
    low: rows.filter(r => r.result.riskLevel === 'LOW').length,
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Batch Prediction</h1>
        </div>
        <p className="text-slate-400 text-base sm:text-lg max-w-3xl">
          Upload a CSV of customers to score the entire cohort in one pass. Connects to your FastAPI backend at runtime.
        </p>
      </motion.div>

      {/* Upload zone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 mb-6"
      >
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all p-10 text-center ${
            dragOver
              ? 'border-indigo-400 bg-indigo-500/10'
              : 'border-white/15 hover:border-indigo-400/60 hover:bg-white/5'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-400/30">
                <FileSpreadsheet className="w-6 h-6 text-indigo-300" />
              </div>
              <div className="text-left">
                <div className="font-medium">{file.name}</div>
                <div className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB · ready to score</div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); reset(); }}
                className="ml-2 p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                aria-label="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-indigo-400/30 flex items-center justify-center mb-4">
                <Upload className="w-7 h-7 text-indigo-300" />
              </div>
              <div className="font-medium mb-1">Drop a CSV here, or click to browse</div>
              <div className="text-sm text-slate-400">
                Expected columns: gender, tenure, contract, monthly_charges, total_charges, ...
              </div>
            </>
          )}
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-sm">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <button
            onClick={runBatch}
            disabled={!file || processing}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 transition-all shadow-lg shadow-indigo-700/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Scoring... {progress}%</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Run batch prediction</>
            )}
          </button>
          {rows.length > 0 && (
            <button
              onClick={downloadCsv}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <Download className="w-4 h-4" /> Download results
            </button>
          )}
        </div>

        <AnimatePresence>
          {processing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4">
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {rows.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Scored" value={stats.total} tone="indigo" icon={<CheckCircle2 className="w-4 h-4" />} />
              <StatCard label="High risk" value={stats.high} tone="rose" />
              <StatCard label="Medium" value={stats.medium} tone="amber" />
              <StatCard label="Low" value={stats.low} tone="emerald" />
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-semibold">Batch results</h3>
                <span className="text-xs text-slate-400">{rows.length} predictions saved to history</span>
              </div>
              <div className="overflow-x-auto max-h-[520px]">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-slate-900/95 backdrop-blur text-left text-xs uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-5 py-3">Customer</th>
                      <th className="px-5 py-3">Probability</th>
                      <th className="px-5 py-3">Risk</th>
                      <th className="px-5 py-3">Prediction</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={i} className="border-t border-white/5 hover:bg-white/[0.03]">
                        <td className="px-5 py-3 font-medium">{r.name}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 rounded-full bg-white/5 overflow-hidden">
                              <div
                                className={`h-full ${barColor(r.result.riskLevel)}`}
                                style={{ width: `${r.result.probability}%` }}
                              />
                            </div>
                            <span className="text-xs tabular-nums w-9 text-right">{r.result.probability}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-3"><RiskBadge level={r.result.riskLevel} /></td>
                        <td className="px-5 py-3 text-slate-300">{r.result.prediction}</td>
                        <td className="px-5 py-3 text-right">
                          <button
                            onClick={() => router.push('/history')}
                            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
                          >
                            <Eye className="w-3.5 h-3.5" /> View in history
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              onClick={reset}
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
            >
              <Trash2 className="w-4 h-4" /> Clear and upload another
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, tone, icon }: { label: string; value: number; tone: 'indigo' | 'rose' | 'amber' | 'emerald'; icon?: React.ReactNode }) {
  const map = {
    indigo: 'from-indigo-500/20 to-purple-500/10 border-indigo-400/30 text-indigo-200',
    rose: 'from-rose-500/20 to-pink-500/10 border-rose-400/30 text-rose-200',
    amber: 'from-amber-500/20 to-orange-500/10 border-amber-400/30 text-amber-200',
    emerald: 'from-emerald-500/20 to-teal-500/10 border-emerald-400/30 text-emerald-200',
  };
  return (
    <div className={`p-4 rounded-xl bg-gradient-to-br ${map[tone]} border`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs uppercase tracking-wider opacity-80">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-white tabular-nums">{value}</div>
    </div>
  );
}

function RiskBadge({ level }: { level: 'LOW' | 'MEDIUM' | 'HIGH' }) {
  const map = {
    LOW: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
    MEDIUM: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
    HIGH: 'bg-rose-500/15 text-rose-300 border-rose-400/30',
  };
  return <span className={`px-2 py-0.5 rounded-md text-xs border ${map[level]}`}>{level}</span>;
}

function barColor(level: 'LOW' | 'MEDIUM' | 'HIGH') {
  return level === 'LOW' ? 'bg-emerald-400' : level === 'MEDIUM' ? 'bg-amber-400' : 'bg-rose-400';
}

function mockCustomer(): CustomerData {
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

export default BatchPredictPage;
