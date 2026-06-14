'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import type { Archetype, PortfolioMetrics } from '@/lib/archetypeEngine';
import { formatCurrency } from '@/lib/utils';

interface ArchetypeHeroProps {
  archetype: Archetype;
  confidence: number;
  metrics: PortfolioMetrics;
  investmentCount: number;
}

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

// Text scramble hook — cycles through random chars before settling (throttled for high performance)
function useScramble(target: string, delay = 0) {
  const [display, setDisplay] = useState('');
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
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [target, delay]);

  return display;
}

// Animated counter hook
function useCounter(target: number, delay = 0, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, delay, duration]);
  return value;
}

// Floating cursor-tracking particle orb
function MagneticOrb({ color }: { color: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 60, damping: 18 });
  const ySpring = useSpring(y, { stiffness: 60, damping: 18 });

  const handleMove = useCallback((e: MouseEvent) => {
    x.set(e.clientX);
    y.set(e.clientY);
  }, [x, y]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [handleMove]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-0 mix-blend-screen"
      style={{
        x: xSpring,
        y: ySpring,
        translateX: '-50%',
        translateY: '-50%',
        width: 420,
        height: 420,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}18 0%, transparent 65%)`,
        filter: 'blur(40px)',
      }}
    />
  );
}

// Char-by-char animated headline
function KineticHeadline({
  text,
  className,
  style,
  stagger = 0.04,
  initialDelay = 0,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  stagger?: number;
  initialDelay?: number;
}) {
  const chars = text.split('');

  return (
    <span className={`inline-flex flex-wrap ${className}`} style={style} aria-label={text}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: initialDelay + i * stagger,
            ease: [0.215, 0.61, 0.355, 1],
          }}
          className="inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

// Precision ring indicator (compact, no speedometer)
function PrecisionRing({ value, color, label }: { value: number; color: string; label: string }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const count = useCounter(value, 400, 1200);

  return (
    <div className="relative flex flex-col items-center gap-2">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg width="96" height="96" viewBox="0 0 96 96" className="absolute -rotate-90">
          <circle cx="48" cy="48" r={r} fill="none" stroke={`${color}12`} strokeWidth="4" />
          <motion.circle
            cx="48" cy="48" r={r}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${circ}`}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: 'easeOut', delay: 0.5 }}
            style={{ filter: `drop-shadow(0 0 5px ${color}60)` }}
          />
          {/* Rotating tick */}
          <motion.circle
            cx="48" cy="48" r="34"
            fill="none"
            stroke={`${color}20`}
            strokeWidth="1"
            strokeDasharray="2 12"
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="origin-center"
          />
        </svg>
        <div className="flex flex-col items-center z-10">
          <span className="text-xl font-black font-mono text-slate-900 dark:text-white leading-none">
            {count}%
          </span>
        </div>
      </div>
      <span className="text-[9px] font-mono tracking-[0.2em] text-slate-400 dark:text-zinc-500 uppercase">{label}</span>
    </div>
  );
}

