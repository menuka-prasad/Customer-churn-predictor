'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Sparkles, Zap, Building2, ArrowRight, HelpCircle } from 'lucide-react';
import Link from 'next/link';

type Cycle = 'monthly' | 'yearly';

export function PricingPage() {
  const [cycle, setCycle] = useState<Cycle>('monthly');

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-indigo-200 mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Simple, transparent pricing
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
          Plans for teams of every size
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Start free, upgrade when your prediction volume grows. All plans include SHAP explainability
          and the manual review loop.
        </p>

        {/* Toggle */}
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10 mt-7">
          {(['monthly', 'yearly'] as Cycle[]).map((c) => (
            <button
              key={c}
              onClick={() => setCycle(c)}
              className={`relative px-5 py-1.5 rounded-full text-sm transition-colors ${cycle === c ? 'text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {cycle === c && (
                <motion.span layoutId="cycle-pill" className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 -z-10" />
              )}
              {c === 'yearly' ? 'Yearly · Save 20%' : 'Monthly'}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
        {plans.map((plan, i) => {
          const price = cycle === 'yearly' ? Math.round(plan.monthly * 12 * 0.8) : plan.monthly;
          const suffix = cycle === 'yearly' ? '/yr' : '/mo';
          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-7 border ${
                plan.featured
                  ? 'border-indigo-400/50 bg-gradient-to-br from-indigo-600/20 to-purple-600/10 shadow-2xl shadow-indigo-900/30'
                  : 'border-white/10 bg-slate-900/60'
              } backdrop-blur-xl flex flex-col`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-xs font-medium">
                  Most popular
                </span>
              )}
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-2 rounded-lg ${plan.featured ? 'bg-white/10' : 'bg-indigo-500/15'}`}>
                  <plan.icon className="w-5 h-5 text-indigo-200" />
                </div>
                <span className="font-semibold">{plan.name}</span>
              </div>
              <p className="text-sm text-slate-400 mb-5">{plan.tagline}</p>
              <div className="mb-6">
                {plan.monthly === 0 ? (
                  <div className="text-4xl font-bold">Free</div>
                ) : plan.monthly < 0 ? (
                  <div className="text-4xl font-bold">Custom</div>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tabular-nums">${price}</span>
                    <span className="text-slate-400">{suffix}</span>
                  </div>
                )}
              </div>
              <ul className="space-y-3 mb-7 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-emerald-300 mt-0.5 shrink-0" />
                    <span className="text-slate-300">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/predict"
                className={`group flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  plan.featured
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-lg shadow-indigo-700/30'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Compare */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl overflow-hidden mb-16">
        <div className="px-6 py-5 border-b border-white/10">
          <h2 className="font-semibold">Plan comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-slate-400 bg-white/[0.02]">
              <tr>
                <th className="px-6 py-3 text-left">Feature</th>
                {plans.map((p) => <th key={p.name} className="px-6 py-3 text-center">{p.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {compareRows.map((row, i) => (
                <tr key={i} className="border-t border-white/5">
                  <td className="px-6 py-3 text-slate-300">{row.label}</td>
                  {row.values.map((v, j) => (
                    <td key={j} className="px-6 py-3 text-center">
                      {v === true ? <Check className="w-4 h-4 text-emerald-300 mx-auto" />
                        : v === false ? <span className="text-slate-600">—</span>
                        : <span className="text-slate-300">{v}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-300" /> Frequently asked questions
        </h2>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <details key={i} className="group rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl">
              <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between font-medium">
                {f.q}
                <span className="text-slate-400 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

const plans = [
  {
    name: 'Starter', tagline: 'For solo founders and pilots.', icon: Sparkles, monthly: 0, featured: false,
    cta: 'Start free',
    features: [
      'Up to 200 predictions / month',
      'Single customer scoring',
      'Basic SHAP explanations',
      '7-day history retention',
      'Community support',
    ],
  },
  {
    name: 'Growth', tagline: 'For CS teams driving retention.', icon: Zap, monthly: 79, featured: true,
    cta: 'Start 14-day trial',
    features: [
      'Up to 50,000 predictions / month',
      'Batch CSV upload',
      'Full SHAP + radar analytics',
      'Unlimited history & model metrics',
      'Manual review loop',
      'Email + Slack alerts',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise', tagline: 'For data-mature organizations.', icon: Building2, monthly: -1, featured: false,
    cta: 'Contact sales',
    features: [
      'Unlimited predictions',
      'Self-hosted FastAPI deployment',
      'Custom feature engineering',
      'SSO, SCIM, audit logs',
      'Dedicated solutions engineer',
      'Custom SLAs',
    ],
  },
];

const compareRows = [
  { label: 'Predictions / month', values: ['200', '50,000', 'Unlimited'] },
  { label: 'Batch CSV upload', values: [false, true, true] },
  { label: 'SHAP explanations', values: ['Basic', 'Full', 'Full + custom'] },
  { label: 'History retention', values: ['7 days', 'Unlimited', 'Unlimited'] },
  { label: 'Manual review loop', values: [false, true, true] },
  { label: 'SSO / SCIM', values: [false, false, true] },
  { label: 'Self-hosted', values: [false, false, true] },
  { label: 'Support', values: ['Community', 'Priority', 'Dedicated SE'] },
];

const faqs = [
  { q: 'How accurate are the predictions?', a: 'Our default model achieves ~88% accuracy on standard telco churn benchmarks. With the manual review loop, your team can fine-tune toward your domain over time.' },
  { q: 'Can I run the model on my own infrastructure?', a: 'Yes — Enterprise plans include a self-hosted FastAPI deployment, plus Helm charts for Kubernetes.' },
  { q: 'What formats are supported for batch upload?', a: 'CSV with a header row matching the standard customer schema. We will publish a JSON Lines option soon.' },
  { q: 'Is my data used to train shared models?', a: 'No. Your data is isolated per workspace and never used to train models outside of your tenant.' },
  { q: 'Can I cancel anytime?', a: 'Absolutely. Subscriptions can be cancelled at the end of the current billing cycle from settings.' },
];
