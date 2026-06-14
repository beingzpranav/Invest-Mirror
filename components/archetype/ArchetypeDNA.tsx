'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import type { InfluencingFactor, DimensionScore, ArchetypeId } from '@/lib/archetypeEngine';
import { ARCHETYPES } from '@/lib/archetypeEngine';

interface ArchetypeDNAProps {
  influencingFactors: InfluencingFactor[];
  dimensions: DimensionScore[];
  scores: Record<ArchetypeId, number>;
  archetypeId: ArchetypeId;
  archetypeColor: string;
}

// ─── Slide-in headline
function SectionTitle({
  tag,
  line1,
  line2,
  color,
  align = 'left',
}: {
  tag: string;
  line1: string;
  line2?: string;
  color: string;
  align?: 'left' | 'center';
}) {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, margin: '-80px' });
  const isCenter = align === 'center';

  return (
    <div ref={ref} className={`flex flex-col gap-3 mb-10 sm:mb-12 ${isCenter ? 'items-center text-center' : 'items-start'}`}>
      {/* Chapter tag */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
        className={`flex items-center gap-3 ${isCenter ? 'justify-center' : ''}`}
      >
        <span
          className="h-px w-10"
          style={{ background: `linear-gradient(90deg, ${color}80, transparent)` }}
        />
        <span className="text-[9px] font-mono tracking-[0.3em] text-slate-400 dark:text-zinc-500 uppercase">
          {tag}
        </span>
        <span
          className="h-px w-10"
          style={{ background: `linear-gradient(270deg, ${color}80, transparent)` }}
        />
      </motion.div>
      {/* Line 1 */}
      <div className="overflow-hidden">
        <motion.h2
          initial={{ y: '105%' }}
          animate={visible ? { y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1], delay: 0.1 }}
          className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-none"
        >
          {line1}
        </motion.h2>
      </div>
      {/* Line 2 */}
      {line2 && (
        <div className="overflow-hidden -mt-1">
          <motion.h2
            initial={{ y: '105%' }}
            animate={visible ? { y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1], delay: 0.18 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter leading-none"
            style={{
              background: `linear-gradient(135deg, ${color}, ${color}88)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {line2}
          </motion.h2>
        </div>
      )}
    </div>
  );
}

// ─── Kinetic factor row (full width, cinematic bar)
function FactorBlock({
  factor,
  color,
  index,
}: {
  factor: InfluencingFactor;
  color: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, margin: '-60px' });
  const pct = Math.round(factor.weight * 100);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group cursor-crosshair"
    >
      {/* Factor header */}
      <div className="flex items-end justify-between mb-2.5">
        <div className="flex flex-col gap-0.5">
          <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
            {factor.label}
          </span>
          <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
            {factor.description}
          </span>
        </div>
        <motion.span
          animate={hovered ? { scale: 1.08 } : { scale: 1 }}
          className="text-3xl sm:text-4xl font-black font-mono tabular-nums"
          style={{
            color,
            textShadow: hovered ? `0 0 20px ${color}60` : 'none',
            transition: 'text-shadow 0.3s',
          }}
        >
          {pct}
        </motion.span>
      </div>

      {/* Full-width animated bar */}
      <div
        className="relative h-1 w-full rounded-full overflow-hidden"
        style={{ backgroundColor: `${color}15` }}
      >
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}80` }}
          initial={{ width: '0%' }}
          animate={visible ? { width: `${pct}%` } : {}}
          transition={{ duration: 1.1, ease: 'easeOut', delay: 0.3 + index * 0.1 }}
        />
      </div>

      {/* Status label bottom */}
      <div className="flex justify-between mt-1.5">
        <span
          className="text-[9px] font-mono font-bold tracking-[0.2em] uppercase"
          style={{ color: `${color}80` }}
        >
          {factor.positive ? '// DRIVING FORCE' : '// RESTRICTING'}
        </span>
        <span className="text-[9px] font-mono text-slate-400 dark:text-zinc-600 tracking-widest">
          WEIGHT: {pct}%
        </span>
      </div>
    </motion.div>
  );
}

// ─── Dimension as a large slider
function DimensionSlider({
  dim,
  color,
  index,
}: {
  dim: DimensionScore;
  color: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, margin: '-60px' });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 20 }}
      animate={visible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col gap-2 group cursor-crosshair"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold text-slate-700 dark:text-zinc-200 tracking-widest uppercase">
          {dim.label}
        </span>
        <motion.span
          animate={hovered ? { color, textShadow: `0 0 12px ${color}80` } : { color: color, textShadow: 'none' }}
          transition={{ duration: 0.25 }}
          className="text-[11px] font-black font-mono"
        >
          [{dim.score} / 100]
        </motion.span>
      </div>

      {/* Track */}
      <div className="relative h-8 flex items-center">
        {/* Background track */}
        <div className="absolute inset-y-3 inset-x-0 rounded-full" style={{ backgroundColor: `${color}10` }}>
          {/* Tick marks */}
          <div className="absolute inset-0 flex justify-between px-0">
            {Array.from({ length: 21 }).map((_, i) => (
              <div
                key={i}
                className="w-px"
                style={{
                  height: i % 5 === 0 ? '8px' : '4px',
                  marginTop: i % 5 === 0 ? '2px' : '4px',
                  backgroundColor: `${color}20`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Fill */}
        <div
          className="absolute inset-y-3 left-0 rounded-full"
          style={{ backgroundColor: `${color}20`, width: '100%' }}
        />
        <motion.div
          className="absolute inset-y-3 left-0 rounded-full"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}50`,
          }}
          initial={{ width: 0 }}
          animate={visible ? { width: `${dim.score}%` } : {}}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 + index * 0.08 }}
        />

        {/* Indicator pin */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 z-10 pointer-events-none"
          style={{
            left: `${dim.score}%`,
            translateX: '-50%',
            backgroundColor: color,
            borderColor: 'var(--background)',
            boxShadow: hovered ? `0 0 16px ${color}` : `0 0 8px ${color}60`,
          } as any}
          initial={{ left: '0%' }}
          animate={visible ? { left: `${dim.score}%` } : {}}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 + index * 0.08 }}
        />
      </div>

      <p className="text-[10px] font-mono text-slate-450 dark:text-zinc-500">{dim.description}</p>
    </motion.div>
  );
}

// ─── Archetype affinity matrix as a horizontal stack
function AffinityMatrix({
  scores,
  topId,
  color,
}: {
  scores: Record<ArchetypeId, number>;
  topId: ArchetypeId;
  color: string;
}) {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, margin: '-80px' });
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const sorted = (Object.entries(scores) as [ArchetypeId, number][]).sort((a, b) => b[1] - a[1]);

  return (
    <div ref={ref} className="w-full">
      {sorted.map(([id, score], i) => {
        const arch = ARCHETYPES[id];
        const pct = total > 0 ? (score / total) * 100 : 0;
        const isTop = id === topId;

        return (
          <motion.div
            key={id}
            initial={{ opacity: 0, x: -20 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className={`flex items-center gap-4 py-3 border-b border-slate-200/15 dark:border-zinc-800/15 group transition-all duration-300 ${
              isTop ? 'opacity-100' : 'opacity-40 hover:opacity-90'
            }`}
          >
            {/* Icon + name */}
            <div className="flex items-center gap-3 w-40 shrink-0">
              <motion.span
                animate={isTop ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-xl w-7 text-center shrink-0"
              >
                {arch.icon}
              </motion.span>
              <div className="flex flex-col">
                <span
                  className="text-[11px] font-mono font-bold uppercase tracking-widest"
                  style={isTop ? { color: arch.color } : {}}
                >
                  {arch.name}
                </span>
                {isTop && (
                  <span
                    className="text-[8px] font-mono font-black tracking-widest"
                    style={{ color: arch.color }}
                  >
                    ▶ IDENTIFIED
                  </span>
                )}
              </div>
            </div>

            {/* Bar */}
            <div className="flex-1 relative h-1.5 rounded-full" style={{ backgroundColor: `${arch.color}15` }}>
              <motion.div
                className="absolute top-0 left-0 h-full rounded-full"
                style={{
                  backgroundColor: arch.color,
                  boxShadow: isTop ? `0 0 8px ${arch.color}80` : 'none',
                }}
                initial={{ width: 0 }}
                animate={visible ? { width: `${pct}%` } : {}}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 + i * 0.07 }}
              />
            </div>

            {/* Pct */}
            <span
              className="text-[11px] font-mono font-bold w-12 text-right shrink-0"
              style={isTop ? { color: arch.color } : { color: 'var(--foreground)', opacity: 0.4 }}
            >
              {pct.toFixed(0)}%
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function ArchetypeDNA({
  influencingFactors,
  dimensions,
  scores,
  archetypeId,
  archetypeColor,
}: ArchetypeDNAProps) {
  return (
    <div className="flex flex-col w-full">

      {/* ── Chapter 3: Classification Forces ─────────── */}
      <section className="relative py-20 sm:py-28 border-b border-slate-200/20 dark:border-zinc-800/20">
        {/* Ghost word watermark */}
        <div className="absolute top-12 right-0 text-[80px] sm:text-[120px] lg:text-[160px] font-black font-mono leading-none pointer-events-none select-none overflow-hidden hidden sm:block"
          style={{ color: `${archetypeColor}04`, WebkitTextStroke: `1px ${archetypeColor}08` }}
        >
          DNA
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <SectionTitle
            tag="Chapter 03 // Classification Forces"
            line1="What Tipped"
            line2="The Scale?"
            color={archetypeColor}
          />

          <p className="text-sm text-slate-500 dark:text-zinc-400 mb-10 max-w-lg">
            These are the specific portfolio characteristics that drove the engine to classify you as{' '}
            <strong className="text-slate-900 dark:text-white">{ARCHETYPES[archetypeId].name}</strong>.
          </p>

          <div className="flex flex-col gap-8">
            {influencingFactors.map((factor, i) => (
              <FactorBlock key={factor.label} factor={factor} color={archetypeColor} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Chapter 4: Dimensions ─────────────────────── */}
      <section className="relative py-20 sm:py-28 border-b border-slate-200/20 dark:border-zinc-800/20">
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <SectionTitle
            tag="Chapter 04 // Investing Dimensions"
            line1="Your Behavioral"
            line2="Calibration Map"
            color={archetypeColor}
          />

          <p className="text-sm text-slate-500 dark:text-zinc-400 mb-10 max-w-lg">
            Five calibrated axes that map your investing instincts across behavioral finance dimensions.
          </p>

          <div className="flex flex-col gap-8">
            {dimensions.map((dim, i) => (
              <DimensionSlider key={dim.label} dim={dim} color={archetypeColor} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Chapter 5: Affinity Matrix ────────────────── */}
      <section className="relative py-16 sm:py-20 border-b border-slate-200/20 dark:border-zinc-800/20">
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <SectionTitle
            tag="Chapter 05 // Class Affinity Matrix"
            line1="How You Fit"
            line2="Every Archetype"
            color={archetypeColor}
          />

          <p className="text-sm text-slate-500 dark:text-zinc-400 mb-10 max-w-lg">
            Every portfolio holds traces of all archetypes. This is your full affinity spread across all 7 classes in the engine.
          </p>

          <AffinityMatrix scores={scores} topId={archetypeId} color={archetypeColor} />
        </div>
      </section>
    </div>
  );
}
