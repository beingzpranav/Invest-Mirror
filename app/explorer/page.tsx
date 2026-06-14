'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePortfolio } from '@/lib/PortfolioContext';
import PortfolioExplorer from '@/components/explorer/PortfolioExplorer';
import InvestmentDetails from '@/components/details/InvestmentDetails';
import { Investment } from '@/lib/types';
import { AnimatePresence } from 'framer-motion';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function useScramble(target: string, delay = 0) {
  const [display, setDisplay] = useState(target);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let step = 0;
      const totalSteps = 12; // Settle in 12 steps
      const intervalMs = 35; // 35ms per step -> 420ms total duration

      const tick = () => {
        step++;
        const revealCount = Math.floor((step / totalSteps) * target.length);
        const scrambled = target
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (i < revealCount) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('');
        setDisplay(scrambled);

        if (step < totalSteps) {
          timerRef.current = window.setTimeout(tick, intervalMs);
        } else {
          setDisplay(target);
        }
      };

      tick();
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [target, delay]);

  return display;
}

export default function ExplorerPage() {
  const { investments, isLoggedIn } = usePortfolio();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const title = useScramble('EXPLORER', 200);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoggedIn) {
      router.push('/');
    }
  }, [mounted, isLoggedIn, router]);

  if (!mounted || !isLoggedIn) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950">
        <div className="text-center flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
          <span className="text-xs font-mono text-slate-500 dark:text-zinc-500">Redirecting...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20 blur-[140px] animate-float-blob-1" style={{ willChange: 'transform', background: 'radial-gradient(circle, #38c8ff, transparent 70%)' }} />
      <div className="pointer-events-none fixed bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-15 blur-[120px] animate-float-blob-2" style={{ willChange: 'transform', background: 'radial-gradient(circle, #9fe870, transparent 70%)' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">

        {/* ── Editorial Hero ── */}
        <section className="pt-24 pb-12 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <span className="h-px w-8" style={{ background: 'var(--color-accent-cyan)' }} />
            <span className="text-[9px] font-mono tracking-[0.3em] uppercase" style={{ color: 'var(--color-mute)' }}>
              Index // Portfolio Explorer
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-none" style={{ color: 'var(--color-ink)' }}>
            {title}
          </h1>

          <p className="text-sm max-w-sm leading-relaxed" style={{ color: 'var(--color-body)' }}>
            Search, filter, and manage every holding in your portfolio.
          </p>

          <div className="flex items-center gap-6 pt-1">
            <div>
              <span className="text-[8px] font-mono tracking-[0.25em] uppercase block" style={{ color: 'var(--color-mute)' }}>Holdings</span>
              <span className="text-2xl font-black font-mono tracking-tighter" style={{ color: 'var(--color-ink)' }}>{investments.length}</span>
            </div>
            <div className="h-6 w-px" style={{ background: 'rgba(14,15,12,0.08)' }} />
            <div>
              <span className="text-[8px] font-mono tracking-[0.25em] uppercase block" style={{ color: 'var(--color-mute)' }}>Asset Classes</span>
              <span className="text-2xl font-black font-mono tracking-tighter" style={{ color: 'var(--color-ink)' }}>
                {new Set(investments.map((i) => i.assetClass)).size}
              </span>
            </div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="h-px w-full" style={{ background: 'rgba(14,15,12,0.08)' }} />

        {/* ── Explorer list ── */}
        <section className="py-10">
          <PortfolioExplorer
            selectedInvestmentId={selectedInvestment?.id ?? null}
            onSelectInvestment={(inv) => setSelectedInvestment(inv)}
          />
        </section>
      </div>

      {/* Detail side drawer */}
      <AnimatePresence>
        {selectedInvestment && (
          <InvestmentDetails
            key={selectedInvestment.id}
            investment={selectedInvestment}
            allInvestments={investments}
            onClose={() => setSelectedInvestment(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
