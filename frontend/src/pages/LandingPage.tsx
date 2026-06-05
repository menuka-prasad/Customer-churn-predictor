import { motion } from 'motion/react';
import {
  Sparkles, ArrowRight, BarChart3, Upload, Brain, ShieldCheck,
  Zap, Activity, Users, CheckCircle2, Quote,
} from 'lucide-react';
import Link from 'next/link';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white overflow-hidden relative">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(99,102,241,0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Glow blobs */}
      <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-indigo-600/30 blur-[120px] pointer-events-none" />
      <div className="absolute top-40 -right-32 w-[500px] h-[500px] rounded-full bg-purple-600/30 blur-[140px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg shadow-indigo-500/40">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold tracking-tight">Churnly AI</span>
        </div>
        <div className="hidden md:flex items-center gap-7 text-sm text-slate-300">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#how" className="hover:text-white">How it works</a>
          <Link href="/app/pricing" className="hover:text-white">Pricing</Link>
          <Link href="/app/privacy" className="hover:text-white">Privacy</Link>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/auth/login"
            className="hidden sm:inline-flex px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="px-4 py-2 rounded-lg bg-white text-slate-900 text-sm font-medium hover:bg-slate-100 transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-16 pb-24 lg:pt-28 lg:pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-indigo-200 mb-6"
        >
          <Zap className="w-3.5 h-3.5 text-indigo-300" /> New · SHAP-powered explainability live
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
        >
          Predict churn{' '}
          <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
            before it happens.
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 max-w-2xl mx-auto text-slate-300 text-base sm:text-lg"
        >
          A modern AI workspace for customer retention teams. Score one customer or batch-upload thousands —
          get probability, risk tier, and the exact reasons behind every prediction.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/app/predict"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 transition-all shadow-lg shadow-indigo-700/40"
          >
            Try the predictor
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/app/pricing"
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            See pricing
          </Link>
        </motion.div>

        {/* Floating preview card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-20 mx-auto max-w-4xl relative"
        >
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-pink-600/30 blur-3xl rounded-3xl" />
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-6 shadow-2xl text-left">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Live prediction
              </div>
              <span className="text-xs text-slate-500">ID #prd-2841</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Stat label="Churn probability" value="87%" tone="rose" />
              <Stat label="Risk tier" value="HIGH" tone="amber" />
              <Stat label="Top driver" value="Month-to-month" tone="indigo" />
            </div>
            <div className="mt-5 h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }} animate={{ width: '87%' }} transition={{ delay: 0.9, duration: 1.2 }}
                className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-24">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-indigo-300/80 mb-3">What's inside</p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">A workspace built for retention teams</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-400/40 hover:bg-white/[0.07] transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="w-5 h-5 text-indigo-300" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-24">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-indigo-300/80 mb-3">How it works</p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">From signal to save in three steps</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <div key={s.title} className="relative p-6 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10">
              <div className="text-5xl font-bold bg-gradient-to-br from-indigo-300 to-purple-400 bg-clip-text text-transparent mb-4">
                0{i + 1}
              </div>
              <h3 className="font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pb-24">
        <div className="rounded-3xl p-10 lg:p-14 bg-gradient-to-br from-indigo-600/20 to-purple-600/10 border border-white/10 text-center">
          <Quote className="w-10 h-10 mx-auto text-indigo-300/80 mb-5" />
          <p className="text-xl sm:text-2xl leading-relaxed">
            "Churnly cut our voluntary churn by 23% in one quarter. The SHAP explanations were the
            unlock — our CSMs finally trust the score."
          </p>
          <div className="mt-6 text-sm text-slate-400">— Priya Nair, Head of Customer Success</div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-24 text-center">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">Ready to stop guessing?</h2>
        <p className="text-slate-300 max-w-xl mx-auto mb-8">
          Score your first customer in under thirty seconds. No credit card required.
        </p>
        <Link
          href="/app/predict"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 transition-all shadow-lg shadow-indigo-700/40"
        >
          Open the workspace <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-300" />
            <span>© 2026 Churnly AI</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/app/pricing" className="hover:text-white">Pricing</Link>
            <Link href="/app/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/app/terms" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: 'rose' | 'amber' | 'indigo' }) {
  const toneMap = {
    rose: 'from-rose-500/20 to-pink-500/10 border-rose-400/30 text-rose-200',
    amber: 'from-amber-500/20 to-orange-500/10 border-amber-400/30 text-amber-200',
    indigo: 'from-indigo-500/20 to-purple-500/10 border-indigo-400/30 text-indigo-200',
  };
  return (
    <div className={`p-4 rounded-xl bg-gradient-to-br ${toneMap[tone]} border`}>
      <div className="text-xs uppercase tracking-wider opacity-80">{label}</div>
      <div className="text-2xl font-bold mt-1 text-white">{value}</div>
    </div>
  );
}

const features = [
  { icon: Brain, title: 'Explainable predictions', desc: 'SHAP values for every score — see the exact features pushing a customer toward churn.' },
  { icon: Upload, title: 'Batch CSV scoring', desc: 'Drop a CSV with thousands of customers and score the entire cohort in seconds.' },
  { icon: BarChart3, title: 'Model performance', desc: 'Track accuracy, precision, recall, and AUC across your prediction history.' },
  { icon: ShieldCheck, title: 'Manual review loop', desc: 'Mark predictions as correct or incorrect and feed ground truth back into the model.' },
  { icon: Activity, title: 'Live confidence bands', desc: 'Calibrated probability ranges so you know when the model is uncertain.' },
  { icon: Users, title: 'Built for CS teams', desc: 'Designed alongside customer success leaders managing thousands of accounts.' },
];

const steps = [
  { title: 'Connect your signal', desc: 'Enter a customer manually or upload a CSV of profile, usage, and billing fields.' },
  { title: 'Get a scored verdict', desc: 'Probability, risk tier, and an AI-written assessment — in under two seconds.' },
  { title: 'Act with confidence', desc: 'Drill into SHAP drivers and log outcomes to improve the model over time.' },
];
