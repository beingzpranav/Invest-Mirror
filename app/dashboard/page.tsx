'use client';

import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { useInView } from 'framer-motion';
import { usePortfolio } from '@/lib/PortfolioContext';
import {
  calculatePortfolioSummary,
  formatCurrency,
  getAssetAllocation,
  getRiskDistribution,
  getPortfolioHistory,
} from '@/lib/utils';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, Sparkles, Brain, Flame, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function useScramble(target: string, delay = 0) {
  const [display, setDisplay] = useState(target);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let step = 0;
      const totalSteps = 12; 
      const intervalMs = 35; 

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

// ─── Animated number counter ─────────────────────────────────────────────────
function useCounter(target: number, delay = 0, duration = 1000) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf: number;
    const countTimer = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(ease * target));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(countTimer); cancelAnimationFrame(raf); };
  }, [target, delay, duration]);
  return val;
}

function ChapterTitle({
  tag, line1, line2, color = '#5a8a3c',
}: { tag: string; line1: string; line2?: string; color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className="flex flex-col gap-1 mb-10">
      <div className="flex items-center gap-3" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        <span className="h-px w-8" style={{ background: '#9fe870' }} />
        <span className="text-xs font-mono tracking-[0.25em] uppercase" style={{ color: '#868685' }}>
          {tag}
        </span>
      </div>
      <div style={{ overflow: 'hidden' }}>
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter leading-none"
          style={{
            color: '#0e0f0c',
            transform: visible ? 'translateY(0)' : 'translateY(105%)',
            transition: 'transform 0.65s cubic-bezier(0.215,0.61,0.355,1) 0.1s',
          }}
        >
          {line1}
        </h2>
      </div>
      {line2 && (
        <div style={{ overflow: 'hidden' }}>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter leading-none"
            style={{
              color: color,
              transform: visible ? 'translateY(0)' : 'translateY(105%)',
              transition: 'transform 0.65s cubic-bezier(0.215,0.61,0.355,1) 0.18s',
            }}
          >
            {line2}
          </h2>
        </div>
      )}
    </div>
  );
}

