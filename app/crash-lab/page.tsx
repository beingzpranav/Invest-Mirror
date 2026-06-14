'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useInView } from 'framer-motion';
import { usePortfolio } from '@/lib/PortfolioContext';
import { getAssetAllocation, calculatePortfolioSummary, formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft, Zap, TrendingDown, Clock, Shield, Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

const CRASH_DATA = {
  gfc: {
    id: 'gfc',
    name: '2008 Global Financial Crisis',
    shortName: 'GFC 2008',
    period: 'Oct 2007 – Mar 2009',
    description: 'The collapse of Lehman Brothers triggered the worst financial crisis since the Great Depression. Global credit markets froze. Equity markets dropped by half.',
    recoveryMonths: 54,
    recoveryYear: '2013',
    coefficients: {
      equity: -0.52,
      mutual_fund: -0.38,
      crypto: 0,
      real_estate: -0.42,
      commodities: +0.25,
      fixed_income: +0.08,
      cash: 0,
    },
    color: '#ef4444',
    accentGlow: 'rgba(239,68,68,0.12)',
  },
  covid: {
    id: 'covid',
    name: 'COVID-19 Crash',
    shortName: 'COVID 2020',
    period: 'Feb 20 – Mar 23, 2020',
    description: 'The fastest market crash in history — 33 days from peak to trough. Pandemic fear drove panic selling across all asset classes except safe havens.',
    recoveryMonths: 8,
    recoveryYear: 'Nov 2020',
    coefficients: {
      equity: -0.35,
      mutual_fund: -0.22,
      crypto: -0.50,
      real_estate: -0.18,
      commodities: +0.12,
      fixed_income: +0.06,
      cash: 0,
    },
    color: '#f97316',
    accentGlow: 'rgba(249,115,22,0.12)',
  },
  rates: {
    id: 'rates',
    name: '2022 Rate Hike Selloff',
    shortName: 'Rate Hike 2022',
    period: 'Jan – Dec 2022',
    description: 'The Federal Reserve raised rates 7 times in a single year. Growth assets cratered. Crypto collapsed. Even bonds lost value — nowhere to hide.',
    recoveryMonths: 18,
    recoveryYear: 'Mid 2024',
    coefficients: {
      equity: -0.25,
      mutual_fund: -0.15,
      crypto: -0.65,
      real_estate: -0.20,
      commodities: +0.05,
      fixed_income: -0.12,
      cash: +0.02,
    },
    color: '#a855f7',
    accentGlow: 'rgba(168,85,247,0.12)',
  },
} as const;

type ScenarioId = keyof typeof CRASH_DATA;

function ImpactBar({ pct, isLoss, delay = 0 }: { pct: number; isLoss: boolean; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true });
  const width = Math.min(Math.abs(pct), 100);

  return (
    <div ref={ref} className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(14,15,12,0.06)' }}>
      <div
        className="h-full rounded-full transition-all"
        style={{
          width: visible ? `${width}%` : '0%',
          backgroundColor: isLoss ? '#ef4444' : '#2ead4b',
          boxShadow: isLoss ? '0 0 6px rgba(239,68,68,0.4)' : '0 0 6px rgba(46,173,75,0.4)',
          transition: `width 1.1s cubic-bezier(0.215,0.61,0.355,1) ${delay}s`,
        }}
      />
    </div>
  );
}

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

// ── SVG Curve points for the 5-step simulator ─────────────────────────────────
const SIM_POINTS = [
  { x: 10, y: 20 },
  { x: 130, y: 45 },
  { x: 250, y: 70 }, // Trough
  { x: 370, y: 35 },
  { x: 490, y: 15 }  // Recovery
];

