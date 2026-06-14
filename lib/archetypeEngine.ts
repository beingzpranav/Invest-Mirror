import { Investment } from './types';
import { ASSET_CLASS_DETAILS } from './utils';

// ─── Types ──────────────────────────────────────────────────────────────────
export type ArchetypeId =
  | 'builder'
  | 'protector'
  | 'optimist'
  | 'explorer'
  | 'collector'
  | 'opportunist'
  | 'visionary';

export interface Archetype {
  id: ArchetypeId;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  color: string;
  colorDark: string;
  gradientFrom: string;
  gradientTo: string;
  traits: string[];
}

export interface InfluencingFactor {
  label: string;
  description: string;
  weight: number; // 0–1, used for bar width
  positive: boolean;
}

export interface PortfolioObservation {
  headline: string;
  detail: string;
  severity: 'positive' | 'warning' | 'info' | 'neutral';
  icon: string;
}

export interface DimensionScore {
  label: string;
  score: number; // 0–100
  description: string;
}

export interface ArchetypeResult {
  archetype: Archetype;
  confidence: number; // 42–91
  influencingFactors: InfluencingFactor[];
  observations: PortfolioObservation[];
  dimensions: DimensionScore[];
  scores: Record<ArchetypeId, number>; // raw scores for all archetypes
}

// ─── Archetype definitions ───────────────────────────────────────────────────
export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  builder: {
    id: 'builder',
    name: 'The Builder',
    icon: '🏗️',
    tagline: 'Patient, diversified, relentless.',
    description:
      'You think in decades, not quarters. Every asset in your portfolio serves a deliberate purpose — equity for growth, bonds for stability, commodities for inflation protection. You are the architect of long-term wealth, methodically laying bricks while others chase the latest trend. Your portfolio is not a gamble; it is a blueprint.',
    color: '#3b82f6',
    colorDark: '#60a5fa',
    gradientFrom: '#3b82f6',
    gradientTo: '#6366f1',
    traits: ['Diversified', 'Long-Term', 'Systematic', 'Balanced'],
  },
  protector: {
    id: 'protector',
    name: 'The Protector',
    icon: '🛡️',
    tagline: 'Safety first. Growth second.',
    description:
      'You build walls before bridges. While others chase the next moonshot, you are quietly constructing an impenetrable fortress of wealth. Your portfolio is a testament to the belief that the best offense is a great defense — you would rather miss a rally than suffer a painful drawdown. Capital preservation is your north star.',
    color: '#10b981',
    colorDark: '#34d399',
    gradientFrom: '#10b981',
    gradientTo: '#059669',
    traits: ['Capital Preservation', 'Income Focused', 'Low Volatility', 'Disciplined'],
  },
  optimist: {
    id: 'optimist',
    name: 'The Optimist',
    icon: '☀️',
    tagline: 'Equity believer. Long horizon holder.',
    description:
      'You are a true believer in the compounding power of equities. When markets dip, you see a sale. When others panic, you stay the course. Your portfolio leans heavily into stocks and growth funds — not out of carelessness, but because you understand that time in the market always beats timing the market.',
    color: '#f59e0b',
    colorDark: '#fbbf24',
    gradientFrom: '#f59e0b',
    gradientTo: '#ef4444',
    traits: ['Equity Heavy', 'Growth Oriented', 'Buy & Hold', 'Bullish'],
  },
  explorer: {
    id: 'explorer',
    name: 'The Explorer',
    icon: '🚀',
    tagline: 'You go where others fear to tread.',
    description:
      'Traditional finance is too tame for you. You have allocated real capital into crypto, high-volatility instruments, and speculative assets that most investors would not touch. You understand that extraordinary returns come from exploring uncharted territory — and your risk tolerance is a genuine competitive advantage.',
    color: '#8b5cf6',
    colorDark: '#a78bfa',
    gradientFrom: '#8b5cf6',
    gradientTo: '#ec4899',
    traits: ['Crypto Native', 'Speculative', 'High Risk Tolerance', 'Contrarian'],
  },
  collector: {
    id: 'collector',
    name: 'The Collector',
    icon: '💎',
    tagline: 'Every asset class is a piece of art.',
    description:
      'While most investors pick a lane, you collect them all. Stocks, bonds, gold, real estate, crypto — nothing is off the table. Your portfolio reads like a curated museum of modern finance. You believe that true diversification is the closest thing to a free lunch in investing, and you are right.',
    color: '#ec4899',
    colorDark: '#f472b6',
    gradientFrom: '#ec4899',
    gradientTo: '#a855f7',
    traits: ['Hyper-Diversified', 'Asset Agnostic', 'Curious', 'Meticulous'],
  },
  opportunist: {
    id: 'opportunist',
    name: 'The Opportunist',
    icon: '⚡',
    tagline: 'High conviction. Concentrated bets.',
    description:
      'You do not spread yourself thin. When you believe in something, you commit fully — and your portfolio shows it. Concentrated positions, high-conviction bets, and a willingness to accept asymmetric risk define your style. You would rather be spectacularly right than safely mediocre.',
    color: '#f97316',
    colorDark: '#fb923c',
    gradientFrom: '#f97316',
    gradientTo: '#ef4444',
    traits: ['High Conviction', 'Concentrated', 'Aggressive', 'Alpha Seeking'],
  },
  visionary: {
    id: 'visionary',
    name: 'The Visionary',
    icon: '🔭',
    tagline: 'Investing in the world of tomorrow.',
    description:
      'You do not just invest in companies — you invest in ideas. Your portfolio tilts heavily towards technology, innovation, and the businesses reshaping how the world works. You see short-term market volatility as the price of admission to extraordinary long-term returns.',
    color: '#06b6d4',
    colorDark: '#22d3ee',
    gradientFrom: '#06b6d4',
    gradientTo: '#3b82f6',
    traits: ['Tech Forward', 'Innovation First', 'Thematic', 'Future Focused'],
  },
};

