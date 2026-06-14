'use client';

import { useEffect, useState } from 'react';
import ThemeToggle from '../ui/ThemeToggle';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { LayoutDashboard, Shield, Flame, Compass, TrendingUp } from 'lucide-react';

interface HeaderProps {
  portfolioId: string;
  onChangePortfolio: (id: string) => void;
  totalValue: number;
  totalGain: number;
  gainPercent: number;
  isDark: boolean;
  onToggleTheme: () => void;
}

// Custom Counter Hook for smooth number animation on mount and change
function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1000; // 1s
    const startValue = displayValue;
    const endValue = value;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function (easeOutQuad)
      const easeProgress = progress * (2 - progress);
      
      const current = startValue + easeProgress * (endValue - startValue);
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span>{formatCurrency(displayValue)}</span>;
}

export default function Header({
  portfolioId,
  onChangePortfolio,
  totalValue,
  totalGain,
  gainPercent,
  isDark,
  onToggleTheme
}: HeaderProps) {
  const portfolios = [
    { id: 'pathseeker', name: 'The Pathseeker', icon: Compass, desc: 'Balanced 60/40' },
    { id: 'maverick', name: 'The Maverick', icon: Flame, desc: 'Speculative Growth' },
    { id: 'guardian', name: 'The Guardian', icon: Shield, desc: 'Capital Preservation' }
  ];

  return (
    <header className="w-full flex flex-col gap-6 py-6 border-b border-slate-200/50 dark:border-slate-800/40">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25">
            <LayoutDashboard size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              InvestMirror
            </h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
              PORTFOLIO BEHAVIORAL ANALYZER
            </p>
          </div>
        </div>

        {/* Portfolio Presets Toggles */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {portfolios.map((port) => {
            const IconComponent = port.icon;
            const isActive = portfolioId === port.id;
            return (
              <button
                key={port.id}
                onClick={() => onChangePortfolio(port.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-zinc-950 shadow-md scale-[1.02]'
                    : 'bg-white/50 text-slate-600 dark:bg-zinc-900/50 dark:text-zinc-400 hover:bg-slate-200/50 dark:hover:bg-zinc-800/50 border border-slate-200/40 dark:border-zinc-800/30'
                }`}
              >
                <IconComponent size={15} className={isActive ? 'animate-pulse' : ''} />
                <div className="text-left">
                  <div className="leading-tight">{port.name}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Theme switch */}
        <div className="flex items-center justify-end">
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
        </div>
      </div>

      {/* Metric summary panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 flex flex-col justify-center border-t-sky-500/30 dark:border-t-cyan-500/30">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Total Portfolio Value
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              <AnimatedNumber value={totalValue} />
            </span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 flex flex-col justify-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Total Profit / Loss
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-2xl font-bold tracking-tight ${totalGain >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {totalGain >= 0 ? '+' : ''}{formatCurrency(totalGain)}
            </span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 flex flex-col justify-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Overall Returns
          </span>
          <div className="mt-1 flex items-center gap-2">
            <span className={`text-2xl font-bold flex items-center gap-1 ${gainPercent >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              <TrendingUp size={20} className={gainPercent < 0 ? 'rotate-180' : ''} />
              {formatPercent(gainPercent)}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