function AnimBar({
  pct, color, delay = 0,
}: { pct: number; color: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, margin: '-40px' });

  return (
    <div ref={ref} className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: `${color}15` }}>
      <div
        className="h-full rounded-full"
        style={{
          width: visible ? `${pct}%` : '0%',
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}60`,
          transition: `width 1s cubic-bezier(0.215,0.61,0.355,1) ${delay}s`,
        }}
      />
    </div>
  );
}

type TF = '1D' | '1W' | '1M' | '1Y' | 'ALL';

const ChartTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const pos = d.gain >= 0;
  return (
    <div className="wise-card px-4 py-3 text-xs flex flex-col gap-1 shadow-lg" style={{ minWidth: 160 }}>
      <span className="font-mono text-xs tracking-widest uppercase" style={{ color: '#868685' }}>{d.date}</span>
      <span className="text-base font-black font-mono" style={{ color: '#0e0f0c' }}>{formatCurrency(d.value)}</span>
      <span className="font-bold font-mono text-xs" style={{ color: pos ? '#2ead4b' : '#d03238' }}>
        {pos ? '+' : ''}{formatCurrency(d.gain)}
      </span>
    </div>
  );
};

export default function DashboardPage() {
  const { investments, isLoggedIn } = usePortfolio();
  const router = useRouter();
  const [tf, setTf] = useState<TF>('1M');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoggedIn) {
      router.push('/');
    }
  }, [mounted, isLoggedIn, router]);

  const { totalValue, totalGain, gainPercent, weightedRiskScore } =
    useMemo(() => calculatePortfolioSummary(investments, 'default'), [investments]);

  const allocation = useMemo(() => getAssetAllocation(investments), [investments]);
  const riskDist = useMemo(() => getRiskDistribution(investments), [investments]);
  const chartData = useMemo(() => getPortfolioHistory(investments, tf), [investments, tf]);

  const isGain = totalGain >= 0;
  const chartColor = isGain ? '#2ead4b' : '#d03238';
  const title = useScramble('DASHBOARD', 200);

  const animValue = useCounter(Math.round(totalValue), 300, 1000);
  const animGain = useCounter(Math.abs(Math.round(gainPercent * 10) / 10), 400, 900);
  const animRisk = useCounter(Math.round(weightedRiskScore * 10) / 10, 500, 800);

  const divScore = useMemo(() => {
    const total = investments.reduce((s, i) => s + i.price * i.shares, 0);
    if (!total) return 0;
    const hhi = investments.reduce((s, i) => s + Math.pow((i.price * i.shares) / total, 2), 0);
    return Math.round((1 - hhi) * 100);
  }, [investments]);

  const TIMEFRAMES: TF[] = ['1D', '1W', '1M', '1Y', 'ALL'];

  if (!mounted || !isLoggedIn) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950">
        
        <div className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] rounded-full opacity-25 blur-[140px] animate-float-blob-1" style={{ willChange: 'transform', background: 'radial-gradient(circle, #9fe870, transparent 70%)' }} />
        <div className="text-center flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
          <span className="text-xs font-mono text-slate-500 dark:text-zinc-500">
            {!isLoggedIn ? 'Redirecting...' : 'Initializing Analyzer...'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      
      <div className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] rounded-full opacity-25 blur-[140px] animate-float-blob-1" style={{ willChange: 'transform', background: 'radial-gradient(circle, #9fe870, transparent 70%)' }} />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px] animate-float-blob-2" style={{ willChange: 'transform', background: 'radial-gradient(circle, #38c8ff, transparent 70%)' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">

        <section className="pt-24 pb-16 flex flex-col gap-6">
          
          <div className="flex items-center gap-3">
            <span className="h-px w-8" style={{ background: '#9fe870' }} />
            <span className="text-xs font-mono tracking-[0.25em] uppercase" style={{ color: '#868685' }}>
              Overview // Portfolio Dashboard
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-none" style={{ color: '#0e0f0c' }}>
            {title}
          </h1>

          <p className="text-sm max-w-sm leading-relaxed" style={{ color: '#454745' }}>
            Live behavioral insights and analytics for your investment portfolio.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              {
                label: 'TOTAL VALUE',
                value: formatCurrency(animValue),
                sub: `${investments.length} holdings`,
                accent: '#9fe870',
              },
              {
                label: 'NET P&L',
                value: `${isGain ? '+' : '-'}${formatCurrency(Math.abs(totalGain))}`,
                sub: 'Unrealised',
                accent: isGain ? '#2ead4b' : '#d03238',
                color: isGain ? '#2ead4b' : '#d03238',
              },
              {
                label: 'RETURNS',
                value: `${isGain ? '+' : ''}${animGain}%`,
                sub: 'Weighted avg.',
                accent: isGain ? '#2ead4b' : '#d03238',
                color: isGain ? '#2ead4b' : '#d03238',
              },
              {
                label: 'RISK SCORE',
                value: animRisk.toString(),
                sub: weightedRiskScore <= 3 ? 'Conservative' : weightedRiskScore <= 6 ? 'Moderate' : weightedRiskScore <= 8 ? 'Aggressive' : 'Speculative',
                accent: weightedRiskScore <= 3 ? '#2ead4b' : weightedRiskScore <= 6 ? '#38c8ff' : weightedRiskScore <= 8 ? '#f97316' : '#d03238',
              },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="flex flex-col gap-1 py-4 border-t-2"
                style={{ borderColor: kpi.accent }}
              >
                <span className="text-xs font-mono tracking-[0.2em] uppercase" style={{ color: '#868685' }}>
                  {kpi.label}
                </span>
                <span className="text-xl sm:text-2xl font-black font-mono tracking-tighter" style={{ color: kpi.color ?? '#0e0f0c' }}>
                  {kpi.value}
                </span>
                <span className="text-xs font-mono" style={{ color: '#868685' }}>
                  {kpi.sub}
                </span>
              </div>
            ))}
          </div>
        </section>

        {investments.length === 0 ? (
          <div className="mt-12 p-8 sm:p-12 rounded-[32px] border border-slate-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/40 backdrop-blur-md shadow-2xl text-center flex flex-col items-center gap-6 max-w-md mx-auto mb-20 relative overflow-hidden">
            
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
              <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                No assets/investments found
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2.5 leading-relaxed max-w-[280px] mx-auto">
                Your portfolio metrics and behavioral analyzer are offline. Add assets (like mutual funds, stocks, or crypto) to populate this dashboard and begin stress testing.
              </p>
            </div>

            <Link
              href="/explorer"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-zinc-950 text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#9fe870]/5 dark:shadow-black/20"
            >
              <Search size={12} strokeWidth={3} />
              Open Explorer to Add Assets
            </Link>
          </div>
        ) : (
          <>
            
            <div className="h-px w-full" style={{ background: 'rgba(14,15,12,0.08)' }} />

            <section className="py-16 sm:py-20">
              <ChapterTitle tag="Chapter 01 // Performance" line1="Portfolio" line2="Growth Curve" />

              <div className="flex items-center gap-1 mb-8 p-1 rounded-xl w-fit"
                style={{ background: '#e0e3de', border: '1px solid rgba(14,15,12,0.07)' }}>
                {TIMEFRAMES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTf(t)}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold font-mono transition-all duration-150 cursor-pointer"
                    style={tf === t
                      ? { background: '#ffffff', color: '#0e0f0c', boxShadow: '0 1px 4px rgba(14,15,12,0.08)' }
                      : { color: '#868685' }
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="h-[260px] sm:h-[320px] w-full min-w-0 relative">
                <ResponsiveContainer width="99.9%" height="100%" minWidth={0}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColor} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      stroke="#868685"
                      tick={{ fill: '#868685', fontSize: 10, fontWeight: 600 }}
                      tickLine={false}
                      axisLine={false}
                      dy={8}
                      interval={Math.max(0, Math.floor(chartData.length / 5) - 1)}
                      tickFormatter={(v: string) => {
                        const parts = v.split(' ');
                        return parts.length > 1 ? `${parts[0].slice(0, 3)} ${parts[1]}` : v;
                      }}
                    />
                    <YAxis
                      stroke="#868685"
                      tick={{ fill: '#868685', fontSize: 10, fontWeight: 600 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v: number) => `$${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
                      width={45}
                    />
                    <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(14,15,12,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Area type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2.5} fill="url(#chartGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            <div className="h-px w-full" style={{ background: 'rgba(14,15,12,0.08)' }} />

            <section className="py-16 sm:py-20">
              <ChapterTitle tag="Chapter 02 // Allocation" line1="Capital" line2="Distribution" />

              <div className="flex flex-col gap-5">
                {allocation.map((item, i) => {
                  const pct = item.percentage;
                  return (
                    <AllocRow key={item.name} item={item} pct={pct} index={i} />
                  );
                })}
              </div>
            </section>

            <div className="h-px w-full" style={{ background: 'rgba(14,15,12,0.08)' }} />

            <section className="py-16 sm:py-20">
              <ChapterTitle tag="Chapter 03 // Risk Profile" line1="Volatility" line2="Calibration" color="#f97316" />

              <div className="flex items-end gap-6 mb-10">
                <div>
                  <span className="text-xs font-mono tracking-[0.25em] uppercase block mb-1" style={{ color: '#868685' }}>
                    Weighted Risk Score
                  </span>
                  <span className="text-6xl sm:text-7xl font-black font-mono tracking-tighter" style={{ color: '#0e0f0c' }}>
                    {weightedRiskScore.toFixed(1)}
                    <span className="text-2xl font-mono ml-1" style={{ color: '#868685' }}>/10</span>
                  </span>
                </div>
                <div className="pb-2">
                  <span className="text-xs font-mono tracking-widest uppercase font-bold" style={{
                    color: weightedRiskScore <= 3 ? '#2ead4b' : weightedRiskScore <= 6 ? '#38c8ff' : weightedRiskScore <= 8 ? '#f97316' : '#d03238',
                  }}>
                    {weightedRiskScore <= 3 ? '// CONSERVATIVE' : weightedRiskScore <= 6 ? '// MODERATE' : weightedRiskScore <= 8 ? '// AGGRESSIVE' : '// SPECULATIVE'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                {riskDist.map((seg, i) => (
                  <RiskRow key={seg.name} seg={seg} index={i} />
                ))}
              </div>

              <div className="mt-12 flex flex-col sm:flex-row gap-8 sm:gap-16 pt-8" style={{ borderTop: '1px solid rgba(14,15,12,0.08)' }}>
                <div>
                  <span className="text-xs font-mono tracking-[0.25em] uppercase block mb-1" style={{ color: '#868685' }}>
                    Diversification Score
                  </span>
                  <span className="text-4xl font-black font-mono tracking-tighter" style={{ color: '#2ead4b' }}>
                    {divScore}
                    <span className="text-xl font-mono ml-1" style={{ color: '#868685' }}>/100</span>
                  </span>
                  <span className="text-xs font-mono block mt-1" style={{ color: divScore < 40 ? '#d03238' : divScore < 70 ? '#f97316' : '#2ead4b' }}>
                    {divScore < 40 ? '// HIGHLY CONCENTRATED' : divScore < 70 ? '// MODERATELY DIVERSIFIED' : '// WELL DIVERSIFIED'}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-mono tracking-[0.25em] uppercase block mb-1" style={{ color: '#868685' }}>
                    Holdings
                  </span>
                  <span className="text-4xl font-black font-mono tracking-tighter" style={{ color: '#0e0f0c' }}>
                    {investments.length}
                  </span>
                  <span className="text-xs font-mono block mt-1" style={{ color: '#868685' }}>
                    // ACTIVE POSITIONS
                  </span>
                </div>
              </div>
            </section>

            <div className="h-px w-full" style={{ background: 'rgba(14,15,12,0.08)' }} />

            <section className="py-16 sm:py-20">
              <ChapterTitle tag="Chapter 04 // Behavioral Analysis" line1="What Your Portfolio" line2="Says About You" color="#38c8ff" />
              <PortfolioStorySection investments={investments} allocation={allocation} weightedRiskScore={weightedRiskScore} totalValue={totalValue} divScore={divScore} />
            </section>

            <div className="h-px w-full" style={{ background: 'rgba(14,15,12,0.08)' }} />

            <section className="py-20 flex flex-col items-center text-center gap-6">
              <div className="flex items-center gap-3 justify-center">
                <span className="h-px w-8" style={{ background: '#9fe870' }} />
                <span className="text-xs font-mono tracking-[0.3em] uppercase" style={{ color: '#868685' }}>
                  Chapter 05 // Next Steps
                </span>
                <span className="h-px w-8" style={{ background: '#9fe870' }} />
              </div>

              <h2 className="text-3xl sm:text-4xl font-black tracking-tighter" style={{ color: '#0e0f0c' }}>
                Discover your archetype.
              </h2>
              <p className="text-sm max-w-sm" style={{ color: '#454745' }}>
                Your portfolio composition classifies you into one of 7 investor archetypes. Find out what your numbers say about you.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                <Link
                  href="/archetype"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-black transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-lg"
                  style={{ background: '#9fe870', color: '#0e0f0c' }}
                >
                  <Sparkles size={15} strokeWidth={2.5} />
                  Run Archetype Engine
                </Link>
                <Link
                  href="/crash-lab"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-black transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] cursor-pointer border-2"
                  style={{ borderColor: '#ef4444', color: '#ef4444', background: 'rgba(239,68,68,0.05)' }}
                >
                  <Flame size={15} strokeWidth={2.5} />
                  Enter Crash Lab
                </Link>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase pt-2" style={{ color: '#868685' }}>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                InvestMirror v1.0 
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Allocation row ───────────────────────────────────────────────────────────
function AllocRow({ item, pct, index }: { item: ReturnType<typeof getAssetAllocation>[0]; pct: number; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, margin: '-40px' });

  return (
    <div
      ref={ref}
      className="flex flex-col gap-2"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)', transition: `opacity 0.45s ease ${index * 0.06}s, transform 0.45s ease ${index * 0.06}s` }}
    >
      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-black" style={{ color: '#0e0f0c' }}>{item.name}</span>
          <span className="text-xs font-mono" style={{ color: '#868685' }}>{formatCurrency(item.value)}</span>
        </div>
        <span className="text-2xl font-black font-mono" style={{ color: item.color }}>
          {pct.toFixed(1)}%
        </span>
      </div>
      <AnimBar pct={pct} color={item.color} delay={0.2 + index * 0.06} />
      <div className="flex justify-between">
        <span className="text-xs font-mono" style={{ color: '#868685' }}>// ALLOCATION</span>
        <span className="text-xs font-mono" style={{ color: '#868685' }}>WEIGHT: {pct.toFixed(1)}%</span>
      </div>
    </div>
  );
}