// ─── Portfolio metrics computation ──────────────────────────────────────────
export interface PortfolioMetrics {
  totalValue: number;
  classPct: Record<string, number>;
  numClasses: number;
  maxClassPct: number;
  maxClassKey: string;
  weightedRisk: number;
  growthPct: number;    // equity + mutual_fund + crypto
  safetyPct: number;   // fixed_income + cash
  cryptoPct: number;
  equityPct: number;   // equity + mutual_fund
  realAssetsPct: number; // commodities + real_estate
  techPct: number;
  avgReturn: number;
  positiveRatio: number;
  numHoldings: number;
  diversificationScore: number; // 0–1
}

export function computePortfolioMetrics(investments: Investment[]): PortfolioMetrics | null {
  if (!investments.length) return null;

  const totalValue = investments.reduce((s, i) => s + i.price * i.shares, 0);
  if (totalValue === 0) return null;

  const classDist: Record<string, number> = {};
  investments.forEach((inv) => {
    const v = inv.price * inv.shares;
    classDist[inv.assetClass] = (classDist[inv.assetClass] || 0) + v;
  });

  const classPct: Record<string, number> = {};
  Object.entries(classDist).forEach(([k, v]) => (classPct[k] = (v / totalValue) * 100));

  const numClasses = Object.keys(classDist).length;
  const maxClassPct = Math.max(...Object.values(classPct));
  const maxClassKey = Object.keys(classPct).find((k) => classPct[k] === maxClassPct) ?? '';

  const weightedRisk =
    investments.reduce((s, i) => s + i.riskScore * (i.price * i.shares), 0) / totalValue;

  const growthPct = (classPct.equity || 0) + (classPct.mutual_fund || 0) + (classPct.crypto || 0);
  const safetyPct = (classPct.fixed_income || 0) + (classPct.cash || 0);
  const cryptoPct = classPct.crypto || 0;
  const equityPct = (classPct.equity || 0) + (classPct.mutual_fund || 0);
  const realAssetsPct = (classPct.commodities || 0) + (classPct.real_estate || 0);

  const avgReturn =
    investments.reduce((s, i) => s + i.annualReturn * (i.price * i.shares), 0) / totalValue;
  const positiveRatio = investments.filter((i) => i.annualReturn > 0).length / investments.length;
  const numHoldings = investments.length;

  // Diversification: class count + balance entropy
  const classCountScore = numClasses / 7;
  const entropy = numClasses > 1
    ? Object.values(classPct).reduce((s, p) => {
        const n = p / 100;
        return n > 0 ? s - n * Math.log(n) : s;
      }, 0) / Math.log(numClasses)
    : 0;
  const diversificationScore = classCountScore * 0.5 + Math.min(entropy, 1) * 0.5;

  // Tech holdings: tickers and fund names
  const TECH_TICKERS = ['NVDA', 'TSLA', 'USTECH', 'QQQ', 'QN100', 'MSFT', 'AAPL', 'GOOGL'];
  const techPct = investments
    .filter(
      (inv) =>
        TECH_TICKERS.includes(inv.ticker) ||
        inv.name.toLowerCase().includes('tech') ||
        inv.name.toLowerCase().includes('nasdaq') ||
        inv.name.toLowerCase().includes('ai')
    )
    .reduce((s, inv) => s + ((inv.price * inv.shares) / totalValue) * 100, 0);

  return {
    totalValue, classPct, numClasses, maxClassPct, maxClassKey,
    weightedRisk, growthPct, safetyPct, cryptoPct, equityPct, realAssetsPct,
    techPct, avgReturn, positiveRatio, numHoldings, diversificationScore,
  };
}

