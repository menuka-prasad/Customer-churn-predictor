import { useState } from 'react';
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AuthShell } from '../../components/AuthShell';
import { useAuth } from '../../context/AuthContext';
import { Field, ErrorBox, ConfigWarning } from './LoginPage';
import Link from 'next/link';

export function ForgotPasswordPage() {
  const { sendPasswordReset, configured } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await sendPasswordReset(email);
    setLoading(false);
    if (error) setError(error);
    else setSent(true);
  };

  return (
    <AuthShell
      variant="forgot"
      title={sent ? 'Check your inbox' : 'Forgot password?'}
      subtitle={sent ? 'We sent you a reset link.' : "No worries — we'll email you a reset link."}
      footer={
        <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-indigo-300 hover:text-white">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
        </Link>
      }
    >
      {!configured && <ConfigWarning />}

      {sent ? (
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-300" />
          </div>
          <p className="text-slate-200">
            If an account exists for <span className="text-white font-medium">{email}</span>, you'll receive a password reset link shortly.
          </p>
          <p className="text-xs text-slate-400 mt-3">Didn't get it? Check spam, or try again in a few minutes.</p>
          <button
            onClick={() => { setSent(false); setEmail(''); }}
            className="mt-4 text-xs text-indigo-300 hover:text-white"
          >
            Send to a different email
          </button>
        </div>
      ) : (
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

          {error && <ErrorBox message={error} />}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 transition-all shadow-lg shadow-indigo-700/30 disabled:opacity-50"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending link...</> : 'Send reset link'}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