// ─── Risk row ─────────────────────────────────────────────────────────────────
function RiskRow({ seg, index }: { seg: ReturnType<typeof getRiskDistribution>[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, margin: '-40px' });

  return (
    <div
      ref={ref}
      className="flex flex-col gap-2"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)', transition: `opacity 0.45s ease ${index * 0.08}s, transform 0.45s ease ${index * 0.08}s` }}
    >
      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-black" style={{ color: '#0e0f0c' }}>{seg.name}</span>
          <span className="text-xs font-mono" style={{ color: '#868685' }}>{formatCurrency(seg.value)}</span>
        </div>
        <span className="text-2xl font-black font-mono" style={{ color: seg.color }}>
          {seg.percentage.toFixed(1)}%
        </span>
      </div>
      <AnimBar pct={seg.percentage} color={seg.color} delay={0.2 + index * 0.08} />
      <span className="text-xs font-mono" style={{ color: '#868685' }}>// EXPOSURE BAND</span>
    </div>
  );
}

// ─── Portfolio Story Section ───────────────────────────────────────────────────
interface PortfolioInsight {
  tag: string;
  headline: string;
  detail: string;
  tone: 'warning' | 'praise' | 'neutral';
}

const TONE_STYLES: Record<string, { border: string; tagColor: string; dot: string }> = {
  warning: { border: '#ef4444', tagColor: '#ef4444', dot: '#ef4444' },
  praise:  { border: '#2ead4b', tagColor: '#2ead4b', dot: '#2ead4b' },
  neutral: { border: '#38c8ff', tagColor: '#38c8ff', dot: '#38c8ff' },
};

