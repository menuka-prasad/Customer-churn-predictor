'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2, Mail, Lock, AlertCircle } from 'lucide-react';
import { AuthShell } from '../../AuthShell';
import { SocialAuthButtons } from '../../SocialAuthButtons';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';

export function LoginPage() {
  const { signInWithPassword, configured } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('from') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signInWithPassword(email, password);
    setLoading(false);
    if (error) setError(error);
    else router.replace(redirectTo);
  };

  return (
    <AuthShell
      variant="login"
      title="Welcome back"
      subtitle="Sign in to continue to your retention workspace."
      footer={<>Don't have an account? <Link href="/signup" className="text-indigo-300 hover:text-white font-medium">Create one</Link></>}
    >
      {!configured && <ConfigWarning />}

      <SocialAuthButtons />
      <Divider />

      <form onSubmit={submit} className="space-y-4">
        <Field
          icon={<Mail className="w-4 h-4" />}
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          placeholder="you@company.com"
          required
        />
        <Field
          icon={<Lock className="w-4 h-4" />}
          label="Password"
          type={showPw ? 'text' : 'password'}
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          required
          suffix={
            <button type="button" onClick={() => setShowPw(!showPw)} className="text-slate-400 hover:text-white">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/5"
            />
            Remember me
          </label>
          <Link href="/forgot-password" className="text-indigo-300 hover:text-white">Forgot password?</Link>
        </div>

        {error && <ErrorBox message={error} />}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 transition-all shadow-lg shadow-indigo-700/30 disabled:opacity-50"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : 'Sign in'}
        </button>
      </form>
    </AuthShell>
  );
}

export function Field({
  icon, label, type, value, onChange, placeholder, required, autoComplete, suffix,
}: {
  icon?: React.ReactNode; label: string; type: string; value: string;
  onChange: (v: string) => void; placeholder?: string; required?: boolean;
  autoComplete?: string; suffix?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} ${suffix ? 'pr-10' : 'pr-4'} py-3 rounded-xl bg-white/5 border border-white/10 placeholder:text-slate-500 focus:outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20 transition-colors`}
        />
        {suffix && <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{suffix}</span>}
      </div>
    </div>
  );
}

export function Divider() {
  return (
    <div className="my-6 flex items-center gap-3 text-xs text-slate-500">
      <span className="flex-1 h-px bg-white/10" />
      <span>OR CONTINUE WITH EMAIL</span>
      <span className="flex-1 h-px bg-white/10" />
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-sm">
      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export function ConfigWarning() {
  return (
    <div className="mb-5 flex items-start gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-100 text-xs">
      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
      <span>
        Supabase is not configured. Add <code className="px-1 py-0.5 rounded bg-black/30">VITE_SUPABASE_URL</code> and{' '}
        <code className="px-1 py-0.5 rounded bg-black/30">VITE_SUPABASE_ANON_KEY</code> to your <code className="px-1 py-0.5 rounded bg-black/30">.env.local</code>.
      </span>
    </div>
  );
}