// ─── Archetype scoring ───────────────────────────────────────────────────────
function scoreArchetypes(m: PortfolioMetrics): Record<ArchetypeId, number> {
  const s: Record<ArchetypeId, number> = {
    builder: 0, protector: 0, optimist: 0,
    explorer: 0, collector: 0, opportunist: 0, visionary: 0,
  };

  // Builder — balanced diversification, moderate risk
  s.builder += m.diversificationScore * 80;
  s.builder += m.numClasses >= 4 ? 30 : m.numClasses * 6;
  s.builder += m.weightedRisk >= 3 && m.weightedRisk <= 7 ? 25 : 0;
  s.builder += m.growthPct > 20 && m.safetyPct > 10 ? 20 : 0;

  // Protector — high safety, low risk
  s.protector += m.safetyPct * 1.5;
  s.protector += (10 - m.weightedRisk) * 6;
  s.protector -= m.cryptoPct * 0.6;
  s.protector -= m.growthPct * 0.2;

  // Optimist — equity heavy, positive returns, moderate-high risk
  s.optimist += m.equityPct * 1.3;
  s.optimist += m.avgReturn > 10 ? 30 : m.avgReturn * 2;
  s.optimist += m.weightedRisk >= 4 && m.weightedRisk <= 8 ? 20 : 0;
  s.optimist += m.positiveRatio > 0.7 ? 25 : 0;
  s.optimist -= m.safetyPct * 0.4;

  // Explorer — crypto heavy, very high risk
  s.explorer += m.cryptoPct * 2.8;
  s.explorer += m.weightedRisk > 7 ? 45 : 0;
  s.explorer += m.weightedRisk > 8.5 ? 30 : 0;
  s.explorer -= m.safetyPct * 0.7;

  // Collector — many classes, high diversity
  s.collector += m.numClasses * 12;
  s.collector += m.diversificationScore * 55;
  s.collector += m.numHoldings >= 10 ? 25 : 0;
  s.collector += m.realAssetsPct > 5 && m.cryptoPct > 1 ? 20 : 0;

  // Opportunist — concentrated, aggressive
  s.opportunist += m.maxClassPct > 55 ? (m.maxClassPct - 40) * 1.5 : 0;
  s.opportunist += m.weightedRisk > 6 ? 20 : 0;
  s.opportunist += m.numHoldings < 8 ? 25 : 0;
  s.opportunist -= m.diversificationScore * 25;

  // Visionary — tech heavy, innovation focus
  s.visionary += m.techPct * 2.2;
  s.visionary += m.weightedRisk > 6 ? 15 : 0;
  s.visionary += m.avgReturn > 15 ? 20 : 0;
  s.visionary += m.cryptoPct > 5 ? 15 : 0; // digital assets overlap

  // Clamp negatives to 0
  (Object.keys(s) as ArchetypeId[]).forEach((k) => { s[k] = Math.max(0, s[k]); });

  return s;
}

