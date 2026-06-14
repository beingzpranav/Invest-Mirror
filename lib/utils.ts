import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Investment, PortfolioSummary } from './types';
import { PERSONALITY_ARCHETYPES } from './data';

// Class merger for Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

// Format percent
export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

// Color mapping for asset classes
export const ASSET_CLASS_DETAILS: Record<string, { label: string; color: string; gradient: string }> = {
  crypto: {
    label: 'Cryptocurrency',
    color: '#a855f7', // Purple-500
    gradient: 'from-purple-500 to-indigo-600'
  },
  equity: {
    label: 'Equities / Stocks',
    color: '#06b6d4', // Cyan-500
    gradient: 'from-cyan-500 to-blue-600'
  },
  fixed_income: {
    label: 'Fixed Income / Bonds',
    color: '#10b981', // Emerald-500
    gradient: 'from-emerald-500 to-teal-600'
  },
  real_estate: {
    label: 'Real Estate / REITs',
    color: '#f59e0b', // Amber-500
    gradient: 'from-amber-500 to-orange-600'
  },
  commodities: {
    label: 'Commodities / Gold',
    color: '#eab308', // Yellow-500
    gradient: 'from-yellow-500 to-amber-600'
  },
  mutual_fund: {
    label: 'Mutual Funds',
    color: '#ec4899', // Pink-500
    gradient: 'from-pink-500 to-rose-600'
  },
  cash: {
    label: 'Cash & Deposits',
    color: '#64748b', // Slate-500
    gradient: 'from-slate-500 to-zinc-600'
  }
};

// Calculate entire portfolio stats — works for any set of investments
export function calculatePortfolioSummary(
  investments: Investment[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _portfolioId?: string
): PortfolioSummary {
  let totalValue = 0;
  let totalCost = 0;
  let riskScoreWeightedSum = 0;

  investments.forEach((inv) => {
    const value = inv.price * inv.shares;
    const cost = inv.costBasis * inv.shares;
    totalValue += value;
    totalCost += cost;
    riskScoreWeightedSum += inv.riskScore * value;
  });

  const totalGain = totalValue - totalCost;
  const gainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;
  const weightedRiskScore = totalValue > 0 ? riskScoreWeightedSum / totalValue : 0;

  // Derive personality dynamically from actual weighted risk score
  let archetypeId: string;
  if (weightedRiskScore <= 3.5) archetypeId = 'guardian';
  else if (weightedRiskScore <= 6.5) archetypeId = 'pathseeker';
  else archetypeId = 'maverick';

  const personality = PERSONALITY_ARCHETYPES[archetypeId] ?? PERSONALITY_ARCHETYPES.pathseeker;

  return {
    totalValue,
    totalCost,
    totalGain,
    gainPercent,
    weightedRiskScore,
    personality,
  };
}


// Compute asset class allocation percentages
export function getAssetAllocation(investments: Investment[]) {
  const totals: Record<string, number> = {};
  let overall = 0;

  investments.forEach((inv) => {
    const val = inv.price * inv.shares;
    totals[inv.assetClass] = (totals[inv.assetClass] || 0) + val;
    overall += val;
  });

  return Object.entries(totals).map(([key, val]) => {
    const details = ASSET_CLASS_DETAILS[key] || { label: key, color: '#6b7280', gradient: 'from-gray-500 to-gray-600' };
    return {
      name: details.label,
      value: val,
      percentage: overall > 0 ? (val / overall) * 100 : 0,
      color: details.color,
      gradient: details.gradient,
      rawType: key
    };
  }).sort((a, b) => b.value - a.value);
}

// Compute risk category distribution
export function getRiskDistribution(investments: Investment[]) {
  // Low (1-3), Medium (4-6), High (7-8), Speculative (9-10)
  const distribution = [
    { name: 'Defensive (Risk 1-3)', value: 0, color: '#10b981', gradient: 'from-emerald-500 to-green-600' },
    { name: 'Moderate (Risk 4-6)', value: 0, color: '#3b82f6', gradient: 'from-blue-500 to-indigo-600' },
    { name: 'Aggressive (Risk 7-8)', value: 0, color: '#f97316', gradient: 'from-orange-500 to-amber-500' },
    { name: 'Speculative (Risk 9-10)', value: 0, color: '#ef4444', gradient: 'from-red-500 to-pink-600' }
  ];

  let overall = 0;

  investments.forEach((inv) => {
    const val = inv.price * inv.shares;
    overall += val;

    if (inv.riskScore <= 3) {
      distribution[0].value += val;
    } else if (inv.riskScore <= 6) {
      distribution[1].value += val;
    } else if (inv.riskScore <= 8) {
      distribution[2].value += val;
    } else {
      distribution[3].value += val;
    }
  });

  return distribution.map(d => ({
    ...d,
    percentage: overall > 0 ? (d.value / overall) * 100 : 0
  })).filter(d => d.value > 0);
}

// Synthesize portfolio historical performance over time
// Merges individual asset price arrays weight-by-weight to show portfolio valuation path
export function getPortfolioHistory(investments: Investment[], timeframe: '1D' | '1W' | '1M' | '1Y' | 'ALL') {
  if (investments.length === 0) return [];

  // Determine points count to slice
  let sliceCount = 60;
  if (timeframe === '1D') sliceCount = 5;
  else if (timeframe === '1W') sliceCount = 7;
  else if (timeframe === '1M') sliceCount = 15;
  else if (timeframe === '1Y') sliceCount = 45;

  const sampleHistory = investments[0].historicalPrices;
  const startIndex = Math.max(0, sampleHistory.length - sliceCount);
  const historyRange = sampleHistory.slice(startIndex);

  return historyRange.map((point, index) => {
    let portfolioValue = 0;
    let portfolioCost = 0;

    investments.forEach((inv) => {
      // Find asset price at this date relative to index offset
      const assetHistory = inv.historicalPrices;
      const assetHistoryStartIndex = Math.max(0, assetHistory.length - sliceCount);
      const assetPoint = assetHistory[assetHistoryStartIndex + index] || assetHistory[assetHistory.length - 1];
      
      portfolioValue += assetPoint.price * inv.shares;
      portfolioCost += inv.costBasis * inv.shares;
    });

    const gain = portfolioValue - portfolioCost;
    const gainPercent = portfolioCost > 0 ? (gain / portfolioCost) * 100 : 0;

    return {
      date: point.date,
      value: Math.round(portfolioValue),
      gain: Math.round(gain),
      gainPercent: Number(gainPercent.toFixed(2))
    };
  });
}
