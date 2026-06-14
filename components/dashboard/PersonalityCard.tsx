'use client';

import { useState } from 'react';
import Card from '../ui/Card';
import { PersonalityArchetype } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, X, CheckCircle2, AlertTriangle, ShieldAlert, Award, Compass } from 'lucide-react';

interface PersonalityCardProps {
  personality: PersonalityArchetype;
}

export default function PersonalityCard({ personality }: PersonalityCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Radar Chart calculation constants
  const size = 280;
  const center = size / 2;
  const maxRadius = 90;
  const axes = [
    { label: 'Risk Tolerance', key: 'risk' },
    { label: 'Growth Focus', key: 'growth' },
    { label: 'Diversification', key: 'diversification' },
    { label: 'Discipline', key: 'discipline' },
    { label: 'Market Activity', key: 'activity' }
  ] as const;

  // Helper to calculate coordinates
  const getCoordinates = (index: number, val: number) => {
    // Offset angle to start at top (vertical 12 o'clock is -90 degrees)
    const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2;
    const radius = (val / 10) * maxRadius;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y };
  };

  // Concentric grids levels (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [2, 4, 6, 8, 10];

  // Compile points for user traits
  const traitPoints = axes
    .map((axis, i) => {
      const val = personality.traits[axis.key];
      const { x, y } = getCoordinates(i, val);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <>
      <Card className="flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 dark:bg-purple-500/10 text-indigo-600 dark:text-purple-400 flex items-center justify-center">
              <BrainCircuit size={16} />
            </div>
            <h2 className="text-sm font-bold tracking-wider uppercase text-slate-500 dark:text-zinc-400">
              Investing Personality
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:bg-purple-500/10 dark:text-purple-400 border border-indigo-500/20 dark:border-purple-500/20">
            {personality.badge}
          </span>
        </div>

        {/* Archetype Showcase */}
        <div className="flex flex-col items-center text-center mt-2">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2 text-gradient-primary">
            {personality.name}
          </h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed max-w-sm mb-4">
            {personality.description}
          </p>
        </div>

        {/* Custom SVG Radar Chart — fully responsive */}
        <div className="relative flex justify-center items-center my-4 w-full">
          <svg viewBox="0 0 280 280" className="w-full max-w-[280px] h-auto overflow-visible select-none">
            {/* Definitions for gradients and shadows */}
            <defs>
              <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
              </radialGradient>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#6366f1" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* Concentric grid lines (Pentagons) */}
            {gridLevels.map((lvl) => {
              const gridPoints = axes
                .map((_, i) => {
                  const { x, y } = getCoordinates(i, lvl);
                  return `${x},${y}`;
                })
                .join(' ');
              return (
                <polygon
                  key={lvl}
                  points={gridPoints}
                  fill="none"
                  stroke="currentColor"
                  className="text-slate-300/40 dark:text-zinc-800/40"
                  strokeWidth="1"
                />
              );
            })}

            {/* Axes lines (spokes) */}
            {axes.map((_, i) => {
              const { x, y } = getCoordinates(i, 10);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="currentColor"
                  className="text-slate-300/40 dark:text-zinc-800/40"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Glowing filled user polygon */}
            <polygon
              points={traitPoints}
              fill="url(#radarGlow)"
              stroke="#8b5cf6"
              strokeWidth="2.5"
              filter="url(#shadow)"
              className="transition-all duration-700 ease-out"
            />

            {/* Interactive Data points (Vertices) */}
            {axes.map((axis, i) => {
              const val = personality.traits[axis.key];
              const { x, y } = getCoordinates(i, val);
              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r="5"
                    fill="#a855f7"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="cursor-pointer transition-all duration-300 hover:scale-150 shadow-md"
                  />
                  {/* Labels at outer boundaries */}
                  {(() => {
                    const labelPos = getCoordinates(i, 12.5);
                    const isLeft = labelPos.x < center - 10;
                    const isRight = labelPos.x > center + 10;
                    const textAnchor = isLeft ? 'end' : isRight ? 'start' : 'middle';
                    return (
                      <text
                        x={labelPos.x}
                        y={labelPos.y + 4}
                        textAnchor={textAnchor}
                        fontSize="10"
                        fontWeight="700"
                        className="fill-slate-600 dark:fill-zinc-400 uppercase tracking-wider"
                      >
                        {axis.label}
                      </text>
                    );
                  })()}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Behavioral Bias Flag */}
        <div className="mt-auto pt-4 border-t border-slate-200/50 dark:border-zinc-800/40 flex flex-col gap-3">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/15">
            <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={15} />
            <div>
              <h4 className="text-xs font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                Behavioral Bias: {personality.bias}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-amber-200/70 leading-relaxed mt-0.5">
                {personality.biasDescription.slice(0, 100)}...
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center text-white bg-linear-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-500/10 cursor-pointer"
          >
            Deep Dive Behavioral Profile
          </button>
        </div>
      </Card>

      {/* Extended Profile Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 rounded-3xl overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-2xl z-10 p-6 md:p-8"
            >
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col gap-6">
                {/* Heading */}
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 dark:bg-purple-500/10 text-indigo-600 dark:text-purple-400 flex items-center justify-center">
                    <Compass size={24} className="stroke-[2]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-indigo-600 dark:text-purple-400 uppercase tracking-wider">
                      INVESTOR REFLECTION
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                      {personality.name}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                  {personality.description}
                </p>

                {/* Grid Lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Strengths */}
                  <div className="p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-2 mb-3">
                      <Award size={14} /> Cognitive Strengths
                    </h4>
                    <ul className="flex flex-col gap-2.5">
                      {personality.strengths.map((str, i) => (
                        <li key={i} className="text-xs text-slate-600 dark:text-emerald-100/80 flex items-start gap-2">
                          <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="p-5 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/15">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-rose-800 dark:text-rose-400 flex items-center gap-2 mb-3">
                      <ShieldAlert size={14} /> Behavioral Risks
                    </h4>
                    <ul className="flex flex-col gap-2.5">
                      {personality.weaknesses.map((weak, i) => (
                        <li key={i} className="text-xs text-slate-600 dark:text-rose-100/80 flex items-start gap-2">
                          <X size={13} className="text-rose-500 shrink-0 mt-0.5" />
                          <span>{weak}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bias Deep Dive */}
                <div className="p-5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/15">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-2 mb-1.5">
                    <AlertTriangle size={14} /> Primary Psychological Trap: {personality.bias}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-amber-100/80 leading-relaxed">
                    {personality.biasDescription}
                  </p>
                </div>

                {/* Actionable recommendations */}
                <div className="p-5 rounded-2xl bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/15">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-sky-800 dark:text-sky-400 flex items-center gap-2 mb-1.5">
                    💡 Portfolio Balancing Strategy
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-sky-100/80 leading-relaxed font-medium">
                    {personality.recommendation}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