export default function ArchetypeHero({ archetype, confidence, metrics, investmentCount }: ArchetypeHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const scrambledName = useScramble(archetype.name.toUpperCase(), 300);

  // Parallax tilt on the stat bar
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const tiltX = useSpring(useTransform(mouseY, [0, 1], [5, -5]), { stiffness: 80, damping: 20 });
  const tiltY = useSpring(useTransform(mouseX, [0, 1], [-5, 5]), { stiffness: 80, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  // Simple CSS mount-in (replaces GSAP — removes animation lib overhead)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, [archetype.id]);

  const totalVal = useCounter(Math.round(metrics.totalValue / 1000), 600, 1600);
  const riskScore = useCounter(Math.round(metrics.weightedRisk * 10), 700, 1200);

  return (
    <div ref={heroRef} className="relative w-full min-h-[100svh] flex flex-col items-center justify-center overflow-hidden">
      {/* Cursor-following ambient orb */}
      <MagneticOrb color={archetype.gradientFrom} />

      {/* Static ambient blobs */}
      <div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${archetype.gradientFrom}08 0%, transparent 70%)`,
          filter: 'blur(80px)',
          animation: 'float-blob-1 20s infinite ease-in-out',
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${archetype.gradientTo}06 0%, transparent 70%)`,
          filter: 'blur(60px)',
          animation: 'float-blob-2 24s infinite ease-in-out',
        }}
      />

      {/* Main vertical layout */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col gap-8 sm:gap-10 py-20 sm:py-24">

        {/* System ID Line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="hero-fade-up flex items-center gap-3"
        >
          <span
            className="h-px flex-1"
            style={{ background: `linear-gradient(90deg, ${archetype.gradientFrom}80, transparent)` }}
          />
          <span className="text-[10px] font-mono tracking-[0.3em] text-slate-400 dark:text-zinc-500 uppercase">
            INVESTOR ARCHETYPE ENGINE // CLASSIFICATION COMPLETE
          </span>
          <span
            className="h-px flex-1"
            style={{ background: `linear-gradient(270deg, ${archetype.gradientFrom}80, transparent)` }}
          />
        </motion.div>

        {/* Giant Scramble Title */}
        <div className="hero-fade-up flex flex-col gap-0 overflow-hidden">
          <div className="text-[9px] sm:text-[10px] font-mono tracking-[0.2em] sm:tracking-[0.25em] text-slate-400 dark:text-zinc-500 uppercase mb-2 sm:mb-3">
            Your Archetype Is
          </div>
          <div
            className="text-[13vw] sm:text-7xl lg:text-9xl font-black tracking-tighter leading-none overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${archetype.gradientFrom}, ${archetype.gradientTo})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {scrambledName}
          </div>
          <div className="text-[10px] font-mono tracking-[0.25em] text-slate-400 dark:text-zinc-500 uppercase mt-3 flex items-center gap-2">
            <motion.span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: archetype.gradientFrom }}
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            SERIAL ID: ARC-0{archetype.id.toUpperCase().slice(0, 3)} // {archetype.tagline.toUpperCase()}
          </div>
        </div>

        {/* Icon + Confidence + Traits row */}
        <motion.div
          className="hero-fade-up flex flex-col sm:flex-row flex-wrap items-start gap-5 sm:gap-8 pt-2"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Floating archetype glyph */}
          <motion.div
            animate={{ y: [-6, 6, -6] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative flex items-center justify-center w-20 h-20 rounded-3xl shrink-0"
            style={{
              background: `linear-gradient(135deg, ${archetype.gradientFrom}18, ${archetype.gradientTo}12)`,
              border: `1px solid ${archetype.gradientFrom}30`,
              boxShadow: `0 0 40px ${archetype.gradientFrom}20`,
            }}
          >
            <span className="text-4xl select-none">{archetype.icon}</span>
            {/* Animated border glow */}
            <motion.div
              className="absolute inset-0 rounded-3xl"
              style={{ border: `1px solid ${archetype.gradientFrom}` }}
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </motion.div>

          {/* Confidence ring */}
          <PrecisionRing value={confidence} color={archetype.gradientFrom} label="Match Confidence" />

          {/* Traits */}
          <div className="flex flex-col gap-2 justify-center flex-1 min-w-[160px]">
            <span className="text-[9px] font-mono tracking-[0.25em] text-slate-400 dark:text-zinc-500 uppercase mb-1">Core Signals</span>
            {archetype.traits.map((trait, i) => (
              <motion.div
                key={trait}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                className="flex items-center gap-2"
              >
                <motion.span
                  className="h-1 w-4 rounded-full"
                  style={{ backgroundColor: archetype.gradientFrom }}
                  animate={{ scaleX: [1, 1.5, 1] }}
                  transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                />
                <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-zinc-300 uppercase tracking-wider">
                  {trait}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Italic tagline quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="hero-fade-up relative pl-5 border-l-2"
          style={{ borderColor: archetype.gradientFrom }}
        >
          <p className="text-xl sm:text-2xl font-bold italic text-slate-700 dark:text-zinc-200 leading-snug">
            &ldquo;{archetype.tagline}&rdquo;
          </p>
        </motion.div>

        {/* Stats strip — monospace HUD readout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="hero-fade-up"
          style={{
            rotateX: tiltX,
            rotateY: tiltY,
            transformStyle: 'preserve-3d',
          } as any}
        >
          <div
            className="rounded-2xl p-4 sm:p-5 font-mono grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${archetype.gradientFrom}06, ${archetype.gradientTo}04)`,
              border: `1px solid ${archetype.gradientFrom}18`,
            }}
          >
            {/* Grid-line overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

            {[
              { label: 'TOTAL VALUE', value: `$${totalVal}K`, sub: 'Portfolio Size' },
              { label: 'RISK SCORE', value: `${riskScore}/100`, sub: 'Weighted Risk' },
              { label: 'HOLDINGS', value: `${investmentCount}`, sub: 'Active Positions' },
              { label: 'GROWTH %', value: `${Math.round(metrics.growthPct)}%`, sub: 'Growth Allocation' },
            ].map(({ label, value, sub }) => (
              <div key={label} className="flex flex-col gap-1 relative z-10">
                <span className="text-[8px] tracking-[0.25em] text-slate-400 dark:text-zinc-500 uppercase">{label}</span>
                <span className="text-xl font-black text-slate-900 dark:text-white" style={{ color: archetype.gradientFrom }}>{value}</span>
                <span className="text-[9px] text-slate-400 dark:text-zinc-600">{sub}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="flex items-center gap-3 hero-fade-up"
        >
          <span
            className="h-px flex-1 max-w-[60px]"
            style={{ background: `linear-gradient(90deg, ${archetype.gradientFrom}60, transparent)` }}
          />
          <motion.span
            className="text-[9px] font-mono tracking-[0.25em] text-slate-400 dark:text-zinc-500 uppercase"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            scroll to explore your story ↓
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
}
