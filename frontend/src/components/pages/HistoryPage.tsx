'use client';

import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  History as HistoryIcon, Search, TrendingUp, Target, Activity, CheckCircle2,
  XCircle, Clock, Eye, ClipboardCheck, Filter,
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
} from 'recharts';
import { usePredictionStore, PredictionRecord } from '../../context/PredictionStore';
import Link from 'next/link';
import { computeMetrics } from '../../lib/metrics';

export function HistoryPage() {
  const { records } = usePredictionStore();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low' | 'reviewed'>('all');

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const matchesQuery = !query || r.customerName.toLowerCase().includes(query.toLowerCase()) || r.id.includes(query);
      const matchesFilter =
        filter === 'all' ||
        (filter === 'high' && r.result.riskLevel === 'HIGH') ||
        (filter === 'medium' && r.result.riskLevel === 'MEDIUM') ||
        (filter === 'low' && r.result.riskLevel === 'LOW') ||
        (filter === 'reviewed' && r.actual);
      return matchesQuery && matchesFilter;
    });
  }, [records, query, filter]);

  const metrics = useMemo(() => computeMetrics(records), [records]);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
            <HistoryIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">History & Analytics</h1>
        </div>
        <p className="text-slate-400 text-base sm:text-lg max-w-3xl">
          Track every prediction over time, audit model performance against logged outcomes, and drill into individual cases.
        </p>
      </motion.div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Total predictions" value={metrics.total} icon={Activity} tone="indigo" />
        <KpiCard label="Accuracy" value={`${metrics.accuracy}%`} icon={Target} tone="emerald" hint={`${metrics.reviewed} reviewed`} />
        <KpiCard label="Precision" value={`${metrics.precision}%`} icon={TrendingUp} tone="purple" />
        <KpiCard label="Recall" value={`${metrics.recall}%`} icon={CheckCircle2} tone="pink" />
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        <ChartCard title="Risk distribution" className="lg:col-span-1">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={metrics.riskDist}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
              >
                {metrics.riskDist.map((d) => (
                  <Cell key={d.name} fill={d.color} stroke="rgba(15,23,42,0.6)" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 text-xs">
            {metrics.riskDist.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                <span className="text-slate-300">{d.name}</span>
                <span className="text-slate-500 tabular-nums">{d.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Predictions over time" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={metrics.timeline}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="count" stroke="#a78bfa" strokeWidth={2} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        <ChartCard title="Confusion matrix (reviewed predictions)">
          <ConfusionMatrix data={metrics.confusion} />
        </ChartCard>
        <ChartCard title="Probability distribution">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={metrics.histogram}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="bucket" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#a78bfa" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* List */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <h3 className="font-semibold">All predictions ({filtered.length})</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search customer..."
                className="pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-400/60 w-56"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="pl-9 pr-8 py-2 rounded-lg bg-white/5 border border-white/10 text-sm appearance-none focus:outline-none focus:border-indigo-400/60"
              >
                <option value="all">All risks</option>
                <option value="high">High risk</option>
                <option value="medium">Medium risk</option>
                <option value="low">Low risk</option>
                <option value="reviewed">Reviewed only</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-slate-400 bg-white/[0.02]">
              <tr>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Probability</th>
                <th className="px-5 py-3">Risk</th>
                <th className="px-5 py-3">Source</th>
                <th className="px-5 py-3">Actual</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <Row key={r.id} record={r} />
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-slate-500">No predictions match.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Row({ record }: { record: PredictionRecord }) {
  const correct = record.actual && ((record.actual === 'CHURNED' && record.result.probability > 50) || (record.actual === 'STAYED' && record.result.probability <= 50));
  return (
    <tr className="border-t border-white/5 hover:bg-white/[0.03] transition-colors">
      <td className="px-5 py-3 font-medium">{record.customerName}</td>
      <td className="px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="w-20 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div className={`h-full ${record.result.riskLevel === 'HIGH' ? 'bg-rose-400' : record.result.riskLevel === 'MEDIUM' ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${record.result.probability}%` }} />
          </div>
          <span className="tabular-nums text-xs w-9 text-right">{record.result.probability}%</span>
        </div>
      </td>
      <td className="px-5 py-3"><RiskBadge level={record.result.riskLevel} /></td>
      <td className="px-5 py-3">
        <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10 capitalize">{record.source}</span>
      </td>
      <td className="px-5 py-3">
        {record.actual ? (
          <span className={`inline-flex items-center gap-1 text-xs ${correct ? 'text-emerald-300' : 'text-rose-300'}`}>
            {correct ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            {record.actual}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        )}
      </td>
      <td className="px-5 py-3 text-slate-400 text-xs whitespace-nowrap">{new Date(record.createdAt).toLocaleString()}</td>
      <td className="px-5 py-3 text-right whitespace-nowrap">
        <Link href={`/history/${record.id}`} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 mr-2">
          <Eye className="w-3.5 h-3.5" /> Analysis
        </Link>
        <Link href={`/history/${record.id}/review`} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/30 text-indigo-100">
          <ClipboardCheck className="w-3.5 h-3.5" /> Review
        </Link>
      </td>
    </tr>
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

function KpiCard({ label, value, icon: Icon, tone, hint }: { label: string; value: string | number; icon: any; tone: 'indigo' | 'emerald' | 'purple' | 'pink'; hint?: string }) {
  const map = {
    indigo: 'from-indigo-500/20 to-blue-500/10 border-indigo-400/30 text-indigo-200',
    emerald: 'from-emerald-500/20 to-teal-500/10 border-emerald-400/30 text-emerald-200',
    purple: 'from-purple-500/20 to-fuchsia-500/10 border-purple-400/30 text-purple-200',
    pink: 'from-pink-500/20 to-rose-500/10 border-pink-400/30 text-pink-200',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className={`p-5 rounded-2xl bg-gradient-to-br ${map[tone]} border`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider opacity-80">{label}</span>
        <Icon className="w-4 h-4 opacity-80" />
      </div>
      <div className="text-3xl font-bold text-white tabular-nums">{value}</div>
      {hint && <div className="text-xs mt-1 opacity-70">{hint}</div>}
    </motion.div>
  );
}

function ChartCard({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-5 ${className}`}>
      <h3 className="font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function ConfusionMatrix({ data }: { data: { tp: number; fp: number; fn: number; tn: number } }) {
  const cell = (label: string, value: number, good: boolean, sub: string) => (
    <div className={`p-4 rounded-xl border ${good ? 'bg-emerald-500/10 border-emerald-400/30' : 'bg-rose-500/10 border-rose-400/30'}`}>
      <div className={`text-xs ${good ? 'text-emerald-300' : 'text-rose-300'}`}>{label}</div>
      <div className="text-2xl font-bold text-white tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">{sub}</div>
    </div>
  );
  return (
    <div className="grid grid-cols-2 gap-3">
      {cell('True Positive', data.tp, true, 'Predicted churn · churned')}
      {cell('False Positive', data.fp, false, 'Predicted churn · stayed')}
      {cell('False Negative', data.fn, false, 'Predicted stay · churned')}
      {cell('True Negative', data.tn, true, 'Predicted stay · stayed')}
    </div>
  );
}

const tooltipStyle = {
  background: 'rgba(15,23,42,0.95)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 12,
  color: '#fff',
  fontSize: 12,
};

export default HistoryPage;
