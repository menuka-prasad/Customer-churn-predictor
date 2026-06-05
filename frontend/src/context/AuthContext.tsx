import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, authRedirectUrl } from '../lib/supabase';

interface AuthCtx {
  user: User | null;
  session: Session | null;
  loading: boolean;
  configured: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithPassword: (email: string, password: string, fullName?: string) => Promise<{ error?: string; needsEmailConfirm?: boolean }>;
  signInWithOAuth: (provider: 'google' | 'facebook') => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<{ error?: string }>;
  updatePassword: (password: string) => Promise<{ error?: string }>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signInWithPassword: AuthCtx['signInWithPassword'] = async (email, password) => {
    if (!isSupabaseConfigured) return { error: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { error: error.message } : {};
  };

  const signUpWithPassword: AuthCtx['signUpWithPassword'] = async (email, password, fullName) => {
    if (!isSupabaseConfigured) return { error: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: fullName ? { full_name: fullName } : undefined,
        emailRedirectTo: authRedirectUrl('/auth/login'),
      },
    });
    if (error) return { error: error.message };
    const needsEmailConfirm = !data.session;
    return { needsEmailConfirm };
  };

  const signInWithOAuth: AuthCtx['signInWithOAuth'] = async (provider) => {
    if (!isSupabaseConfigured) return { error: 'Supabase is not configured.' };
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: authRedirectUrl('/app') },
    });
    return error ? { error: error.message } : {};
  };

  const signOut: AuthCtx['signOut'] = async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
  };

  const sendPasswordReset: AuthCtx['sendPasswordReset'] = async (email) => {
    if (!isSupabaseConfigured) return { error: 'Supabase is not configured.' };
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: authRedirectUrl('/auth/reset-password'),
    });
    return error ? { error: error.message } : {};
  };

  const updatePassword: AuthCtx['updatePassword'] = async (password) => {
    if (!isSupabaseConfigured) return { error: 'Supabase is not configured.' };
    const { error } = await supabase.auth.updateUser({ password });
    return error ? { error: error.message } : {};
  };

  return (
    <Ctx.Provider
      value={{
        user: session?.user ?? null,
        session,
        loading,
        configured: isSupabaseConfigured,
        signInWithPassword,
        signUpWithPassword,
        signInWithOAuth,
        signOut,
        sendPasswordReset,
        updatePassword,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