export default function CrashLabPage() {
  const { investments, isLoggedIn } = usePortfolio();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeScenario, setActiveScenario] = useState<ScenarioId>('covid');
  const [prevScenario, setPrevScenario] = useState<ScenarioId>('covid');
  const [animating, setAnimating] = useState(false);
  
  // Simulator states
  const [simState, setSimState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [simStep, setSimStep] = useState(0);

  const title = useScramble('CRASH LAB', 300);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoggedIn) {
      router.push('/');
    }
  }, [mounted, isLoggedIn, router]);

  const scenario = CRASH_DATA[activeScenario];

  const { totalValue } = useMemo(
    () => calculatePortfolioSummary(investments),
    [investments]
  );
  const allocation = useMemo(() => getAssetAllocation(investments), [investments]);

  // Compute static peak crash details
  const impactRows = useMemo(() => {
    return allocation.map(item => {
      const coeff = scenario.coefficients[item.rawType as keyof typeof scenario.coefficients] ?? 0;
      const impactValue = item.value * coeff;
      const impactPct = coeff * 100;
      return {
        ...item,
        coeff,
        impactValue,
        impactPct,
        isLoss: coeff < 0,
      };
    });
  }, [allocation, scenario]);

  const totalImpact = useMemo(
    () => impactRows.reduce((sum, r) => sum + r.impactValue, 0),
    [impactRows]
  );
  const portfolioAtBottom = totalValue + totalImpact;
  const totalDropPct = totalValue > 0 ? (totalImpact / totalValue) * 100 : 0;

  const pureEquityDrop = scenario.coefficients.equity * 100;

  // Simulator timelines
  const simTimeline = useMemo(() => {
    const topHoldingName = allocation[0]?.name ?? 'your top holdings';
    const topHoldingPct = allocation[0]?.percentage ?? 0;
    const topHoldingValue = allocation[0]?.value ?? 0;
    const topHoldingLossValue = topHoldingValue * Math.abs(scenario.coefficients.equity);

    const safeAsset = allocation.find(a => a.rawType === 'commodities' || a.rawType === 'fixed_income');
    const safeAssetDetail = safeAsset
      ? `your ${safeAsset.percentage.toFixed(1)}% stake in ${safeAsset.name}`
      : 'having safe assets like Gold or Bonds';

    if (activeScenario === 'covid') {
      return [
        {
          label: 'Stage 1: Outbreak',
          date: 'January 2020',
          multiplier: 1.0,
          description: `Markets are cruising at all-time highs. Your portfolio is valued at a pristine ${formatCurrency(totalValue)}. Reports of a new respiratory virus in Wuhan make headlines, but investors dismiss it as a localized issue. Greed remains high.`,
        },
        {
          label: 'Stage 2: Lockdown Shock',
          date: 'February 2020',
          multiplier: 0.93,
          description: `Italy locks down. Borders slam shut. Supply chains freeze overnight. Equities record their fastest correction in market history. Your portfolio sheds 7%, slipping to ${formatCurrency(totalValue * 0.93)}. Volatility spikes, and uncertainty grips the world.`,
        },
        {
          label: 'Stage 3: Liquidity Bottom',
          date: 'March 23, 2020',
          multiplier: 1 + (totalDropPct / 100),
          description: `Total market panic. Investors sell absolutely everything, including gold and treasury bonds, just to raise cash. Your portfolio bottoms out here at ${formatCurrency(portfolioAtBottom)}, suffering a drawdown of ${Math.abs(totalDropPct).toFixed(1)}% (${formatCurrency(Math.abs(totalImpact))} vaporized). Your ${topHoldingName} takes a severe hit, dropping by 35% and losing ${formatCurrency(topHoldingLossValue)} of its peak value. The psychological urge to exit the market is overwhelming.`,
        },
        {
          label: 'Stage 4: Fed Intervention',
          date: 'June 2020',
          multiplier: 1 + ((totalDropPct * 0.45) / 100),
          description: `The Federal Reserve deploys its credit bazooka, cutting rates to zero and starting massive quantitative easing. Technology and work-from-home stocks launch into a hyper-rally. Your portfolio claws its way back to ${formatCurrency(totalValue + totalImpact * 0.45)} (-${Math.abs(totalDropPct * 0.45).toFixed(1)}% from peak), thanks to ${safeAssetDetail} providing support.`,
        },
        {
          label: 'Stage 5: Full Recovery',
          date: 'November 2020',
          multiplier: 1.02,
          description: `Pfizer announces a highly effective vaccine. A massive pro-cyclical value rotation begins. Markets reclaim and exceed pre-crash highs. Your portfolio has fully recovered to ${formatCurrency(totalValue * 1.02)}, taking just 8 months to break even. Investors who stood firm and did not sell are vindicated.`,
        }
      ];
    } else if (activeScenario === 'gfc') {
      return [
        {
          label: 'Stage 1: Subprime Cracks',
          date: 'October 2007',
          multiplier: 1.0,
          description: `Global markets hit record highs. Your portfolio begins at a robust ${formatCurrency(totalValue)}. Subprime mortgage defaults are rising, but central banks assure the public that the housing downturn is 'contained'.`,
        },
        {
          label: 'Stage 2: Lehman Insolvency',
          date: 'September 2008',
          multiplier: 0.78,
          description: `Lehman Brothers files for bankruptcy. The global credit system freezes. No bank trusts another. Equities tank by 20% in weeks. Your portfolio drops to ${formatCurrency(totalValue * 0.78)}. Financial apocalypse is on the nightly news every single day.`,
        },
        {
          label: 'Stage 3: The Great Abyss',
          date: 'March 2009',
          multiplier: 1 + (totalDropPct / 100),
          description: `The trough of a 17-month grueling decline. Equities are cut in half. Your portfolio bottoms at ${formatCurrency(portfolioAtBottom)}, down ${Math.abs(totalDropPct).toFixed(1)}% from the peak. Your largest position, ${topHoldingName}, loses 52% of its value, a staggering drop of ${formatCurrency(topHoldingValue * 0.52)}. Only Commodities/Gold protect you, climbing 25% to cushion the crash. The slow, bleeding decline makes this crash a massive test of endurance.`,
        },
        {
          label: 'Stage 4: Slow Grind',
          date: 'December 2011',
          multiplier: 1 + ((totalDropPct * 0.35) / 100),
          description: `QE2 is underway. Economic growth is sluggish, and Europe experiences a sovereign debt crisis. Your portfolio slowly crawls up to ${formatCurrency(totalValue + totalImpact * 0.35)} (-${Math.abs(totalDropPct * 0.35).toFixed(1)}%). The recovery is slow, grueling, and filled with false starts.`,
        },
        {
          label: 'Stage 5: Breakeven Point',
          date: 'March 2013',
          multiplier: 1.01,
          description: `After 54 grueling months — 4.5 years of negative returns — global markets and your portfolio finally break even at ${formatCurrency(totalValue * 1.01)}. A textbook lesson in why the time horizon of your investments must match your asset risk.`,
        }
      ];
    } else { // rates
      return [
        {
          label: 'Stage 1: Post-Stimulus Bubble',
          date: 'January 2022',
          multiplier: 1.0,
          description: `Markets are coming off a massive stimulative bull run. Your portfolio sits at a peak of ${formatCurrency(totalValue)}. However, consumer inflation is printing 40-year highs, forcing the Fed to prepare a series of aggressive interest rate hikes.`,
        },
        {
          label: 'Stage 2: Interest Rate Shock',
          date: 'June 2022',
          multiplier: 0.88,
          description: `The Fed delivers multiple 75bps rate hikes. Growth stocks and high-multiple equities crater. Crucially, bonds drop (-12%) alongside equities, leaving standard balanced portfolios with nowhere to hide. Your portfolio falls to ${formatCurrency(totalValue * 0.88)}.`,
        },
        {
          label: 'Stage 3: Peak Tightening & FTX Collapse',
          date: 'October 2022',
          multiplier: 1 + (totalDropPct / 100),
          description: `Inflation hits 9.1%. Global yield curves invert. Crypto exchange FTX collapses, driving a deep crypto winter. Your portfolio bottoms out here at ${formatCurrency(portfolioAtBottom)}, down ${Math.abs(totalDropPct).toFixed(1)}%. If you had crypto, it crashed by 65%. Even safe-haven fixed income is in the red. Cash and Commodities are the only assets keeping you afloat.`,
        },
        {
          label: 'Stage 4: Inflation Cools',
          date: 'December 2023',
          multiplier: 1 + ((totalDropPct * 0.15) / 100),
          description: `CPI inflation drops to 3.1%. The Federal Reserve hints at a pivot and future rate cuts. Tech stocks trigger a monumental rally. Your portfolio recovers to ${formatCurrency(totalValue + totalImpact * 0.15)} (-${Math.abs(totalDropPct * 0.15).toFixed(1)}%).`,
        },
        {
          label: 'Stage 5: New All-Time Highs',
          date: 'June 2024',
          multiplier: 1.03,
          description: `S&P 500 sets new highs. The tech sector thrives. Your portfolio completes its full recovery to ${formatCurrency(totalValue * 1.03)} after 18 months of volatility. Diversified investors who did not liquidate their bond and equity allocations come out on top.`,
        }
      ];
    }
  }, [activeScenario, totalDropPct, portfolioAtBottom, totalValue, totalImpact, scenario, allocation]);

  const currentSimStep = simTimeline[simStep] ?? simTimeline[0];
  const simValue = totalValue * currentSimStep.multiplier;
  const simDrawdown = (1 - currentSimStep.multiplier) * 100;

  // Simulator playback logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (simState === 'playing') {
      timer = setInterval(() => {
        setSimStep(prev => {
          if (prev >= simTimeline.length - 1) {
            setSimState('idle');
            return prev;
          }
          return prev + 1;
        });
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [simState, simTimeline.length]);

  useEffect(() => {
    setSimState('idle');
    setSimStep(0);
  }, [activeScenario]);

  function switchScenario(id: ScenarioId) {
    if (id === activeScenario || animating) return;
    setPrevScenario(activeScenario);
    setAnimating(true);
    setTimeout(() => {
      setActiveScenario(id);
      setSimStep(0);
      setAnimating(false);
    }, 180);
  }

  const scenarioKeys = Object.keys(CRASH_DATA) as ScenarioId[];

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

  if (investments.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4 bg-slate-50 dark:bg-zinc-950">
        <div className="max-w-md mx-auto p-8 sm:p-10 rounded-[32px] bg-white/80 dark:bg-zinc-900/40 border border-slate-200/60 dark:border-zinc-800/60 backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col items-center gap-6">
          
          <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-red-500/10 blur-xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-orange-500/10 blur-xl pointer-events-none" />

          <div className="relative flex items-center justify-center w-20 h-20 mb-1">
            <div className="absolute inset-0 rounded-full bg-red-500/10 dark:bg-red-500/5 animate-ping" />
            <div className="absolute w-14 h-14 rounded-full bg-red-500/20 dark:bg-red-500/10 animate-pulse" />
            <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-red-500 text-white shadow-lg shadow-red-500/20">
              <Zap size={20} strokeWidth={2.5} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Crash Lab Offline</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed max-w-[280px] mx-auto">
              You need to add some assets to your portfolio before you can simulate stress tests and historical market crashes.
            </p>
          </div>

          <Link
            href="/explorer"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-zinc-950 text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-500/5 dark:shadow-black/20"
          >
            Go to Explorer
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      
      <div
        className="pointer-events-none fixed top-0 left-0 w-[700px] h-[700px] rounded-full opacity-35 blur-[160px]"
        style={{ background: `radial-gradient(circle, ${scenario.color}, transparent 70%)`, transition: 'background 0.6s ease' }}
      />
      <div
        className="pointer-events-none fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-20 blur-[120px]"
        style={{ background: `radial-gradient(circle, ${scenario.color}, transparent 70%)`, transition: 'background 0.6s ease' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">

        <div className="pt-8 pb-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase transition-opacity hover:opacity-60"
            style={{ color: '#868685' }}
          >
            <ArrowLeft size={12} />
            Back to Dashboard
          </Link>
        </div>

        <section className="pt-10 pb-10 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-8" style={{ background: scenario.color }} />
            <span className="text-xs font-mono tracking-[0.25em] uppercase" style={{ color: '#868685' }}>
              Stress Test // Market Simulator
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-none" style={{ color: '#0e0f0c' }}>
            {title}
          </h1>

          <p className="text-sm max-w-md leading-relaxed" style={{ color: '#454745' }}>
            Three market apocalypses. Run the interactive simulation below to watch week-by-week how your actual asset allocation would have responded under fire.
          </p>
        </section>

        <div className="h-px w-full" style={{ background: 'rgba(14,15,12,0.08)' }} />

        <section className="py-8">
          <div className="flex flex-col sm:flex-row gap-3">
            {scenarioKeys.map(key => {
              const s = CRASH_DATA[key];
              const isActive = key === activeScenario;
              return (
                <button
                  key={key}
                  onClick={() => switchScenario(key)}
                  className="flex-1 text-left p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer"
                  style={{
                    borderColor: isActive ? s.color : 'rgba(14,15,12,0.08)',
                    background: isActive ? s.accentGlow : 'rgba(255,255,255,0.4)',
                    transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                    boxShadow: isActive ? `0 8px 32px ${s.accentGlow}` : 'none',
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: s.color }} />
                    <span className="text-xs font-mono tracking-widest uppercase" style={{ color: isActive ? s.color : '#868685' }}>
                      {s.period}
                    </span>
                  </div>
                  <span className="text-sm font-black" style={{ color: '#0e0f0c' }}>{s.shortName}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="pb-12">
          <div
            className="p-6 sm:p-8 rounded-3xl border-2 relative overflow-hidden flex flex-col gap-6"
            style={{
              borderColor: `${scenario.color}25`,
              background: '#fcfdfc',
              boxShadow: `0 12px 40px ${scenario.accentGlow}`,
            }}
          >
            
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'rgba(14,15,12,0.06)' }}>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-mono tracking-widest uppercase font-bold" style={{ color: scenario.color }}>
                  {simState === 'playing' ? 'SIMULATION IN PROGRESS' : simState === 'paused' ? 'SIMULATION PAUSED' : 'READY TO SIMULATE'}
                </span>
              </div>
              <span className="text-xs font-mono tracking-widest uppercase" style={{ color: '#868685' }}>
                STAGE {simStep + 1} OF 5
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <span className="text-xs font-mono tracking-widest uppercase" style={{ color: '#868685' }}>Timeline Date</span>
                <span className="text-2xl font-black font-mono tracking-tight" style={{ color: '#0e0f0c' }}>
                  {currentSimStep.date}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs font-mono tracking-widest uppercase" style={{ color: '#868685' }}>Simulated Value</span>
                <span
                  className="text-2xl font-black font-mono tracking-tight transition-all duration-300"
                  style={{ color: simValue < totalValue ? '#ef4444' : simValue > totalValue ? '#2ead4b' : '#0e0f0c' }}
                >
                  {formatCurrency(simValue)}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs font-mono tracking-widest uppercase" style={{ color: '#868685' }}>Current Drawdown</span>
                <span
                  className="text-2xl font-black font-mono tracking-tight transition-all duration-300"
                  style={{ color: simDrawdown > 0 ? '#ef4444' : simDrawdown < 0 ? '#2ead4b' : '#0e0f0c' }}
                >
                  {simDrawdown > 0 ? '-' : simDrawdown < 0 ? '+' : ''}
                  {Math.abs(simDrawdown).toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="relative w-full py-4">
              <svg viewBox="0 0 500 80" className="w-full h-20 overflow-visible">
                
                <path
                  d="M 10 20 C 100 20, 180 75, 250 70 C 320 65, 400 15, 490 15"
                  fill="none"
                  stroke="rgba(14,15,12,0.06)"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />

                <path
                  d="M 10 20 C 100 20, 180 75, 250 70 C 320 65, 400 15, 490 15"
                  fill="none"
                  stroke={scenario.color}
                  strokeWidth="3.5"
                  strokeDasharray="500"
                  strokeDashoffset={500 - (simStep / 4) * 500}
                  className="transition-all duration-700 ease-in-out"
                />

                {SIM_POINTS.map((pt, i) => {
                  const isActive = i === simStep;
                  const isPassed = i < simStep;
                  return (
                    <g key={i} className="cursor-pointer" onClick={() => setSimStep(i)}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isActive ? 8 : 4.5}
                        fill={isActive ? '#ffffff' : isPassed ? scenario.color : '#e0e3de'}
                        stroke={scenario.color}
                        strokeWidth={isActive ? 3.5 : 1}
                        className="transition-all duration-300"
                      />
                      {isActive && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={14}
                          fill="none"
                          stroke={scenario.color}
                          strokeWidth="1.5"
                          className="animate-ping opacity-60"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="p-5 rounded-2xl border flex flex-col gap-2 relative min-h-[120px]" style={{ background: '#f5f7f4', borderColor: 'rgba(14,15,12,0.06)' }}>
              <span className="text-xs font-mono tracking-widest uppercase font-bold" style={{ color: scenario.color }}>
                {currentSimStep.label}
              </span>
              <p className="text-sm leading-relaxed font-serif italic" style={{ color: '#0e0f0c' }}>
                &ldquo;{currentSimStep.description}&rdquo;
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4" style={{ borderColor: 'rgba(14,15,12,0.06)' }}>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSimStep(prev => Math.max(0, prev - 1))}
                  disabled={simStep === 0}
                  className="p-2.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 disabled:opacity-40 cursor-pointer transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>

                {simState === 'playing' ? (
                  <button
                    onClick={() => setSimState('paused')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 cursor-pointer transition-all font-mono font-bold text-xs"
                    style={{ borderColor: scenario.color, color: scenario.color, background: `${scenario.color}10` }}
                  >
                    <Pause size={14} />
                    PAUSE
                  </button>
                ) : (
                  <button
                    onClick={() => setSimState('playing')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl cursor-pointer transition-all font-mono font-bold text-xs text-white"
                    style={{ background: scenario.color }}
                  >
                    <Play size={14} fill="currentColor" />
                    PLAY CRASH SIMULATION
                  </button>
                )}

                <button
                  onClick={() => setSimStep(prev => Math.min(simTimeline.length - 1, prev + 1))}
                  disabled={simStep === simTimeline.length - 1}
                  className="p-2.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 disabled:opacity-40 cursor-pointer transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <button
                onClick={() => {
                  setSimState('idle');
                  setSimStep(0);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold font-mono transition-opacity hover:opacity-60 cursor-pointer"
                style={{ color: '#868685' }}
              >
                <RotateCcw size={12} />
                Reset Timeline
              </button>
            </div>
          </div>
        </section>

        <section
          className="pb-16"
          style={{
            opacity: animating ? 0 : 1,
            transform: animating ? 'translateY(8px)' : 'translateY(0)',
            transition: 'opacity 0.18s ease, transform 0.18s ease',
          }}
        >
          
          <div className="flex items-center gap-3 mb-8">
            <span className="h-px w-8" style={{ background: '#9fe870' }} />
            <span className="text-xs font-mono tracking-[0.25em] uppercase" style={{ color: '#868685' }}>
              Detailed Damage Analysis // Trough Breakdown
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            
            <div className="flex flex-col gap-1 py-5 border-t-2" style={{ borderColor: '#ef4444' }}>
              <span className="text-xs font-mono tracking-[0.2em] uppercase" style={{ color: '#868685' }}>
                Peak Shock Value
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-tighter" style={{ color: '#ef4444' }}>
                {formatCurrency(Math.max(0, portfolioAtBottom))}
              </span>
              <span className="text-xs font-mono" style={{ color: '#868685' }}>
                from {formatCurrency(totalValue)}
              </span>
            </div>

            <div className="flex flex-col gap-1 py-5 border-t-2" style={{ borderColor: '#ef4444' }}>
              <span className="text-xs font-mono tracking-[0.2em] uppercase" style={{ color: '#868685' }}>
                Peak Shock Drop
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-tighter" style={{ color: '#ef4444' }}>
                {totalDropPct.toFixed(1)}%
              </span>
              <span className="text-xs font-mono" style={{ color: '#868685' }}>
                vs 100% equity: {pureEquityDrop.toFixed(0)}%
              </span>
            </div>

            <div className="flex flex-col gap-1 py-5 border-t-2" style={{ borderColor: scenario.color }}>
              <span className="text-xs font-mono tracking-[0.2em] uppercase" style={{ color: '#868685' }}>
                Recovery Horizon
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-tighter" style={{ color: scenario.color }}>
                {scenario.recoveryMonths} Months
              </span>
              <span className="text-xs font-mono" style={{ color: '#868685' }}>
                recovery by {scenario.recoveryYear}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1 mb-8">
            <div className="flex justify-between mb-4 border-b pb-2" style={{ borderColor: 'rgba(14,15,12,0.06)' }}>
              <span className="text-xs font-mono tracking-widest uppercase" style={{ color: '#868685' }}>Asset Class & Allocation</span>
              <span className="text-xs font-mono tracking-widest uppercase" style={{ color: '#868685' }}>Scenario Trough Shock</span>
            </div>
            {impactRows.map((row, i) => (
              <div key={row.name} className="flex flex-col gap-2 py-4" style={{ borderBottom: '1px solid rgba(14,15,12,0.05)' }}>
                <div className="flex items-end justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-black" style={{ color: '#0e0f0c' }}>{row.name}</span>
                    <span className="text-xs font-mono" style={{ color: '#868685' }}>
                      {row.percentage.toFixed(1)}% of portfolio · {formatCurrency(row.value)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black font-mono" style={{ color: row.isLoss ? '#ef4444' : '#2ead4b' }}>
                      {row.isLoss ? '' : '+'}{row.impactPct.toFixed(0)}%
                    </span>
                    <span className="text-xs font-mono block" style={{ color: row.isLoss ? '#ef4444' : '#2ead4b' }}>
                      {row.isLoss ? '-' : '+'}{formatCurrency(Math.abs(row.impactValue))}
                    </span>
                  </div>
                </div>
                <ImpactBar pct={Math.abs(row.impactPct)} isLoss={row.isLoss} delay={0.1 + i * 0.05} />
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl border-2" style={{ borderColor: totalDropPct > pureEquityDrop ? '#ef4444' : '#2ead4b', background: totalDropPct > pureEquityDrop ? 'rgba(239,68,68,0.03)' : 'rgba(46,173,75,0.03)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Shield size={14} style={{ color: totalDropPct > pureEquityDrop ? '#ef4444' : '#2ead4b' }} />
              <span className="text-xs font-mono tracking-widest uppercase font-bold" style={{ color: totalDropPct > pureEquityDrop ? '#ef4444' : '#2ead4b' }}>
                {totalDropPct > pureEquityDrop ? '// MORE EXPOSED THAN PURE EQUITY' : '// DIVERSIFIED RESILIENCE RATING'}
              </span>
            </div>
            <p className="text-sm font-black mb-1" style={{ color: '#0e0f0c' }}>
              Your portfolio drop: {totalDropPct.toFixed(1)}% · Benchmark pure equity drop: {Math.abs(pureEquityDrop).toFixed(0)}%
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#454745' }}>
              {totalDropPct < Math.abs(pureEquityDrop)
                ? `Your asset diversification successfully buffered the crash, saving you ${(Math.abs(pureEquityDrop) - Math.abs(totalDropPct)).toFixed(1)} percentage points of drawdown compared to a 100% equity investor. Your defense mechanisms held.`
                : `Your asset mix is more vulnerable than a pure equity benchmark in this specific crisis. You lack safe haven assets (Gold, Bonds, Cash) to act as a hedge. Consider rebalancing towards defensive instruments.`}
            </p>
          </div>

          <div className="mt-10">
            <span className="text-xs font-mono tracking-widest uppercase block mb-4" style={{ color: '#868685' }}>
              Recovery Timeline
            </span>
            <div className="relative h-2 rounded-full overflow-hidden" style={{ background: 'rgba(14,15,12,0.06)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min((scenario.recoveryMonths / 60) * 100, 100)}%`,
                  background: `linear-gradient(90deg, #ef4444, ${scenario.color})`,
                  transition: 'width 1.5s cubic-bezier(0.215,0.61,0.355,1)',
                }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs font-mono" style={{ color: '#868685' }}>Crash</span>
              <span className="text-xs font-mono font-bold" style={{ color: scenario.color }}>{scenario.recoveryYear}</span>
              <span className="text-xs font-mono" style={{ color: '#868685' }}>5yr horizon</span>
            </div>
          </div>
        </section>

        <div className="h-px w-full" style={{ background: 'rgba(14,15,12,0.08)' }} />

        <section className="py-16 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <Clock size={12} style={{ color: '#868685' }} />
            <span className="text-xs font-mono tracking-widest uppercase" style={{ color: '#868685' }}>
              History doesn&apos;t repeat. But it rhymes.
            </span>
          </div>
          <Link
            href="/explorer"
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-black transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-lg"
            style={{ background: '#9fe870', color: '#0e0f0c' }}
          >
            Rebalance My Portfolio
          </Link>
        </section>

      </div>
    </div>
  );
}
