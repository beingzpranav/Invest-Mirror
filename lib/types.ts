export type AssetClass = 'equity' | 'fixed_income' | 'crypto' | 'real_estate' | 'commodities' | 'mutual_fund' | 'cash';

export type RiskLevel = 'low' | 'medium' | 'high' | 'speculative';

export interface HistoricalPoint {
  date: string;
  price: number;
}

export interface Investment {
  id: string;
  name: string;
  ticker: string;
  assetClass: AssetClass;
  price: number;
  shares: number;
  costBasis: number;
  riskScore: number; // 1 to 10 scale
  annualReturn: number; // e.g. 12.5%
  investmentDate: string; // YYYY-MM-DD
  observations: string[];
  historicalPrices: HistoricalPoint[];
}

export interface PersonalityTraits {
  risk: number;           // Risk Tolerance
  growth: number;         // Growth Focus
  diversification: number;// Portfolio Diversification
  discipline: number;     // Trading Discipline / Long-term Horizon
  activity: number;       // Trading Activity / Turnovers
}

export interface PersonalityArchetype {
  id: string;
  name: string;
  badge: string;
  description: string;
  traits: PersonalityTraits;
  strengths: string[];
  weaknesses: string[];
  bias: string;
  biasDescription: string;
  recommendation: string;
}

export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalGain: number;
  gainPercent: number;
  weightedRiskScore: number;
  personality: PersonalityArchetype;
}
