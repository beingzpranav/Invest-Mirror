'use client';

import Card from '../ui/Card';
import { Investment } from '@/lib/types';
import { formatCurrency, ASSET_CLASS_DETAILS } from '@/lib/utils';
import { Shield } from 'lucide-react';

interface InvestmentItemProps {
  investment: Investment;
  portfolioTotalValue: number;
  isSelected: boolean;
  onClick: () => void;
}

export default function InvestmentItem({
  investment,
  portfolioTotalValue,
  isSelected,
  onClick
}: InvestmentItemProps) {
  const totalValue = investment.price * investment.shares;
  const allocationPercent = portfolioTotalValue > 0 ? (totalValue / portfolioTotalValue) * 100 : 0;
  
  // Calculate price gain
  const totalCost = investment.costBasis * investment.shares;
  const gain = totalValue - totalCost;
  const gainPercent = totalCost > 0 ? (gain / totalCost) * 100 : 0;
  const isPositive = gain >= 0;

  // Generate SVG path coordinates for the miniature sparkline
  const generateSparklinePoints = (prices: { price: number }[]) => {
    if (prices.length < 2) return '';
    const values = prices.map(p => p.price);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    
    const width = 80;
    const height = 28;
    const padding = 2;
    
    return values
      .map((val, idx) => {
        const x = (idx / (values.length - 1)) * width;
        // Invert Y axis as SVG 0 is at top
        const y = padding + (height - padding * 2) - ((val - min) / range) * (height - padding * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  };

  const assetDetails = ASSET_CLASS_DETAILS[investment.assetClass] || { label: investment.assetClass, color: '#6b7280' };

  // Risk styling
  const getRiskStyles = (score: number) => {
    if (score <= 3) return { bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20', label: 'Low' };
    if (score <= 6) return { bg: 'bg-sky-500/10 text-sky-600 dark:text-cyan-400 border-sky-500/20', label: 'Medium' };
    if (score <= 8) return { bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20', label: 'High' };
    return { bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20', label: 'Speculative' };
  };

  const riskStyles = getRiskStyles(investment.riskScore);

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'ring-2 ring-sky-500 shadow-xl'
          : 'hover:-translate-y-0.5 shadow-sm hover:shadow-lg'
      }`}
    >
      <Card
        glow={true}
        className={`p-4.5 transition-all duration-300 h-full border ${
          isSelected 
            ? 'bg-sky-500/5 dark:bg-cyan-500/5 border-sky-500/30 dark:border-cyan-500/30' 
            : 'border-slate-200/50 dark:border-zinc-800/40'
        }`}
      >
        <div className="flex flex-col gap-3.5 h-full justify-between">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                  {investment.ticker}
                </span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 truncate max-w-[90px]">
                  {investment.name}
                </span>
              </div>
              <span
                className="text-[9px] font-bold uppercase tracking-wider block mt-1"
                style={{ color: assetDetails.color }}
              >
                {assetDetails.label}
              </span>
            </div>

            {/* Risk Badge */}
            <div className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5 ${riskStyles.bg}`}>
              <Shield size={9} />
              {riskStyles.label}
            </div>
          </div>

          {/* Sparkline & Values Middle Section */}
          <div className="flex items-center justify-between gap-3 my-1">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 leading-tight">
                Current Price
              </span>
              <span className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                {formatCurrency(investment.price)}
              </span>
            </div>

            {/* SVG Sparkline */}
            <div className="shrink-0 flex items-center pr-1">
              <svg width="80" height="28" className="overflow-visible select-none">
                <polyline
                  fill="none"
                  stroke={isPositive ? '#10b981' : '#ef4444'}
                  strokeWidth="1.75"
                  points={generateSparklinePoints(investment.historicalPrices)}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    filter: isPositive 
                      ? 'drop-shadow(0 2px 4px rgba(16,185,129,0.25))' 
                      : 'drop-shadow(0 2px 4px rgba(239,68,68,0.25))'
                  }}
                />
              </svg>
            </div>
          </div>

          {/* Allocation & Profit Footer */}
          <div className="grid grid-cols-2 gap-2 border-t border-slate-100 dark:border-zinc-800/40 pt-2.5 mt-1">
            <div>
              <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block leading-tight">
                Allocation
              </span>
              <span className="text-xs font-extrabold text-slate-950 dark:text-white mt-0.5 block">
                {allocationPercent.toFixed(1)}%
              </span>
            </div>

            <div className="text-right">
              <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block leading-tight">
                Gains
              </span>
              <span className={`text-xs font-bold mt-0.5 block ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                {isPositive ? '+' : ''}{gainPercent.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
