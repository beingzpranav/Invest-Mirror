'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '@/lib/PortfolioContext';
import { classifyPortfolio, computePortfolioMetrics } from '@/lib/archetypeEngine';
import PortfolioScanner from '@/components/archetype/PortfolioScanner';
import ArchetypeHero from '@/components/archetype/ArchetypeHero';
import PortfolioStory from '@/components/archetype/PortfolioStory';
import ArchetypeDNA from '@/components/archetype/ArchetypeDNA';
import Link from 'next/link';
import { LayoutDashboard, Search, RefreshCw, Brain } from 'lucide-react';

export default function ArchetypePage() {
  const { investments, isLoggedIn } = usePortfolio();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoggedIn) {
      router.push('/');
    }
  }, [mounted, isLoggedIn, router]);

  const result = useMemo(() => classifyPortfolio(investments), [investments]);
  const metrics = useMemo(() => computePortfolioMetrics(investments), [investments]);

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

  const handleScanComplete = () => {
    setScanning(false);
    setRevealed(true);
  };

  const handleRescan = () => {
    setRevealed(false);
    setScanning(true);
  };

  if (!result || !metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4 bg-slate-50 dark:bg-zinc-950">
        <div className="max-w-md mx-auto p-8 sm:p-10 rounded-[32px] bg-white/80 dark:bg-zinc-900/40 border border-slate-200/60 dark:border-zinc-800/60 backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col items-center gap-6">
          
          <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-[#9fe870]/10 blur-xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-[#38c8ff]/10 blur-xl pointer-events-none" />

          <div className="relative flex items-center justify-center w-20 h-20 mb-1">
            <div className="absolute inset-0 rounded-full bg-[#9fe870]/10 dark:bg-[#9fe870]/5 animate-ping" />
            <div className="absolute w-14 h-14 rounded-full bg-[#9fe870]/20 dark:bg-[#9fe870]/10 animate-pulse" />
            <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-[#9fe870] text-[#0e0f0c] shadow-lg shadow-[#9fe870]/20">
              <Brain size={20} strokeWidth={2.5} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">No portfolio data found</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed max-w-[280px] mx-auto">
              Add some investments first, then come back to discover your behavioral investor archetype.
            </p>
          </div>

          <Link
            href="/explorer"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-zinc-950 text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#9fe870]/5 dark:shadow-black/20"
          >
            <Search size={12} strokeWidth={3} /> Go to Explorer
          </Link>
        </div>
      </div>
    );
  }

  const { archetype, confidence, influencingFactors, observations, dimensions, scores } = result;

  return (
    <>
      
      <AnimatePresence>
        {scanning && (
          <motion.div
            key="scanner"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PortfolioScanner
              onComplete={handleScanComplete}
              investmentCount={investments.length}
              totalValue={metrics.totalValue}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {revealed && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative bg-slate-50 dark:bg-zinc-950 overflow-x-hidden"
          >
            
            <div className="fixed top-20 right-5 z-30">
              <button
                onClick={handleRescan}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold text-slate-400 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white border border-slate-200/40 dark:border-zinc-800/40 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200 cursor-pointer shadow-sm"
              >
                <RefreshCw size={11} strokeWidth={2.5} />
                Re-scan
              </button>
            </div>

            <ArchetypeHero
              archetype={archetype}
              confidence={confidence}
              metrics={metrics}
              investmentCount={investments.length}
            />

            <div
              className="h-px w-full"
              style={{
                background: `linear-gradient(90deg, transparent, ${archetype.gradientFrom}40, transparent)`,
              }}
            />

            <PortfolioStory
              observations={observations}
              archetypeColor={archetype.gradientFrom}
            />

            <ArchetypeDNA
              influencingFactors={influencingFactors}
              dimensions={dimensions}
              scores={scores}
              archetypeId={archetype.id}
              archetypeColor={archetype.gradientFrom}
            />

            <section className="relative py-28 sm:py-36 border-t border-slate-200/20 dark:border-zinc-800/20 flex flex-col items-center justify-center text-center px-6">
              
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
                aria-hidden
              >
                <span
                  className="text-[100px] sm:text-[180px] font-black tracking-tighter leading-none"
                  style={{
                    color: `${archetype.gradientFrom}04`,
                    WebkitTextStroke: `1px ${archetype.gradientFrom}08`,
                  }}
                >
                  NEXT
                </span>
              </div>

              <div className="relative z-10 flex flex-col items-center gap-6 max-w-xl">
                
                <div className="flex items-center gap-3">
                  <span
                    className="h-px w-10"
                    style={{ background: `linear-gradient(90deg, transparent, ${archetype.gradientFrom}80)` }}
                  />
                  <span className="text-[9px] font-mono tracking-[0.3em] text-slate-400 dark:text-zinc-500 uppercase">
                    Chapter 06 // Alignment Actions
                  </span>
                  <span
                    className="h-px w-10"
                    style={{ background: `linear-gradient(270deg, transparent, ${archetype.gradientFrom}80)` }}
                  />
                </div>

                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-5xl select-none"
                >
                  {archetype.icon}
                </motion.div>

                <div className="overflow-hidden">
                  <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                    Ready to optimize?
                  </h2>
                </div>

                <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Your archetype shifts as your portfolio evolves. Modify allocations in the Explorer and watch your classification update in real time.
                </p>

                <div className="flex items-center gap-3 flex-wrap justify-center pt-2">
                  <Link
                    href="/"
                    className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-xs text-white transition-all duration-200 hover:scale-[1.04] active:scale-[0.97] shadow-lg hover:shadow-xl cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, ${archetype.gradientFrom}, ${archetype.gradientTo})`,
                      boxShadow: `0 8px 24px ${archetype.gradientFrom}30`,
                    }}
                  >
                    <LayoutDashboard size={13} strokeWidth={2.5} />
                    Go to Dashboard
                  </Link>
                  <Link
                    href="/explorer"
                    className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-xs border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all duration-200 cursor-pointer"
                  >
                    <Search size={13} strokeWidth={2.5} />
                    Open Explorer
                  </Link>
                </div>

                <div className="pt-6 flex items-center gap-2 text-[9px] font-mono text-slate-300 dark:text-zinc-700 tracking-widest uppercase">
                  <motion.span
                    className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  Archetype Engine v2.0 // Live Classification
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
