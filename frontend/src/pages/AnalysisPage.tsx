import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, TrendingUp, TrendingDown, Sparkles, AlertTriangle,
  CheckCircle2, ClipboardCheck, Lightbulb, Target, Activity,
} from 'lucide-react';
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, Cell,
} from 'recharts';
import { usePredictionStore } from '../context/PredictionStore';
import { GaugeChart } from '../components/GaugeChart';
import Link from 'next/link';

export function AnalysisPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById } = usePredictionStore();
  const record = id ? getById(id) : undefined;

  if (!record) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="w-10 h-10 text-amber-300 mx-auto mb-4" />
        <p className="text-slate-300">Prediction not found.</p>
        <Link href="/app/history" className="inline-block mt-4 text-indigo-300 hover:text-white">← Back to history</Link>
      </div>
    );
  }

  const positiveFactors = record.shap.filter((f) => f.impact > 0).slice(0, 5);
  const negativeFactors = record.shap.filter((f) => f.impact < 0).slice(0, 5);
  const radarData = record.shap.slice(0, 6).map((f) => ({
    feature: f.feature,
    impact: Math.abs(f.impact),
  }));
  const recommendations = buildRecommendations(record);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex gap-2">
          <Link
            href={`/app/history/${record.id}/review`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-emerald-200 text-sm"
          >
            <ClipboardCheck className="w-4 h-4" /> Manual review
          </Link>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold">{record.customerName}</h1>
        </div>
        <p className="text-slate-400">
          Predicted on {new Date(record.createdAt).toLocaleString()} · ID {record.id} · Source: {record.source}
        </p>
      </motion.div>

      {/* Top summary: gauge + KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.4fr] gap-5 mb-6">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
          <h3 className="font-semibold mb-4">Churn probability</h3>
          <div className="flex justify-center">
            <GaugeChart value={record.result.probability} />
          </div>
          <div className="mt-4 text-center">
            <div className="text-2xl font-bold">{record.result.prediction}</div>
            <RiskPill level={record.result.riskLevel} />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-300" /> AI-written assessment
          </h3>
          <p className="text-slate-300 leading-relaxed">{record.result.assessment}</p>
          <div className="grid grid-cols-3 gap-3 mt-6">
            <MiniStat icon={Target} label="Confidence" value={`${Math.min(98, 60 + Math.round(Math.abs(record.result.probability - 50) * 0.8))}%`} />
            <MiniStat icon={Activity} label="Tenure" value={`${record.customerData.tenure}m`} />
            <MiniStat icon={TrendingUp} label="Monthly" value={`$${record.customerData.monthlyCharges.toFixed(0)}`} />
          </div>
        </div>
      </div>

      {/* SHAP bar */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-2 mb-4">
          <div>
            <h3 className="font-semibold">SHAP feature contributions</h3>
            <p className="text-xs text-slate-400 mt-1">
              Each bar shows how a feature pushed the model toward churn (right) or retention (left).
            </p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={Math.max(260, record.shap.length * 36)}>
          <BarChart data={record.shap} layout="vertical" margin={{ left: 10, right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis type="number" stroke="#64748b" fontSize={11} domain={[-40, 40]} />
            <YAxis type="category" dataKey="feature" stroke="#94a3b8" fontSize={12} width={130} />
            <Tooltip
              contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
              formatter={(v: number) => [`${v > 0 ? '+' : ''}${v}`, 'Impact']}
            />
            <ReferenceLine x={0} stroke="rgba(255,255,255,0.2)" />
            <Bar dataKey="impact" radius={[0, 6, 6, 0]}>
              {record.shap.map((f, i) => (
                <Cell key={`cell-${i}`} fill={f.impact > 0 ? '#fb7185' : '#34d399'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <FactorList
          title="Pushing toward churn"
          icon={<TrendingUp className="w-4 h-4 text-rose-300" />}
          tone="rose"
          factors={positiveFactors}
        />
        <FactorList
          title="Pulling toward retention"
          icon={<TrendingDown className="w-4 h-4 text-emerald-300" />}
          tone="emerald"
          factors={negativeFactors}
        />
      </div>

      {/* Radar + recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.2fr] gap-5 mb-6">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
          <h3 className="font-semibold mb-4">Feature footprint</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="feature" stroke="#94a3b8" fontSize={11} />
              <PolarRadiusAxis stroke="#475569" fontSize={10} angle={90} />
              <Radar dataKey="impact" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-300" /> Recommended actions
          </h3>
          <ul className="space-y-3">
            {recommendations.map((rec, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5"
              >
                <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-xs font-bold text-indigo-200 shrink-0">
                  {i + 1}
                </div>
                <div>
                  <div className="font-medium text-sm">{rec.title}</div>
                  <div className="text-xs text-slate-400 mt-1">{rec.desc}</div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Customer attributes table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
        <h3 className="font-semibold mb-4">Customer profile snapshot</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(record.customerData).map(([k, v]) => (
            <div key={k} className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="text-[10px] uppercase tracking-wider text-slate-500">{labelize(k)}</div>
              <div className="text-sm mt-0.5 truncate">{String(v)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FactorList({ title, icon, tone, factors }: { title: string; icon: React.ReactNode; tone: 'rose' | 'emerald'; factors: any[] }) {
  const bar = tone === 'rose' ? 'bg-rose-400' : 'bg-emerald-400';
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">{icon} {title}</h3>
      <div className="space-y-3">
        {factors.length === 0 && <div className="text-sm text-slate-500">No factors in this direction.</div>}
        {factors.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="p-3 rounded-xl bg-white/[0.03] border border-white/5"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-sm font-medium">{f.feature}</div>
                <div className="text-xs text-slate-400">{f.value}</div>
              </div>
              <span className={`text-xs font-bold ${tone === 'rose' ? 'text-rose-300' : 'text-emerald-300'}`}>
                {f.impact > 0 ? '+' : ''}{f.impact}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${Math.abs(f.impact) * 2.5}%` }} transition={{ duration: 0.8 }}
                className={`h-full ${bar}`}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">{f.reason}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-400 mb-1">
        <Icon className="w-3 h-3" /> {label}
      </div>
      <div className="font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function RiskPill({ level }: { level: 'LOW' | 'MEDIUM' | 'HIGH' }) {
  const map = {
    LOW: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
    MEDIUM: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
    HIGH: 'bg-rose-500/15 text-rose-300 border-rose-400/30',
  };
  return <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs border ${map[level]}`}>{level} RISK</span>;
}

function labelize(k: string) {
  return k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
}

function buildRecommendations(record: any) {
  const recs: { title: string; desc: string }[] = [];
  const d = record.customerData;
  if (d.contract === 'Month-to-month') {
    recs.push({ title: 'Offer annual contract upgrade', desc: 'Bundle a 15% discount with a one-year commitment to reduce flight risk.' });
  }
  if (d.tenure < 12) {
    recs.push({ title: 'Trigger 90-day onboarding outreach', desc: 'Schedule a CSM check-in and personalized success plan within the next two weeks.' });
  }
  if (d.onlineSecurity === 'No' || d.techSupport === 'No') {
    recs.push({ title: 'Trial bundled add-on services', desc: 'Offer 60-day free trial of Online Security and Tech Support — both strongly reduce churn.' });
  }
  if (d.paymentMethod === 'Electronic check') {
    recs.push({ title: 'Migrate to auto-pay', desc: 'Promote auto-pay with a small one-time credit — payment friction drives passive churn.' });
  }
  if (d.monthlyCharges > 80) {
    recs.push({ title: 'Price sensitivity review', desc: 'Run a billing review and propose a tier downgrade or loyalty discount before competitor outreach.' });
  }
  if (recs.length < 3) {
    recs.push({ title: 'Maintain quarterly business review', desc: 'Continue scheduled QBRs to reinforce value and surface expansion opportunities.' });
  }
  return recs.slice(0, 5);
}