// ─── Observations ("What does your portfolio say about you?") ────────────────
function generateObservations(m: PortfolioMetrics): PortfolioObservation[] {
  const obs: PortfolioObservation[] = [];

  if (m.weightedRisk > 7.5) {
    obs.push({
      headline: 'You are taking above-average risk',
      detail: `Your portfolio's weighted risk score is ${m.weightedRisk.toFixed(1)}/10 — well above the typical balanced investor at ~5. In a market downturn, your portfolio could swing dramatically. That is the price of asymmetric upside.`,
      severity: 'warning',
      icon: '⚠️',
    });
  } else if (m.weightedRisk < 3.5) {
    obs.push({
      headline: 'Your portfolio is built like a bunker',
      detail: `A weighted risk score of ${m.weightedRisk.toFixed(1)}/10 suggests extreme conservatism. You are well protected from losses, but over a long horizon, this approach may struggle to outpace inflation.`,
      severity: 'info',
      icon: '🔒',
    });
  }

  if (m.cryptoPct > 25) {
    obs.push({
      headline: 'Crypto dominates your risk budget',
      detail: `${m.cryptoPct.toFixed(1)}% of your portfolio is in digital assets. One bad crypto winter could dent your overall net worth significantly. This is a high-conviction bet — make sure it is intentional.`,
      severity: 'warning',
      icon: '🪙',
    });
  } else if (m.cryptoPct > 8) {
    obs.push({
      headline: 'You have embraced the digital asset revolution',
      detail: `Your ${m.cryptoPct.toFixed(1)}% crypto allocation adds powerful asymmetric upside without overexposing the portfolio. It is the right amount of chaos.`,
      severity: 'positive',
      icon: '🚀',
    });
  }

  if (m.maxClassPct > 55) {
    const label = ASSET_CLASS_DETAILS[m.maxClassKey]?.label ?? m.maxClassKey;
    obs.push({
      headline: `Your portfolio depends heavily on ${label}`,
      detail: `${m.maxClassPct.toFixed(1)}% is concentrated in a single asset class. If ${label} underperforms for a cycle, it will drag everything down. Ask yourself: is this a deliberate conviction or an accidental blind spot?`,
      severity: 'warning',
      icon: '📊',
    });
  }

  if (m.diversificationScore > 0.72 && m.numClasses >= 5) {
    obs.push({
      headline: 'Your diversification is genuinely impressive',
      detail: `You span ${m.numClasses} asset classes with a healthy spread. This kind of construction tends to weather economic cycles far better than single-theme bets — and it is rare.`,
      severity: 'positive',
      icon: '🏆',
    });
  } else if (m.numClasses <= 2) {
    obs.push({
      headline: 'You could benefit from broader diversification',
      detail: `With only ${m.numClasses} asset class${m.numClasses === 1 ? '' : 'es'}, you have limited buffers against sector shocks. Adding even one uncorrelated class — say gold or bonds — could reduce volatility meaningfully.`,
      severity: 'info',
      icon: '🌐',
    });
  }

  if (m.safetyPct > 40) {
    obs.push({
      headline: 'You seem to prefer consistency over growth',
      detail: `${m.safetyPct.toFixed(1)}% of your portfolio is in bonds and cash. This is a deliberate choice for stability — but over a long horizon, it may leave significant compound growth on the table.`,
      severity: 'info',
      icon: '⚖️',
    });
  } else if (m.safetyPct < 8 && m.totalValue > 30000) {
    obs.push({
      headline: 'You have almost no defensive cushion',
      detail: `Less than 8% in safe assets means you have very little dry powder for a market crash. You cannot deploy capital at discounted prices if all of it is already fully invested.`,
      severity: 'warning',
      icon: '🛡️',
    });
  }

  if (m.techPct > 35) {
    obs.push({
      headline: 'You are betting heavily on technology',
      detail: `Around ${m.techPct.toFixed(1)}% of your portfolio is tied to the tech sector. Technology has been the dominant wealth creator of the past decade — but sector concentration is a double-edged sword.`,
      severity: 'info',
      icon: '💻',
    });
  }

  if (m.avgReturn > 20) {
    obs.push({
      headline: 'Your return targets are highly ambitious',
      detail: `Your portfolio targets ${m.avgReturn.toFixed(1)}% annual returns on average — well above market benchmarks. This suggests high confidence in your picks, and a willingness to accept the volatility that comes with it.`,
      severity: 'positive',
      icon: '📈',
    });
  } else if (m.avgReturn < 8 && m.weightedRisk > 5) {
    obs.push({
      headline: 'Your risk-return ratio looks misaligned',
      detail: `You are taking moderate-to-high risk but targeting only ${m.avgReturn.toFixed(1)}% returns. Higher-risk portfolios should demand proportionally higher return expectations to justify the added volatility.`,
      severity: 'warning',
      icon: '📉',
    });
  }

  if (m.numHoldings >= 14) {
    obs.push({
      headline: `You are managing a well-stocked portfolio of ${m.numHoldings} assets`,
      detail: `Broad coverage reduces single-position risk — but it can also dilute your highest-conviction bets. Consider asking: does every holding truly earn its seat at the table?`,
      severity: 'neutral',
      icon: '🗂️',
    });
  }

  return obs.slice(0, 5);
}

