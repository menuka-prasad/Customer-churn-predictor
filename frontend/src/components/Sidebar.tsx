'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, LayoutGrid, Upload, History, Tag, Shield, FileText,
  ChevronLeft, ChevronRight, LogOut, Home,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props {
  expanded: boolean;
  onToggle: () => void;
}

const navItems = [
  { to: '/predict', label: 'Single Predict', icon: LayoutGrid, group: 'predict' },
  { to: '/batch', label: 'Batch Predict', icon: Upload, group: 'predict' },
  { to: '/history', label: 'History & Analytics', icon: History, group: 'predict' },
  { to: '/pricing', label: 'Pricing', icon: Tag, group: 'company' },
  { to: '/privacy', label: 'Privacy Policy', icon: Shield, group: 'company' },
  { to: '/terms', label: 'Terms & Conditions', icon: FileText, group: 'company' },
];

export function Sidebar({ expanded, onToggle }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const width = expanded ? 260 : 76;

  const displayName = (user?.user_metadata?.full_name as string | undefined)
    || user?.email?.split('@')[0]
    || 'Guest';
  const displayEmail = user?.email ?? 'demo mode';
  const initials = displayName
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'GU';

  const handleSignOut = async () => {
    await signOut();
    router.replace('/auth/login');
  };

  return (
    <motion.aside
      animate={{ width }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      className="relative h-screen sticky top-0 shrink-0 border-r border-white/10 bg-slate-950/80 backdrop-blur-xl z-30"
    >
      <div className="flex flex-col h-full p-3">
        {/* Logo */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors mb-4"
        >
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shrink-0 shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="flex flex-col items-start min-w-0"
              >
                <span className="text-white font-semibold truncate">Churnly AI</span>
                <span className="text-[10px] uppercase tracking-wider text-indigo-300/70">Predict · Retain</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          aria-label="Toggle sidebar"
          className="absolute -right-3 top-8 z-40 w-6 h-6 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-900/40 ring-2 ring-slate-950 transition-colors"
        >
          {expanded ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden space-y-6 mt-2">
          <NavGroup label="Workspace" expanded={expanded}>
            {navItems.filter(n => n.group === 'predict').map(n => {
              const isActive = n.to === '/predict' ? pathname === n.to : pathname.startsWith(n.to);
              return <NavItem key={n.to} {...n} expanded={expanded} isActive={isActive} />;
            })}
          </NavGroup>
          <NavGroup label="Company" expanded={expanded}>
            {navItems.filter(n => n.group === 'company').map(n => {
              const isActive = pathname.startsWith(n.to);
              return <NavItem key={n.to} {...n} expanded={expanded} isActive={isActive} />;
            })}
          </NavGroup>
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 pt-3 space-y-1">
          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Home className="w-4 h-4 shrink-0" />
            <AnimatePresence>
              {expanded && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm">
                  Home
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
              {initials}
            </div>
            <AnimatePresence>
              {expanded && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">{displayName}</div>
                  <div className="text-xs text-slate-500 truncate">{displayEmail}</div>
                </motion.div>
              )}
            </AnimatePresence>
            {expanded && (
              <button
                onClick={handleSignOut}
                aria-label="Sign out"
                className="p-1 rounded text-slate-500 hover:text-white hover:bg-white/5"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

function NavGroup({ label, expanded, children }: { label: string; expanded: boolean; children: React.ReactNode }) {
  return (
    <div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="px-3 mb-2 text-[10px] uppercase tracking-wider text-slate-500"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function NavItem({ to, label, icon: Icon, expanded, isActive }: { to: string; label: string; icon: any; expanded: boolean; isActive: boolean }) {
  return (
    <Link
      href={to}
      className={`relative group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
        isActive
          ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/20 text-white shadow-inner'
          : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {isActive && (
        <motion.span
          layoutId="active-pill"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-indigo-400 to-purple-500"
        />
      )}
      <Icon className="w-4 h-4 shrink-0" />
      <AnimatePresence>
        {expanded && (
          <motion.span
            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }}
            className="text-sm truncate"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      {!expanded && (
        <span className="pointer-events-none absolute left-full ml-3 px-2 py-1 rounded-md bg-slate-900 border border-white/10 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
          {label}
        </span>
      )}
    </Link>
  );
}
