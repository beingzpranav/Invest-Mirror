'use client';

import { useState, useMemo } from 'react';
import { Investment } from '@/lib/types';
import { formatCurrency, formatPercent, ASSET_CLASS_DETAILS } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { X, Shield, Sliders, MessageSquare, AlertCircle } from 'lucide-react';

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      date: string;
      price: number;
    };
    value: number;
  }>;
}

// Sparkline tooltip declared outside component to prevent re-creation on render
const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="wise-card px-3 py-2 rounded-xl shadow-md" style={{ minWidth: 120 }}>
        <span className="text-xs font-bold block" style={{ color: 'var(--color-mute)' }}>
          {payload[0].payload.date}
        </span>
        <span className="text-sm font-black block mt-0.5" style={{ color: 'var(--color-ink)' }}>
          {formatCurrency(payload[0].value)}
        </span>
      </div>
    );
  }
  return null;
};

interface InvestmentDetailsProps {
  investment: Investment | null;
  allInvestments: Investment[];
  onClose: () => void;
}

export default function InvestmentDetails({
  investment,
  allInvestments,
  onClose
}: InvestmentDetailsProps) {
  // Call hooks unconditionally at the very top
  const [simulatedShares, setSimulatedShares] = useState(investment ? investment.shares : 0);

  // Asset price & total cost details
  const price = investment ? investment.price : 0;
  const currentShares = investment ? investment.shares : 0;
  const currentAssetValue = price * currentShares;

  const assetDetails = investment
    ? (ASSET_CLASS_DETAILS[investment.assetClass] || { label: investment.assetClass, color: '#6b7280' })
    : { label: '', color: '#6b7280' };

  // Calculate portfolio totals
  const portfolioMetrics = useMemo(() => {
    let currentTotalValue = 0;
    let currentWeightedRiskSum = 0;
    let currentWeightedReturnSum = 0;

    allInvestments.forEach((inv) => {
      const val = inv.price * inv.shares;
      currentTotalValue += val;
      currentWeightedRiskSum += inv.riskScore * val;
      currentWeightedReturnSum += inv.annualReturn * val;
    });

    return {
      currentTotalValue,
      currentWeightedRiskSum,
      currentWeightedReturnSum
    };
  }, [allInvestments]);

  // Calculate simulation metrics
  const simMetrics = useMemo(() => {
    if (!investment) {
      return {
        simTotalValue: 0,
        simAssetValue: 0,
        simAllocation: 0,
        currAllocation: 0,
        simRiskScore: 0,
        currRiskScore: 0,
        simReturn: 0,
        currReturn: 0
      };
    }
    const simulatedAssetValue = price * simulatedShares;
    
    // Adjust portfolio totals based on the difference
    const valueDelta = simulatedAssetValue - currentAssetValue;
    const simulatedTotalValue = Math.max(1, portfolioMetrics.currentTotalValue + valueDelta);
    
    // Adjust weighted risk sum
    const riskDelta = (investment.riskScore * simulatedAssetValue) - (investment.riskScore * currentAssetValue);
    const simulatedWeightedRiskScore = (portfolioMetrics.currentWeightedRiskSum + riskDelta) / simulatedTotalValue;

    // Adjust weighted return sum
    const returnDelta = (investment.annualReturn * simulatedAssetValue) - (investment.annualReturn * currentAssetValue);
    const simulatedWeightedReturn = (portfolioMetrics.currentWeightedReturnSum + returnDelta) / simulatedTotalValue;

    const simulatedAllocation = (simulatedAssetValue / simulatedTotalValue) * 100;
    const currentAllocation = (currentAssetValue / portfolioMetrics.currentTotalValue) * 100;

    return {
      simTotalValue: simulatedTotalValue,
      simAssetValue: simulatedAssetValue,
      simAllocation: simulatedAllocation,
      currAllocation: currentAllocation,
      simRiskScore: simulatedWeightedRiskScore,
      currRiskScore: portfolioMetrics.currentWeightedRiskSum / portfolioMetrics.currentTotalValue,
      simReturn: simulatedWeightedReturn,
      currReturn: portfolioMetrics.currentWeightedReturnSum / portfolioMetrics.currentTotalValue
    };
  }, [simulatedShares, investment, currentAssetValue, price, portfolioMetrics]);

  // Early return checking AFTER all hooks are registered
  if (!investment) return null;

  // Risk styling
  const getRiskLabel = (score: number) => {
    if (score <= 3) return { label: 'Low', color: 'text-emerald-500' };
    if (score <= 6) return { label: 'Medium', color: 'text-sky-500' };
    if (score <= 8) return { label: 'High', color: 'text-orange-500' };
    return { label: 'Speculative', color: 'text-rose-500' };
  };

  const riskLabel = getRiskLabel(investment.riskScore);

  return (
    // Start below the fixed navbar (top-14 = 56px) so content is never hidden
    <div className="fixed top-14 inset-x-0 bottom-0 right-0 z-40 w-full max-w-md ml-auto flex">
      {/* Backdrop — desktop only */}
      <div
        onClick={onClose}
        className="absolute inset-0 cursor-pointer hidden md:block"
        style={{ background: 'rgba(14,15,12,0.15)', backdropFilter: 'blur(2px)' }}
      />

      {/* Drawer body */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 240 }}
        className="relative ml-auto w-full h-full flex flex-col shadow-2xl"
        style={{ background: 'var(--color-canvas)', borderLeft: '1px solid rgba(14,15,12,0.08)' }}
      >
        {/* ── Sticky header — always visible, never scrolls away ── */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-5 py-4"
          style={{ background: 'var(--color-canvas)', borderBottom: '1px solid rgba(14,15,12,0.07)' }}
        >
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black" style={{ color: 'var(--color-ink)' }}>
                {investment.ticker} Details
              </h3>
              <span
                className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  color: assetDetails.color,
                  border: `1px solid ${assetDetails.color}30`,
                  backgroundColor: `${assetDetails.color}10`,
                }}
              >
                {assetDetails.label}
              </span>
            </div>
            <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--color-mute)' }}>
              {investment.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-xl transition-colors cursor-pointer shrink-0"
            style={{ background: 'var(--color-canvas-soft)', color: 'var(--color-ink)' }}
            aria-label="Close"
          >
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl" style={{ background: 'var(--color-canvas-soft)' }}>
              <span className="text-xs font-bold uppercase tracking-widest block leading-tight" style={{ color: 'var(--color-mute)' }}>
                Annual Return
              </span>
              <span className="text-base font-black mt-1 block" style={{ color: 'var(--color-ink)' }}>
                {formatPercent(investment.annualReturn)}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl" style={{ background: 'var(--color-canvas-soft)' }}>
              <span className="text-xs font-bold uppercase tracking-widest block leading-tight" style={{ color: 'var(--color-mute)' }}>
                Risk Score
              </span>
              <span className={`text-base font-black mt-1 flex items-center gap-1 ${riskLabel.color}`}>
                <Shield size={14} className="fill-current" />
                {investment.riskScore}/10 ({riskLabel.label})
              </span>
            </div>
          </div>

          {/* Historical chart */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold" style={{ color: 'var(--color-body)' }}>Simulated Price History</span>
              <span className="text-xs font-bold" style={{ color: 'var(--color-mute)' }}>Last 12 Months</span>
            </div>
            <div className="h-[110px] w-full p-2.5 rounded-2xl" style={{ background: 'var(--color-canvas-soft)' }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={investment.historicalPrices} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="detailGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={assetDetails.color} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={assetDetails.color} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" hide />
                  <YAxis fontSize={9} stroke="var(--color-mute)" axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} domain={['auto', 'auto']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="price" stroke={assetDetails.color} strokeWidth={2} fill="url(#detailGlow)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Allocation simulator */}
          <div className="p-4 rounded-2xl flex flex-col gap-4" style={{ background: 'color-mix(in srgb, #38c8ff 5%, transparent)', border: '1px solid rgba(56,200,255,0.15)' }}>
            <div className="flex items-center gap-2">
              <Sliders size={14} style={{ color: '#38c8ff' }} />
              <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: 'var(--color-ink)' }}>Allocation Simulator</span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold" style={{ color: 'var(--color-body)' }}>
                <span>Simulated Units: {simulatedShares.toFixed(2)}</span>
                <span>Current: {currentShares.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={currentShares * 3.5}
                step={currentShares > 10 ? 1 : 0.05}
                value={simulatedShares}
                onChange={(e) => setSimulatedShares(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                style={{ background: 'rgba(56,200,255,0.2)', accentColor: '#38c8ff' }}
              />
            </div>
            <div className="grid grid-cols-3 gap-3 pt-3 text-center" style={{ borderTop: '1px solid rgba(14,15,12,0.06)' }}>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest block" style={{ color: 'var(--color-mute)' }}>Asset Weight</span>
                <span className="text-xs font-black block mt-0.5" style={{ color: 'var(--color-ink)' }}>{simMetrics.currAllocation.toFixed(1)}%</span>
                <span className="text-xs font-bold block mt-0.5" style={{ color: '#38c8ff' }}>→ {simMetrics.simAllocation.toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest block" style={{ color: 'var(--color-mute)' }}>Portfolio Risk</span>
                <span className="text-xs font-black block mt-0.5" style={{ color: 'var(--color-ink)' }}>{simMetrics.currRiskScore.toFixed(2)}</span>
                {(() => {
                  const diff = simMetrics.simRiskScore - simMetrics.currRiskScore;
                  return <span className="text-xs font-bold block mt-0.5" style={{ color: diff > 0.01 ? 'var(--color-negative)' : diff < -0.01 ? 'var(--color-positive)' : 'var(--color-mute)' }}>→ {simMetrics.simRiskScore.toFixed(2)}</span>;
                })()}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest block" style={{ color: 'var(--color-mute)' }}>Portfolio Ret.</span>
                <span className="text-xs font-black block mt-0.5" style={{ color: 'var(--color-ink)' }}>{simMetrics.currReturn.toFixed(2)}%</span>
                {(() => {
                  const diff = simMetrics.simReturn - simMetrics.currReturn;
                  return <span className="text-xs font-bold block mt-0.5" style={{ color: diff > 0.01 ? 'var(--color-positive)' : diff < -0.01 ? 'var(--color-negative)' : 'var(--color-mute)' }}>→ {simMetrics.simReturn.toFixed(2)}%</span>;
                })()}
              </div>
            </div>
          </div>

          {/* Observations */}
          <div className="mt-auto">
            <div className="flex items-center gap-2 mb-2.5">
              <MessageSquare size={14} style={{ color: 'var(--color-ink-deep)' }} />
              <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: 'var(--color-ink)' }}>Interesting Observations</span>
            </div>
            <div className="flex flex-col gap-2">
              {investment.observations.map((obs, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-3 rounded-xl text-xs leading-relaxed"
                  style={{ background: 'var(--color-primary-pale)', color: 'var(--color-ink-deep)' }}
                >
                  <AlertCircle size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--color-positive)' }} />
                  <p>{obs}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
