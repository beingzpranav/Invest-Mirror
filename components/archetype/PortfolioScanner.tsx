'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

interface ScannerProps {
  onComplete: () => void;
  investmentCount: number;
  totalValue: number;
}

const SCAN_STEPS = [
  'Reading portfolio composition…',
  'Measuring risk distribution…',
  'Analysing asset allocation…',
  'Detecting behavioural patterns…',
  'Computing personality vectors…',
  'Matching investor archetype…',
];

export default function PortfolioScanner({ onComplete, investmentCount, totalValue }: ScannerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate progress bar
    const ctx = gsap.context(() => {
      gsap.to({ val: 0 }, {
        val: 100,
        duration: 3.2,
        ease: 'power2.inOut',
        onUpdate: function () {
          setProgress(Math.round(this.targets()[0].val));
        },
        onComplete: () => {
          setTimeout(onComplete, 350);
        },
      });

      // Glow pulse
      if (glowRef.current) {
        gsap.fromTo(glowRef.current,
          { opacity: 0.3, scale: 0.9 },
          { opacity: 0.7, scale: 1.1, duration: 1.2, repeat: -1, yoyo: true, ease: 'sine.inOut' }
        );
      }
    });

    // Cycle through steps
    const interval = setInterval(() => {
      setStepIndex((prev) => Math.min(prev + 1, SCAN_STEPS.length - 1));
    }, 520);

    return () => {
      ctx.revert();
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 overflow-hidden">
      {/* Background glow */}
      <div
        ref={glowRef}
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Scan grid lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 dark:opacity-10">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent"
            style={{ top: `${i * 10 + 5}%` }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-sm px-6">
        {/* Pulsing ring */}
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute w-28 h-28 rounded-full bg-sky-500/15 dark:bg-cyan-500/15"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 rounded-full border-2 border-dashed border-sky-500/40 dark:border-cyan-500/40"
          />
          <div className="absolute text-3xl">🔬</div>
        </div>

        {/* Metrics badges */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold text-slate-600 dark:text-zinc-300">
            {investmentCount} assets
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold text-slate-600 dark:text-zinc-300">
            ${(totalValue / 1000).toFixed(1)}k total
          </div>
        </div>

        {/* Step text */}
        <div className="h-6 overflow-hidden text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={stepIndex}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm font-semibold text-slate-600 dark:text-zinc-300"
            >
              {SCAN_STEPS[stepIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="w-full flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500">Analysing</span>
            <span className="text-[11px] font-black text-sky-500 dark:text-cyan-400">{progress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
            <div
              ref={progressRef}
              className="h-full rounded-full transition-none"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #0ea5e9, #8b5cf6)',
                boxShadow: '0 0 8px rgba(14,165,233,0.5)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