function InsightCard({ insight, index }: { insight: PortfolioInsight; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, margin: '-40px' });
  const styles = TONE_STYLES[insight.tone] ?? TONE_STYLES.neutral;

  return (
    <div
      ref={ref}
      className="flex gap-5 py-6"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`,
        borderBottom: '1px solid rgba(14,15,12,0.06)',
      }}
    >
      
      <div className="w-0.5 rounded-full shrink-0 self-stretch" style={{ background: styles.border }} />

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-mono tracking-[0.2em] uppercase font-bold"
            style={{ color: styles.tagColor }}
          >
            {insight.tag}
          </span>
        </div>
        <p className="text-base sm:text-lg font-black leading-tight" style={{ color: '#0e0f0c' }}>
          {insight.headline}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: '#868685' }}>
          {insight.detail}
        </p>
      </div>
    </div>
  );
}

function PortfolioStorySection({
  investments,
  allocation,
  weightedRiskScore,
  totalValue,
}: {
  investments: ReturnType<typeof usePortfolio>['investments'];
  allocation: ReturnType<typeof getAssetAllocation>;
  weightedRiskScore: number;
  totalValue: number;
  divScore: number;
}) {
  const [insights, setInsights] = useState<PortfolioInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<string | null>(null);

  const { totalGain, gainPercent } = useMemo(
    () => calculatePortfolioSummary(investments),
    [investments]
  );

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    try {
      
      const hhi = investments.reduce((sum, inv) => {
        const val = inv.price * inv.shares;
        const share = totalValue > 0 ? val / totalValue : 0;
        return sum + share * share;
      }, 0);

      const topHolding = allocation[0]
        ? { name: allocation[0].name, percentage: allocation[0].percentage }
        : null;

      const payload = {
        totalValue,
        totalGain,
        gainPercent,
        weightedRiskScore,
        hhi,
        holdingsCount: investments.length,
        allocation: allocation.map(a => ({ name: a.name, rawType: a.rawType, percentage: a.percentage })),
        topHolding,
      };

      const res = await fetch('/api/portfolio-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setInsights(data.insights ?? []);
      setSource(data.source);
    } catch {
      setInsights([]);
    } finally {
      setLoading(false);
    }
  }, [investments, allocation, weightedRiskScore, totalValue, totalGain, gainPercent]);

  useEffect(() => {
    if (investments.length > 0) {
      fetchInsights();
    } else {
      setLoading(false);
      setInsights([]);
    }
  }, [investments.length, fetchInsights]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-5 py-6" style={{ borderBottom: '1px solid rgba(14,15,12,0.06)', opacity: 1 - i * 0.15 }}>
            <div className="w-0.5 rounded-full shrink-0 self-stretch bg-slate-200 animate-pulse" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-2.5 w-24 rounded bg-slate-200 animate-pulse" />
              <div className="h-5 w-64 rounded bg-slate-200 animate-pulse" />
              <div className="h-3 w-full rounded bg-slate-100 animate-pulse" />
              <div className="h-3 w-4/5 rounded bg-slate-100 animate-pulse" />
            </div>
          </div>
        ))}
        <div className="flex items-center gap-2 mt-2">
          <Brain size={12} style={{ color: '#38c8ff' }} />
          <span className="text-xs font-mono tracking-widest uppercase" style={{ color: '#868685' }}>
            Analysing your portfolio...
          </span>
        </div>
      </div>
    );
  }

  if (insights.length === 0) return null;

  return (
    <div className="flex flex-col">
      {insights.map((insight, i) => (
        <InsightCard key={i} insight={insight} index={i} />
      ))}
      {source && (
        <div className="flex items-center gap-2 mt-4">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: (source === 'gemini' || source === 'groq') ? '#38c8ff' : source === 'quota_exhausted' ? '#f59e0b' : '#868685',
            }}
          />
          <span className="text-xs font-mono tracking-[0.05em] uppercase" style={{ color: '#868685' }}>
            {source === 'gemini'
              ? 'Powered by Gemini AI'
              : source === 'groq'
              ? 'Powered by Groq AI'
              : source === 'quota_exhausted'
              ? 'AI API Quota Exceeded (Free Tier) — Showing Rule-Based Fallback'
              : source === 'error'
              ? 'AI API Error — Showing Rule-Based Fallback'
              : 'Rule-based analysis — add GROQ_API_KEY or GEMINI_API_KEY for AI insights'}
          </span>
        </div>
      )}
    </div>
  );
}
