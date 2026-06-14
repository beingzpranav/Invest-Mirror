'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Search, Sparkles, Flame, LogOut, Menu } from 'lucide-react';
import { usePortfolio } from '@/lib/PortfolioContext';
import AuthModal from './ui/AuthModal';

// ─── Animated Hamburger → X icon ────────────────────────────────────────────
function MenuToggleIcon({ open, className }: { open: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      stroke="currentColor"
      className={className}
    >
      {/* Top bar */}
      <motion.line
        x1="4" y1="7" x2="20" y2="7"
        animate={open ? { x1: 5, y1: 5, x2: 19, y2: 19 } : { x1: 4, y1: 7, x2: 20, y2: 7 }}
        transition={{ duration: 0.28, ease: 'easeInOut' }}
      />
      {/* Middle bar */}
      <motion.line
        x1="4" y1="12" x2="20" y2="12"
        initial={{ opacity: 1 }}
        animate={open ? { opacity: 0, x1: 12, x2: 12 } : { opacity: 1, x1: 4, x2: 20 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      />
      {/* Bottom bar */}
      <motion.line
        x1="4" y1="17" x2="20" y2="17"
        animate={open ? { x1: 5, y1: 19, x2: 19, y2: 5 } : { x1: 4, y1: 17, x2: 20, y2: 17 }}
        transition={{ duration: 0.28, ease: 'easeInOut' }}
      />
    </svg>
  );
}

// ─── InvestMirror wordmark SVG ───────────────────────────────────────────────
function WordmarkLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-3 shrink-0 group ${className}`}>
      <div className="h-8 w-8 sm:h-9 w-auto sm:w-9 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
        <img
          src="/favicon/favicon.svg"
          alt="InvestMirror Logo"
          className="h-full w-full object-contain"
        />
      </div>
      <span className="text-sm sm:text-base md:text-lg font-black tracking-tight text-slate-900 dark:text-white">
        InvestMirror
      </span>
    </Link>
  );
}

// ─── Main Navbar ─────────────────────────────────────────────────────────────
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, logout } = usePortfolio();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');

  // Scroll detection
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Close on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const links = useMemo(() => {
    if (!isLoggedIn) return [];
    return [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/explorer', label: 'Explorer', icon: Search },
      { href: '/archetype', label: 'Archetype', icon: Sparkles },
      { href: '/crash-lab', label: 'Crash Lab', icon: Flame },
    ];
  }, [isLoggedIn]);

  return (
    <>
      {/* ── The floating header ── */}
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50 w-full',
          'transition-all duration-300 ease-out',
          scrolled || mobileOpen
            ? 'border-b shadow-sm backdrop-blur-xl'
            : 'border-b border-transparent backdrop-blur-md',
        ].join(' ')}
        style={{
          backgroundColor: mobileOpen || scrolled
            ? 'color-mix(in srgb, var(--color-canvas) 92%, transparent)'
            : 'color-mix(in srgb, var(--color-canvas) 30%, transparent)',
          borderColor: scrolled || mobileOpen
            ? 'rgba(14,15,12,0.08)'
            : 'transparent',
        }}
      >
        <nav
          className={[
            'flex w-full items-center justify-between px-4',
            'h-14 transition-all duration-300 ease-out',
            scrolled ? 'md:h-12 md:px-3' : 'md:h-14 md:px-4',
          ].join(' ')}
        >
          {/* Brand */}
          <WordmarkLogo />

          {/* Desktop nav links (only shown when logged in) */}
          {isLoggedIn && links.length > 0 && (
            <div className="hidden md:flex items-center gap-1 rounded-xl p-1 border"
              style={{
                background: 'color-mix(in srgb, var(--color-canvas-soft) 80%, transparent)',
                borderColor: 'rgba(14,15,12,0.08)',
              }}
            >
              {links.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={[
                      'flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap',
                      isActive ? 'font-bold shadow-sm' : 'hover:opacity-80',
                    ].join(' ')}
                    style={isActive ? {
                      background: 'var(--color-canvas)',
                      color: 'var(--color-ink)',
                      boxShadow: '0 1px 4px rgba(14,15,12,0.08)',
                    } : {
                      color: 'var(--color-mute)',
                    }}
                  >
                    <Icon size={12} className="stroke-[2.5]" />
                    {label}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Desktop Right Side Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold border border-slate-200/80 hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-800 transition-all cursor-pointer whitespace-nowrap"
                style={{ color: 'var(--color-ink)' }}
              >
                <LogOut size={12} className="stroke-[2.5]" />
                Log Out
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setAuthTab('login');
                    setAuthOpen(true);
                  }}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-all cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setAuthTab('signup');
                    setAuthOpen(true);
                  }}
                  className="px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 shadow-sm"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-black/10 bg-white/70 hover:bg-slate-100 transition-all duration-200 cursor-pointer"
              style={{ color: 'var(--color-ink)' }}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <MenuToggleIcon open={mobileOpen} className="w-5 h-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile full-screen overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 top-14 z-40 md:hidden bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t border-slate-200/40 dark:border-zinc-800/40 flex flex-col overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="flex h-full w-full flex-col justify-between gap-y-2 p-5"
            >
              {/* Nav links / Auth buttons */}
              <div className="flex flex-col gap-2 pt-2">
                {isLoggedIn ? (
                  <>
                    {links.map(({ href, label, icon: Icon }, i) => {
                      const isActive = pathname === href;
                      return (
                        <motion.div
                          key={href}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.04 + i * 0.06, duration: 0.22 }}
                        >
                          <Link
                            href={href}
                            className={[
                              'flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200',
                              isActive ? 'shadow-md' : 'hover:bg-slate-100 border border-transparent hover:border-slate-200/60',
                            ].join(' ')}
                            style={isActive ? { background: '#0e0f0c', color: '#ffffff' } : { color: '#454745' }}
                          >
                            <Icon size={16} className="stroke-[2.5]" />
                            {label}
                            {isActive && (
                              <span className="ml-auto text-[9px] font-mono tracking-widest opacity-60 uppercase">
                                Active
                              </span>
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}

                    <motion.button
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 + links.length * 0.06, duration: 0.22 }}
                      onClick={() => {
                        setMobileOpen(false);
                        logout();
                        router.push('/');
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-sm font-bold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200/50 cursor-pointer"
                    >
                      <LogOut size={16} className="stroke-[2.5]" />
                      Log Out
                    </motion.button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 pt-4">
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        setAuthTab('login');
                        setAuthOpen(true);
                      }}
                      className="w-full text-center px-4 py-3.5 rounded-2xl text-sm font-bold border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800"
                      style={{ color: 'var(--color-ink)' }}
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        setAuthTab('signup');
                        setAuthOpen(true);
                      }}
                      className="w-full text-center px-4 py-3.5 rounded-2xl text-sm font-black bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom: status strip */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.22 }}
                className="flex flex-col gap-3 pb-4"
              >
                <div className="h-px w-full bg-slate-200/50 dark:bg-zinc-800/50" />
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-600 tracking-widest uppercase">
                    InvestMirror v1.0
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-emerald-500 tracking-widest uppercase">Live</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal Sheet */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} defaultTab={authTab} />
    </>
  );
}
