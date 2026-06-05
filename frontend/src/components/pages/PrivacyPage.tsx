'use client';

import { motion } from 'motion/react';
import { Shield, Lock, Database, Eye, UserCheck, Globe2, Mail } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Privacy Policy</h1>
        </div>
        <p className="text-slate-400">Last updated: June 4, 2026</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {pillars.map((p) => (
          <div key={p.label} className="p-4 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl">
            <p.icon className="w-5 h-5 text-indigo-300 mb-2" />
            <div className="text-sm font-medium">{p.label}</div>
            <div className="text-xs text-slate-400 mt-1">{p.desc}</div>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        {sections.map((s, i) => (
          <motion.section
            key={i}
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6"
          >
            <h2 className="font-semibold text-lg mb-3">{s.title}</h2>
            <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
              {s.body.map((p, j) => <p key={j}>{p}</p>)}
              {s.list && (
                <ul className="list-disc list-inside space-y-1.5 text-slate-400 ml-1">
                  {s.list.map((l, k) => <li key={k}>{l}</li>)}
                </ul>
              )}
            </div>
          </motion.section>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-indigo-400/30 bg-gradient-to-br from-indigo-600/15 to-purple-600/5 p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <Mail className="w-6 h-6 text-indigo-300" />
        <div className="flex-1">
          <div className="font-semibold">Have a privacy question?</div>
          <div className="text-sm text-slate-400">Reach our Data Protection Officer at privacy@churnly.ai — we respond within two business days.</div>
        </div>
      </div>
    </div>
  );
}

const pillars = [
  { icon: Lock, label: 'Encrypted', desc: 'AES-256 at rest, TLS 1.3 in transit' },
  { icon: Database, label: 'Isolated', desc: 'Per-workspace tenant data' },
  { icon: Eye, label: 'Transparent', desc: 'Full audit trail available' },
  { icon: Globe2, label: 'Compliant', desc: 'GDPR, CCPA, SOC 2 Type II' },
];

const sections = [
  {
    title: '1. Information we collect',
    body: [
      'Churnly AI collects only the data necessary to provide accurate churn predictions and to operate the service.',
    ],
    list: [
      'Account information: name, email, organization, and billing details.',
      'Customer data you upload: profile attributes, billing fields, and usage signals submitted via the UI or API.',
      'Usage telemetry: pages viewed, predictions run, and error logs for reliability.',
    ],
  },
  {
    title: '2. How we use your data',
    body: [
      'We use the data you provide to score customers, generate explanations, and surface analytics in your workspace. We do not sell your data, and we never use your customer records to train shared or cross-tenant models.',
    ],
  },
  {
    title: '3. Storage and retention',
    body: [
      'Customer records are stored in encrypted databases located in your selected region (US-East, EU-West, or AP-Southeast).',
      'You may delete any prediction record at any time. Deletions are propagated to backups within thirty days.',
    ],
  },
  {
    title: '4. Subprocessors',
    body: [
      'We rely on a small set of vetted subprocessors to deliver the service. The current list is maintained at churnly.ai/legal/subprocessors and is updated at least 30 days before any change takes effect.',
    ],
  },
  {
    title: '5. Your rights',
    body: ['Depending on your jurisdiction, you have the right to access, export, correct, or delete personal data we process on your behalf.'],
    list: [
      'Request a portable export of your workspace data.',
      'Request deletion of your account and associated records.',
      'Object to specific processing activities.',
    ],
  },
  {
    title: '6. Security',
    body: [
      'We maintain SOC 2 Type II controls, perform annual penetration tests, and operate a coordinated disclosure program at security.churnly.ai.',
    ],
  },
  {
    title: '7. International transfers',
    body: [
      'For customers outside your data region, we rely on Standard Contractual Clauses and additional safeguards consistent with the EU-US Data Privacy Framework.',
    ],
  },
  {
    title: '8. Changes to this policy',
    body: [
      'We will notify workspace owners by email at least 30 days before any material change to this policy takes effect.',
    ],
  },
];