// ─── Influencing factors ─────────────────────────────────────────────────────
function generateInfluencingFactors(archetype: Archetype, m: PortfolioMetrics): InfluencingFactor[] {
  switch (archetype.id) {
    case 'builder':
      return [
        { label: 'Asset Class Breadth', description: `${m.numClasses} of 7 classes covered`, weight: m.numClasses / 7, positive: true },
        { label: 'Balanced Risk', description: `Weighted risk ${m.weightedRisk.toFixed(1)}/10 — in the sweet spot`, weight: Math.max(0, 1 - Math.abs(m.weightedRisk - 5.5) / 5), positive: true },
        { label: 'Growth + Safety Mix', description: `${m.growthPct.toFixed(1)}% growth, ${m.safetyPct.toFixed(1)}% safety`, weight: 0.72, positive: true },
      ];
    case 'protector':
      return [
        { label: 'Safety Allocation', description: `${m.safetyPct.toFixed(1)}% in bonds & cash`, weight: Math.min(m.safetyPct / 65, 1), positive: true },
        { label: 'Conservative Risk Score', description: `Risk score ${m.weightedRisk.toFixed(1)}/10`, weight: (10 - m.weightedRisk) / 10, positive: true },
        { label: 'Minimal Speculation', description: `Only ${m.cryptoPct.toFixed(1)}% crypto exposure`, weight: Math.max(0, (20 - m.cryptoPct) / 20), positive: true },
      ];
    case 'optimist':
      return [
        { label: 'Equity Conviction', description: `${m.equityPct.toFixed(1)}% in stocks & funds`, weight: Math.min(m.equityPct / 80, 1), positive: true },
        { label: 'Return Target', description: `${m.avgReturn.toFixed(1)}% average expected return`, weight: Math.min(m.avgReturn / 28, 1), positive: true },
        { label: 'Positive Win Rate', description: `${Math.round(m.positiveRatio * 100)}% of holdings in profit`, weight: m.positiveRatio, positive: true },
      ];
    case 'explorer':
      return [
        { label: 'Crypto Exposure', description: `${m.cryptoPct.toFixed(1)}% in digital assets`, weight: Math.min(m.cryptoPct / 45, 1), positive: true },
        { label: 'High Risk Appetite', description: `Risk score ${m.weightedRisk.toFixed(1)}/10`, weight: m.weightedRisk / 10, positive: true },
        { label: 'Speculative Conviction', description: `${m.growthPct.toFixed(1)}% in growth & frontier assets`, weight: Math.min(m.growthPct / 90, 1), positive: true },
      ];
    case 'collector':
      return [
        { label: 'Class Coverage', description: `${m.numClasses}/7 distinct asset classes`, weight: m.numClasses / 7, positive: true },
        { label: 'Diversification Score', description: `${(m.diversificationScore * 100).toFixed(0)}% diversification quality`, weight: m.diversificationScore, positive: true },
        { label: 'Holdings Count', description: `${m.numHoldings} individual positions`, weight: Math.min(m.numHoldings / 18, 1), positive: true },
      ];
    case 'opportunist':
      return [
        { label: 'Concentration Level', description: `Top class = ${m.maxClassPct.toFixed(1)}% of portfolio`, weight: Math.min(m.maxClassPct / 85, 1), positive: true },
        { label: 'Risk Tolerance', description: `Risk score ${m.weightedRisk.toFixed(1)}/10`, weight: m.weightedRisk / 10, positive: true },
        { label: 'Focused Approach', description: `${m.numHoldings} holdings vs. typical ~15+`, weight: Math.max(0, (15 - m.numHoldings) / 15), positive: true },
      ];
    case 'visionary':
      return [
        { label: 'Tech Allocation', description: `${m.techPct.toFixed(1)}% in technology`, weight: Math.min(m.techPct / 55, 1), positive: true },
        { label: 'Growth Asset Bias', description: `${m.growthPct.toFixed(1)}% in growth assets`, weight: Math.min(m.growthPct / 85, 1), positive: true },
        { label: 'Innovation Premium', description: `${m.avgReturn.toFixed(1)}% target annual return`, weight: Math.min(m.avgReturn / 35, 1), positive: true },
      ];
  }
}

