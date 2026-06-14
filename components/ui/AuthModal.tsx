'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, ArrowRight, Sparkles, Key, Info } from 'lucide-react';
import { usePortfolio } from '@/lib/PortfolioContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
  const { login, signup } = usePortfolio();
  const [tab, setTab] = useState<'login' | 'signup'>(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTab(defaultTab);
      setEmail('');
      setPassword('');
      setEmailError('');
      setPasswordError('');
      setError('');
      setLoading(false);
      setSuccess(false);
      setTimeout(() => emailInputRef.current?.focus(), 150);
    }
  }, [isOpen, defaultTab]);

  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validatePassword = (value: string) => {
    return value.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    setPasswordError('');

    let valid = true;

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }

    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 6 characters.');
      valid = false;
    }

    if (!valid) return;

    setLoading(true);

    // Simulate standard network delay for a premium auth transition
    setTimeout(() => {
      let ok = false;
      if (tab === 'login') {
        ok = login(email, password);
      } else {
        ok = signup(email, password);
      }

      setLoading(false);
      if (ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setError('Authentication failed. Please verify your credentials.');
      }
    }, 900);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            onClick={onClose}
          >
            {/* Split Screen Modal Card */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="relative w-full max-w-md md:max-w-5xl rounded-[24px] md:rounded-[40px] overflow-hidden flex flex-col md:flex-row shadow-2xl border border-zinc-200/20 bg-zinc-950 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* CLOSE BUTTON */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 z-50 h-9 w-9 rounded-full bg-black/40 hover:bg-black/80 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={18} strokeWidth={2.5} />
              </button>

              {/* LEFT COLUMN: Decorative illustration block */}
              <div className="hidden md:flex w-full md:w-1/2 bg-zinc-950 text-white p-8 sm:p-12 relative flex-col justify-between overflow-hidden border-b md:border-b-0 md:border-r border-zinc-800/60">
                {/* Backdrop Blur Mesh Filter Layer */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-2 pointer-events-none" />
                
                {/* Interactive background shapes & light streaks */}
                <div className="absolute inset-0 z-1 flex overflow-hidden opacity-25">
                  <div className="h-[40rem] w-[4rem] bg-gradient-to-r from-transparent via-[#ffffff20] to-transparent rotate-12 scale-y-150 blur-xs" />
                  <div className="h-[40rem] w-[4rem] bg-gradient-to-r from-transparent via-[#ffffff10] to-transparent rotate-12 scale-y-150 blur-xs -ml-2" />
                  <div className="h-[40rem] w-[4rem] bg-gradient-to-r from-transparent via-[#ffffff15] to-transparent rotate-12 scale-y-150 blur-xs -ml-2" />
                </div>
                
                {/* Glowing Colored Blobs */}
                <div className="absolute bottom-[-100px] left-[-50px] w-[250px] h-[250px] bg-sky-500/20 rounded-full blur-[80px] z-1" />
                <div className="absolute top-10 right-[-50px] w-[180px] h-[180px] bg-indigo-500/15 rounded-full blur-[60px] z-1" />
                <div className="absolute bottom-5 right-10 w-[120px] h-[120px] bg-[#9fe870]/10 rounded-full blur-[50px] z-1" />

                {/* Left side Wordmark Branding */}
                <div className="relative z-10 flex items-center gap-2.5">
                  <img
                    src="/favicon/favicon.svg"
                    alt="InvestMirror Logo"
                    className="h-8 w-8 object-contain"
                  />
                  <span className="text-sm font-black tracking-tight text-white font-mono uppercase">
                    InvestMirror Analyzer
                  </span>
                </div>

                {/* Left side Lead Copy */}
                <div className="relative z-10 my-auto py-12 md:py-0">
                  <h1 className="text-2xl sm:text-3.5xl font-black leading-tight tracking-tight text-white">
                    Uncover the behavioral patterns driving your wealth.
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-4 leading-relaxed font-semibold">
                    Analyze bias exposure, simulated crash drawdowns, and rebalance allocations based on your financial personality archetype.
                  </p>
                </div>

                {/* System Readout metadata */}
                <div className="relative z-10 flex items-center gap-2 text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#9fe870] animate-pulse" />
                  SECURED AUTH v1.4 // CLOUD SESSION
                </div>
              </div>

              {/* RIGHT COLUMN: Form block */}
              <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-between bg-zinc-900 text-zinc-100 z-10 relative">
                {/* Sub-header background overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 to-zinc-950/20 pointer-events-none" />

                <div className="relative z-10">
                  {/* TAB SELECTOR BUTTONS */}
                  <div className="flex gap-4 border-b border-zinc-800 pb-3 mb-6">
                    <button
                      type="button"
                      onClick={() => {
                        setTab('login');
                        setError('');
                        setEmailError('');
                        setPasswordError('');
                      }}
                      className={`text-xs font-mono font-bold uppercase tracking-widest relative pb-2 cursor-pointer transition-colors ${
                        tab === 'login' ? 'text-[#9fe870]' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      Log In
                      {tab === 'login' && (
                        <motion.div
                          layoutId="authTabIndicator"
                          className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#9fe870]"
                        />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTab('signup');
                        setError('');
                        setEmailError('');
                        setPasswordError('');
                      }}
                      className={`text-xs font-mono font-bold uppercase tracking-widest relative pb-2 cursor-pointer transition-colors ${
                        tab === 'signup' ? 'text-[#9fe870]' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      Sign Up
                      {tab === 'signup' && (
                        <motion.div
                          layoutId="authTabIndicator"
                          className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#9fe870]"
                        />
                      )}
                    </button>
                  </div>

                  <h2 className="text-2xl font-black mb-1 tracking-tight text-white">
                    {tab === 'login' ? 'Welcome Back' : 'Create Account'}
                  </h2>
                  <p className="text-xs text-zinc-400 mb-6 font-semibold">
                    {tab === 'login'
                      ? 'Access your saved portfolio behavioral profiles.'
                      : 'Set up a new secure space to track allocations.'}
                  </p>

                  {/* FORM ERRORS */}
                  {error && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold font-mono mb-4">
                      {error}
                    </div>
                  )}

                  {/* AUTH FORM */}
                  <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
                    {/* Email Input */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="auth-email" className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 flex items-center gap-1.5 font-bold">
                        <Mail size={12} /> Email Address
                      </label>
                      <input
                        ref={emailInputRef}
                        type="email"
                        id="auth-email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading || success}
                        className={`w-full rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-white bg-zinc-950 border focus:border-[#9fe870] outline-none transition-all ${
                          emailError ? 'border-rose-500 focus:border-rose-500' : 'border-zinc-800'
                        }`}
                        aria-invalid={!!emailError}
                        aria-describedby="auth-email-error"
                      />
                      {emailError && (
                        <p id="auth-email-error" className="text-rose-400 text-[10px] font-mono mt-0.5 font-bold">
                          {emailError}
                        </p>
                      )}
                    </div>

                    {/* Password Input */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="auth-password" className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 flex items-center gap-1.5 font-bold">
                        <Lock size={12} /> Password
                      </label>
                      <input
                        type="password"
                        id="auth-password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading || success}
                        className={`w-full rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-white bg-zinc-950 border focus:border-[#9fe870] outline-none transition-all ${
                          passwordError ? 'border-rose-500 focus:border-rose-500' : 'border-zinc-800'
                        }`}
                        aria-invalid={!!passwordError}
                        aria-describedby="auth-password-error"
                      />
                      {passwordError && (
                        <p id="auth-password-error" className="text-rose-400 text-[10px] font-mono mt-0.5 font-bold">
                          {passwordError}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading || success}
                      className="w-full bg-[#9fe870] hover:bg-[#8fd860] text-zinc-950 font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#9fe870]/10 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] text-xs sm:text-sm mt-2"
                    >
                      {loading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent" />
                      ) : success ? (
                        <>✓ Access Granted</>
                      ) : (
                        <>
                          {tab === 'login' ? 'Log In' : 'Create Account'}
                          <ArrowRight size={14} className="stroke-[2.5]" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
