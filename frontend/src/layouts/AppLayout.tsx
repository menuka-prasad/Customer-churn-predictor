import { Outlet, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export function AppLayout() {
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(99,102,241,0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="relative flex">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <Sidebar expanded={expanded} onToggle={() => setExpanded(!expanded)} />
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              />
              <motion.div
                initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="md:hidden fixed left-0 top-0 z-50"
              >
                <Sidebar expanded={true} onToggle={() => setMobileOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {/* Mobile topbar */}
          <div className="md:hidden sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
              aria-label="Open menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="text-sm font-semibold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Churnly AI
            </span>
            <div className="w-9" />
          </div>

          <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-10 max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
