import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Quote, Star, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  variant?: 'login' | 'signup' | 'forgot' | 'reset';
}

const variants = {
  login: {
    quote: '"Churnly cut our voluntary churn by 23% in one quarter. The SHAP explanations were the unlock."',
    author: 'Priya Nair · Head of Customer Success, Lumen',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80',
  },
  signup: {
    quote: '"Onboarded in under five minutes. Our CSMs finally trust the retention score."',
    author: 'Marcus Lee · VP Customer Success, Northwave',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  },
  forgot: {
    quote: '"We bring teams back to the data, and the data back to the team."',
    author: 'Churnly AI · Retention OS',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  },
  reset: {
    quote: '"Security and speed shouldn\'t be a tradeoff. With Churnly, they aren\'t."',
    author: 'Sofia Romano · Director of RevOps',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  },
};

export function AuthShell({ title, subtitle, children, footer, variant = 'login' }: Props) {
  const v = variants[variant];
  return (
    <div className="min-h-screen bg-slate-950 text-white grid lg:grid-cols-2">
      {/* Left side - branded */}
      <div className="relative hidden lg:flex flex-col justify-between p-10 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${v.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-slate-950/85 to-purple-950/90" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-indigo-600/40 blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[480px] h-[480px] rounded-full bg-purple-600/30 blur-[140px]" />

        <div className="relative z-10 flex items-center gap-2.5">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg shadow-indigo-500/40 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold tracking-tight">Churnly AI</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="relative z-10 max-w-md"
        >
          <Quote className="w-10 h-10 text-indigo-300/70 mb-5" />
          <p className="text-xl leading-relaxed mb-5">{v.quote}</p>
          <div className="flex items-center gap-2 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-300 text-amber-300" />
            ))}
          </div>
          <div className="text-sm text-slate-300">{v.author}</div>
        </motion.div>

        <div className="relative z-10 grid grid-cols-3 gap-3 max-w-md">
          {[
            { icon: ShieldCheck, label: 'SOC 2 Type II' },
            { icon: Zap, label: 'Sub-second scoring' },
            { icon: Sparkles, label: 'SHAP explainable' },
          ].map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
              className="flex flex-col items-start gap-2 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <b.icon className="w-4 h-4 text-indigo-300" />
              <span className="text-xs text-slate-200">{b.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right side - form */}
      <div className="relative flex flex-col">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center justify-between p-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-sm">Churnly AI</span>
          </Link>
          <Link href="/" className="text-xs text-slate-400 hover:text-white">← Home</Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">{title}</h1>
              {subtitle && <p className="text-slate-400">{subtitle}</p>}
            </div>

            {children}

            {footer && <div className="mt-8 text-center text-sm text-slate-400">{footer}</div>}
          </motion.div>
        </div>

        <div className="px-6 pb-6 text-center text-xs text-slate-500">
          <Link href="/privacy" className="hover:text-slate-300">Privacy</Link>
          <span className="mx-2">·</span>
          <Link href="/terms" className="hover:text-slate-300">Terms</Link>
        </div>
      </div>
    </div>
  );
}
