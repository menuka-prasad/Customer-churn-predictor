import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, Loader2, Mail, Lock, User, CheckCircle2 } from 'lucide-react';
import { AuthShell } from '../../components/AuthShell';
import { SocialAuthButtons } from '../../components/SocialAuthButtons';
import { useAuth } from '../../context/AuthContext';
import { Field, Divider, ErrorBox, ConfigWarning } from './LoginPage';
import Link from 'next/link';

export function SignupPage() {
  const { signUpWithPassword, configured } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [accept, setAccept] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<'confirm' | 'in' | null>(null);

  const strength = useMemo(() => scorePassword(password), [password]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!accept) {
      setError('Please accept the terms and privacy policy to continue.');
      return;
    }
    if (strength.score < 2) {
      setError('Please choose a stronger password (at least 8 characters, mix of letters and numbers).');
      return;
    }
    setLoading(true);
    const { error, needsEmailConfirm } = await signUpWithPassword(email, password, fullName);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    if (needsEmailConfirm) setSuccess('confirm');
    else {
      setSuccess('in');
      setTimeout(() => navigate('/app', { replace: true }), 800);
    }
  };

  if (success === 'confirm') {
    return (
      <AuthShell variant="signup" title="Check your inbox" subtitle="We just sent a confirmation link.">
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-emerald-300" />
          </div>
          <p className="text-slate-200">
            We sent a confirmation email to{' '}
            <span className="text-white font-medium">{email}</span>. Click the link inside to activate your account.
          </p>
          <p className="text-xs text-slate-400 mt-3">Didn't receive it? Check spam, or try again in a minute.</p>
        </div>
        <div className="mt-6 text-center">
          <Link href="/auth/login" className="text-indigo-300 hover:text-white text-sm">← Back to sign in</Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      variant="signup"
      title="Create your workspace"
      subtitle="Start scoring customers in under a minute."
      footer={<>Already have an account? <Link href="/auth/login" className="text-indigo-300 hover:text-white font-medium">Sign in</Link></>}
    >
      {!configured && <ConfigWarning />}

      <SocialAuthButtons />
      <Divider />

      <form onSubmit={submit} className="space-y-4">
        <Field
          icon={<User className="w-4 h-4" />}
          label="Full name"
          type="text"
          autoComplete="name"
          value={fullName}
          onChange={setFullName}
          placeholder="Alex Morgan"
          required
        />
        <Field
          icon={<Mail className="w-4 h-4" />}
          label="Work email"
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
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          placeholder="At least 8 characters"
          required
          suffix={
            <button type="button" onClick={() => setShowPw(!showPw)} className="text-slate-400 hover:text-white">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />

        {password && (
          <div>
            <div className="flex gap-1 mb-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i < strength.score ? strength.color : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
            <p className={`text-xs ${strength.score < 2 ? 'text-rose-300' : strength.score < 3 ? 'text-amber-300' : 'text-emerald-300'}`}>
              {strength.label}
            </p>
          </div>
        )}

        <label className="flex items-start gap-2 cursor-pointer select-none text-sm text-slate-300">
          <input
            type="checkbox"
            checked={accept}
            onChange={(e) => setAccept(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5"
          />
          <span>
            I agree to the{' '}
            <Link href="/app/terms" className="text-indigo-300 hover:text-white">Terms</Link> and{' '}
            <Link href="/app/privacy" className="text-indigo-300 hover:text-white">Privacy Policy</Link>.
          </span>
        </label>

        {error && <ErrorBox message={error} />}
        {success === 'in' && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-sm">
            <CheckCircle2 className="w-4 h-4" /> Account created — redirecting...
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 transition-all shadow-lg shadow-indigo-700/30 disabled:opacity-50"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : 'Create account'}
        </button>
      </form>
    </AuthShell>
  );
}

function scorePassword(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw) && pw.length >= 12) score++;
  const colors = ['bg-rose-400', 'bg-rose-400', 'bg-amber-400', 'bg-emerald-400', 'bg-emerald-400'];
  const labels = ['Too short', 'Weak', 'Okay', 'Strong', 'Excellent'];
  return { score, color: colors[score], label: labels[score] };
}