// ─── Dimension bars ──────────────────────────────────────────────────────────
function generateDimensions(m: PortfolioMetrics): DimensionScore[] {
  return [
    {
      label: 'Risk Appetite',
      score: Math.round(m.weightedRisk * 10),
      description: `Risk score ${m.weightedRisk.toFixed(1)}/10`,
    },
    {
      label: 'Growth Focus',
      score: Math.round(Math.min(m.growthPct, 100)),
      description: `${m.growthPct.toFixed(1)}% in growth assets`,
    },
    {
      label: 'Safety Bias',
      score: Math.round(Math.min(m.safetyPct, 100)),
      description: `${m.safetyPct.toFixed(1)}% in defensive assets`,
    },
    {
      label: 'Diversification',
      score: Math.round(m.diversificationScore * 100),
      description: `Spanning ${m.numClasses} asset classes`,
    },
    {
      label: 'Innovation Tilt',
      score: Math.round(Math.min((m.cryptoPct + m.techPct) / 1.3, 100)),
      description: `${(m.cryptoPct + m.techPct).toFixed(1)}% in frontier assets`,
    },
  ];
}

// ─── Main export ─────────────────────────────────────────────────────────────
export function classifyPortfolio(investments: Investment[]): ArchetypeResult | null {
  const metrics = computePortfolioMetrics(investments);
  if (!metrics) return null;

  const rawScores = scoreArchetypes(metrics);
  const sorted = (Object.entries(rawScores) as [ArchetypeId, number][]).sort((a, b) => b[1] - a[1]);
  const [topId, topScore] = sorted[0];

  const totalScore = Object.values(rawScores).reduce((a, b) => a + b, 0);
  const rawConfidence = totalScore > 0 ? (topScore / totalScore) * 100 * 1.5 : 50;
  const confidence = Math.min(Math.max(Math.round(rawConfidence), 44), 89);

  const archetype = ARCHETYPES[topId];

  return {
    archetype,
    confidence,
    scores: rawScores,
    influencingFactors: generateInfluencingFactors(archetype, metrics),
    observations: generateObservations(metrics),
    dimensions: generateDimensions(metrics),
  };
}
