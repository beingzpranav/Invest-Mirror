'use client';

import { useState } from 'react';
import Card from '../ui/Card';
import { Investment } from '@/lib/types';
import { getPortfolioHistory, formatCurrency, formatPercent } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AreaChart as ChartIcon, Calendar } from 'lucide-react';

interface PerformanceChartProps {
  investments: Investment[];
}

type Timeframe = '1D' | '1W' | '1M' | '1Y' | 'ALL';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      date: string;
      value: number;
      gain: number;
      gainPercent: number;
    };
    value: number;
  }>;
}

// Custom tooltip renderer for premium details declared outside render
const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isPositive = data.gain >= 0;
    return (
      <div className="glass-panel p-4 rounded-xl border border-slate-200/60 dark:border-zinc-800/80 shadow-2xl flex flex-col gap-1.5 bg-white/95 dark:bg-zinc-950/95">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-1">
          <Calendar size={10} /> {data.date}
        </span>
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 dark:text-zinc-500 font-semibold">Value</span>
          <span className="text-base font-black text-slate-900 dark:text-white leading-none">
            {formatCurrency(data.value)}
          </span>
        </div>
        <div className="flex justify-between items-center gap-6 mt-1 border-t border-slate-100 dark:border-zinc-800/40 pt-1.5">
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold">Net Returns</span>
          <span className={`text-xs font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isPositive ? '+' : ''}{formatCurrency(data.gain)} ({formatPercent(data.gainPercent)})
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function PerformanceChart({ investments }: PerformanceChartProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  
  const historyData = getPortfolioHistory(investments, timeframe);

  const timeframes: Timeframe[] = ['1D', '1W', '1M', '1Y', 'ALL'];

  return (
    <Card className="flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-cyan-400 flex items-center justify-center">
            <ChartIcon size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wider uppercase text-slate-500 dark:text-zinc-400">
              Performance Overview
            </h2>
            <p className="text-xs text-slate-400 dark:text-zinc-500 font-semibold">
              Historical portfolio valuation trend
            </p>
          </div>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/30 self-start sm:self-auto">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
                timeframe === tf
                  ? 'bg-white text-slate-900 dark:bg-zinc-800 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-[220px] w-full mt-auto">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={historyData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorValueDark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={10}
              fontWeight={600}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            
            <YAxis
              stroke="#64748b"
              fontSize={10}
              fontWeight={600}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
              dx={-5}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(148,163,184,0.2)', strokeWidth: 1.5, strokeDasharray: '4 4' }} />
            
            {/* Main Area */}
            <Area
              type="monotone"
              dataKey="value"
              stroke="url(#colorValue)"
              strokeWidth={2.5}
              fill="url(#colorValue)"
              className="block dark:hidden"
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="url(#colorValueDark)"
              strokeWidth={2.5}
              fill="url(#colorValueDark)"
              className="hidden dark:block"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
