'use client';

import Card from '../ui/Card';
import { Investment } from '@/lib/types';
import { getRiskDistribution, formatCurrency } from '@/lib/utils';
import { ShieldAlert, Info, Shield, Zap, Sparkles, Compass } from 'lucide-react';

interface RiskAnalysisProps {
  investments: Investment[];
  weightedRiskScore: number;
}

export default function RiskAnalysis({ investments, weightedRiskScore }: RiskAnalysisProps) {
  const riskDist = getRiskDistribution(investments);
  
  // Calculate qualitative indicators
  const getRiskLabel = (score: number) => {
    if (score <= 3) return { label: 'Conservative', color: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5', icon: Shield, desc: 'Your assets prioritize capital preservation and defense against inflation. Drawdowns will likely be shallow.' };
    if (score <= 6) return { label: 'Moderate / Balanced', color: 'text-sky-500 border-sky-500/20 bg-sky-500/5', icon: Compass, desc: 'Balanced volatility structure. Growth is captured through stocks while fixed income buffers market swings.' };
    if (score <= 8) return { label: 'Aggressive Growth', color: 'text-orange-500 border-orange-500/20 bg-orange-500/5', icon: Zap, desc: 'High beta exposure. Significant growth opportunities but susceptible to market pullbacks and corrections.' };
    return { label: 'Highly Speculative', color: 'text-rose-500 border-rose-500/20 bg-rose-500/5', icon: ShieldAlert, desc: 'Chasing exponential performance. Expect massive swings, double-digit monthly drawdowns, and systemic sector risk.' };
  };

  const riskLabel = getRiskLabel(weightedRiskScore);
  const IconComponent = riskLabel.icon;

  // Diversification score calculator (Proxy: inverse concentration index HHI)
  const calculateDiversification = () => {
    if (investments.length === 0) return 0;
    
    let totalVal = 0;
    const values: number[] = [];
    
    investments.forEach((inv) => {
      const val = inv.price * inv.shares;
      totalVal += val;
      values.push(val);
    });

    if (totalVal === 0) return 0;

    // Herfindahl-Hirschman Index calculation
    const hhi = values.reduce((sum, val) => sum + Math.pow(val / totalVal, 2), 0);
    
    // Scale to a score out of 100 (100 is perfectly diversified/equal weight across infinite assets)
    // Low concentration = High diversification score
    const score = Math.round((1 - hhi) * 100);
    return score;
  };

  const divScore = calculateDiversification();
  const getDivLabel = (score: number) => {
    if (score < 40) return { label: 'Highly Concentrated', color: 'text-rose-500 dark:text-rose-400' };
    if (score < 70) return { label: 'Moderately Diversified', color: 'text-amber-500 dark:text-amber-400' };
    return { label: 'Well Diversified', color: 'text-emerald-500 dark:text-emerald-400' };
  };
  const divLabel = getDivLabel(divScore);

  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-8 w-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-amber-400 flex items-center justify-center">
          <ShieldAlert size={16} />
        </div>
        <div>
          <h2 className="text-sm font-bold tracking-wider uppercase text-slate-500 dark:text-zinc-400">
            Risk & Volatility Analysis
          </h2>
          <p className="text-xs text-slate-400 dark:text-zinc-500 font-semibold">
            Aggregated portfolio variance indicators
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 my-auto">
        {/* Risk meter score and gauge */}
        <div className="flex items-center gap-5 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-800/40">
          {/* Radial score gauge */}
          <div className="relative flex items-center justify-center shrink-0 w-16 h-16 rounded-full bg-slate-200/50 dark:bg-zinc-800/50 border border-slate-300/20 dark:border-zinc-700/25">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {weightedRiskScore.toFixed(1)}
            </span>
            <span className="absolute -bottom-1 px-1.5 py-0.5 rounded-full text-[8px] font-black bg-slate-900 text-white dark:bg-white dark:text-zinc-950 uppercase tracking-wider scale-90">
              Risk
            </span>
          </div>

          <div className="min-w-0">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block leading-tight">
              Aggregated Volatility Stance
            </span>
            <span className={`text-base font-extrabold flex items-center gap-1.5 mt-0.5 ${riskLabel.color.split(' ')[0]}`}>
              <IconComponent size={16} />
              {riskLabel.label}
            </span>
          </div>
        </div>

        {/* Segmented allocation bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">
              Risk Exposure Distribution
            </span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 flex items-center gap-1">
              <Info size={10} /> Hover segments
            </span>
          </div>

          {/* Segmented bar */}
          <div className="h-4 w-full rounded-full flex overflow-hidden bg-slate-100 dark:bg-zinc-900 border border-slate-200/30 dark:border-zinc-800/35">
            {riskDist.map((seg) => (
              <div
                key={seg.name}
                className="h-full relative group transition-all duration-300 hover:scale-y-110 cursor-help"
                style={{
                  width: `${seg.percentage}%`,
                  backgroundColor: seg.color
                }}
              >
                {/* Micro tooltip inside bar segments */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col bg-slate-950 text-white dark:bg-white dark:text-zinc-950 text-[10px] font-bold py-1 px-2.5 rounded-lg whitespace-nowrap shadow-xl z-20 pointer-events-none">
                  <span>{seg.name}</span>
                  <span className="text-[9px] opacity-75">{formatCurrency(seg.value)} ({seg.percentage.toFixed(1)}%)</span>
                </div>
              </div>
            ))}
          </div>

          {/* Segment labels */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5">
            {riskDist.map((seg) => (
              <div key={seg.name} className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                <span className="text-[10px] font-bold text-slate-600 dark:text-zinc-400">
                  {seg.name.split(' ')[0]}: {seg.percentage.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed stats */}
        <div className="grid grid-cols-2 gap-4 border-t border-slate-200/50 dark:border-zinc-800/40 pt-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block leading-tight">
              Diversification Score
            </span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white block mt-0.5">
              {divScore} / 100
            </span>
            <span className={`text-[10px] font-bold leading-tight block ${divLabel.color}`}>
              {divLabel.label}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block leading-tight">
              Stability Rating
            </span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white block mt-0.5 flex items-center gap-1">
              <Sparkles size={14} className="text-amber-500" />
              {weightedRiskScore <= 3.5 ? 'Excellent' : weightedRiskScore <= 6.5 ? 'Moderate' : 'Volatile'}
            </span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 leading-tight block">
              Based on historical beta
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
