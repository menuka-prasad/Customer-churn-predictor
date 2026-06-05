'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { AuthShell } from '../../AuthShell';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabase';
import { Field, ErrorBox, ConfigWarning } from './LoginPage';
import Link from 'next/link';

export function ResetPasswordPage() {
  const { updatePassword, configured } = useAuth();
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!configured) {
      setReady(true);
      return;
    }
    // Supabase auto-handles recovery tokens in the URL via detectSessionInUrl.
    // We just need to confirm a session exists for the user to update password.
    supabase.auth.getSession().then(({ data }) => {
      setHasRecoverySession(Boolean(data.session));
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) setHasRecoverySession(true);
    });
    return () => sub.subscription.unsubscribe();
  }, [configured]);

  const mismatch = useMemo(() => Boolean(password && confirm && password !== confirm), [password, confirm]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (mismatch) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);
    if (error) setError(error);
    else {
      setDone(true);
      setTimeout(() => router.replace('/login'), 1800);
    }
  };

  return (
    <AuthShell
      variant="reset"
      title={done ? 'Password updated' : 'Set a new password'}
      subtitle={done ? 'Redirecting you to sign in...' : 'Choose a strong password you haven\'t used before.'}
      footer={
        !done && (
          <Link href="/login" className="text-indigo-300 hover:text-white">Back to sign in</Link>
        )
      }
    >
      {!configured && <ConfigWarning />}

      {!ready ? (
        <div className="flex items-center justify-center py-12 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : done ? (
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-300" />
          </div>
          <p className="text-slate-200">Your password has been changed. You can now sign in with your new credentials.</p>
        </div>
      ) : !hasRecoverySession && configured ? (
        <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-300 mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold mb-1">Reset link invalid or expired</div>
              <p className="text-sm text-slate-300">
                This reset link is no longer valid. Request a new one to continue.
              </p>
              <Link
                href="/forgot-password"
                className="inline-block mt-3 text-sm text-indigo-300 hover:text-white"
              >
                Request new link →
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <Field
            icon={<Lock className="w-4 h-4" />}
            label="New password"
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
          <Field
            icon={<Lock className="w-4 h-4" />}
            label="Confirm new password"
            type={showPw ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirm}
            onChange={setConfirm}
            placeholder="Re-enter password"
            required
          />
          {mismatch && (
            <p className="text-xs text-rose-300 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> Passwords don't match
            </p>
          )}

          {error && <ErrorBox message={error} />}

          <button
            type="submit"
            disabled={loading || mismatch}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 transition-all shadow-lg shadow-indigo-700/30 disabled:opacity-50"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : 'Update password'}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
