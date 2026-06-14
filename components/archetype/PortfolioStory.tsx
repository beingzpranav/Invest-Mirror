'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import type { PortfolioObservation } from '@/lib/archetypeEngine';

interface PortfolioStoryProps {
  observations: PortfolioObservation[];
  archetypeColor: string;
}

const SEVERITY_CONFIG = {
  positive: { color: '#10b981', accent: '#059669', label: 'STRENGTH', symbol: '+' },
  warning: { color: '#f59e0b', accent: '#d97706', label: 'RISK SIGNAL', symbol: '!' },
  info: { color: '#06b6d4', accent: '#0891b2', label: 'INSIGHT', symbol: '→' },
  neutral: { color: '#64748b', accent: '#475569', label: 'NOTE', symbol: '◆' },
};

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';

// Scramble on scroll-entry hook
function useScrambleOnView(target: string, isVisible: boolean) {
  const [display, setDisplay] = useState(() => target.replace(/[^\s]/g, '_'));
  const animatingRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isVisible || animatingRef.current) return;
    animatingRef.current = true;

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
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
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

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isVisible, target]);

  return display;
}

// Single full-width observation section
function ObservationSection({
  obs,
  index,
  totalCount,
}: {
  obs: PortfolioObservation;
  index: number;
  totalCount: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useInView(ref, { once: true, margin: '-120px' });
  const config = SEVERITY_CONFIG[obs.severity] || SEVERITY_CONFIG.neutral;
  const scrambledHeadline = useScrambleOnView(obs.headline.toUpperCase(), isVisible);
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className="relative w-full py-20 sm:py-28 border-b border-slate-200/20 dark:border-zinc-800/20">
      {/* Large index number — watermark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.1 }}
        className={`absolute top-8 ${isEven ? 'right-6 sm:text-right' : 'left-6 sm:text-left'} text-[80px] sm:text-[120px] lg:text-[180px] font-black font-mono leading-none pointer-events-none select-none hidden sm:block`}
        style={{
          color: `${config.color}07`,
          WebkitTextStroke: `1px ${config.color}10`,
          lineHeight: 1,
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </motion.div>

      {/* Content layout */}
      <div className={`relative z-10 flex flex-col items-start sm:${isEven ? 'items-start' : 'items-end sm:text-right'} max-w-4xl ${isEven ? 'mr-auto' : 'sm:ml-auto'} px-4 sm:px-6`}>

        {/* Signal badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-2 mb-4 sm:mb-5"
          style={{ flexDirection: 'row' }}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
            style={{ backgroundColor: config.color, color: '#fff' }}
          >
            {config.symbol}
          </div>
          <span
            className="text-[9px] font-mono font-black tracking-[0.3em] uppercase"
            style={{ color: config.color }}
          >
            SIGNAL // {config.label}
          </span>
          <span className="text-[9px] font-mono text-slate-400 dark:text-zinc-600">
            {String(index + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
          </span>
        </motion.div>

        {/* Scramble headline — large */}
        <div className="overflow-hidden mb-5">
          <motion.h3
            initial={{ y: '105%' }}
            animate={isVisible ? { y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1], delay: 0.15 }}
            className="text-2xl sm:text-4xl lg:text-6xl font-black leading-none tracking-tighter font-mono"
            style={{ color: config.color }}
          >
            {scrambledHeadline}
          </motion.h3>
        </div>

        {/* Divider rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isVisible ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className={`h-px w-full max-w-lg mb-5 origin-left`}
          style={{
            background: `linear-gradient(${isEven ? '90deg' : '270deg'}, ${config.color}60, transparent)`,
            transformOrigin: isEven ? 'left' : 'right',
          }}
        />

        {/* Detail text */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed max-w-xl"
        >
          {obs.detail}
        </motion.p>
      </div>
    </div>
  );
}

export default function PortfolioStory({ observations, archetypeColor }: PortfolioStoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderVisible = useInView(headerRef, { once: true });

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden">
      {/* Chapter header — full-width editorial */}
      <div
        ref={headerRef}
        className="relative py-20 sm:py-28 flex flex-col items-center justify-center text-center px-6 border-b border-slate-200/20 dark:border-zinc-800/20"
      >
        {/* Ghost word — huge background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={isHeaderVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 items-center justify-center pointer-events-none select-none overflow-hidden hidden sm:flex"
        >
          <span
            className="text-[120px] sm:text-[200px] font-black font-mono tracking-tighter leading-none"
            style={{
              color: `${archetypeColor}04`,
              WebkitTextStroke: `1px ${archetypeColor}08`,
            }}
          >
            SIGNALS
          </span>
        </motion.div>

        <div className="relative z-10 flex flex-col items-center gap-5 max-w-3xl">
          {/* Chapter label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isHeaderVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <span
              className="h-px w-12"
              style={{ background: `linear-gradient(90deg, transparent, ${archetypeColor}80)` }}
            />
            <span className="text-[10px] font-mono tracking-[0.3em] text-slate-400 dark:text-zinc-500 uppercase">
              Chapter 02 // Behavioural Signals
            </span>
            <span
              className="h-px w-12"
              style={{ background: `linear-gradient(270deg, transparent, ${archetypeColor}80)` }}
            />
          </motion.div>

          {/* Kinetic large heading */}
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: '105%' }}
              animate={isHeaderVisible ? { y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1], delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-7xl font-black leading-none tracking-tighter text-slate-900 dark:text-white"
            >
              What Your Portfolio
            </motion.h2>
          </div>
          <div className="overflow-hidden -mt-2">
            <motion.h2
              initial={{ y: '105%' }}
              animate={isHeaderVisible ? { y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1], delay: 0.2 }}
              className="text-3xl sm:text-5xl lg:text-7xl font-black leading-none tracking-tighter"
              style={{
                background: `linear-gradient(135deg, ${archetypeColor}, ${archetypeColor}aa)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Says About You
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isHeaderVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm sm:text-base text-slate-500 dark:text-zinc-400 leading-relaxed max-w-lg"
          >
            Numbers reveal allocation — but your <em>choices</em> reveal instinct. These signals were extracted from your unique patterns and behavioral fingerprints.
          </motion.p>
        </div>
      </div>

      {/* Observation sections — alternating full-width editorial */}
      <div className="relative">
        {observations.map((obs, i) => (
          <ObservationSection
            key={obs.headline}
            obs={obs}
            index={i}
            totalCount={observations.length}
          />
        ))}
      </div>
    </section>
  );
}
