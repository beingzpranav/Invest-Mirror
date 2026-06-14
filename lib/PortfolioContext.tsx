'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { Investment, AssetClass } from './types';
import { generateHistoricalPrices } from './data';

// ─── Default seed portfolio (user can delete / extend) ─────────────────────
const DEFAULT_PORTFOLIO: Investment[] = [
  {
    id: 'i1',
    name: 'Nifty 50 Index Fund',
    ticker: 'NIFTY50',
    assetClass: 'mutual_fund',
    price: 52.0,
    shares: 1100,
    costBasis: 46.0,
    riskScore: 5,
    annualReturn: 13.8,
    investmentDate: '2023-08-14',
    observations: ['Core portfolio equity ballast.', 'Tracks top 50 domestic companies.', 'Excellent compounder.'],
    historicalPrices: generateHistoricalPrices('NIFTY50', 52, 0.035, 0.001),
  },
  {
    id: 'i2',
    name: 'SBI Small Cap Fund',
    ticker: 'SBISML',
    assetClass: 'mutual_fund',
    price: 135.2,
    shares: 150,
    costBasis: 112.0,
    riskScore: 7,
    annualReturn: 21.4,
    investmentDate: '2024-03-20',
    observations: ['Growth booster via small-caps.', 'Managed by robust small-cap fund managers.', 'High variance offset by long-term holding period.'],
    historicalPrices: generateHistoricalPrices('SBISML', 135.2, 0.07, 0.003),
  },
  {
    id: 'i3',
    name: 'Gold ETF',
    ticker: 'GOLDETF',
    assetClass: 'commodities',
    price: 215.4,
    shares: 80,
    costBasis: 192.0,
    riskScore: 3,
    annualReturn: 11.8,
    investmentDate: '2023-11-12',
    observations: ['Acts as safe haven asset.', 'Optimal allocation for diversification.', 'Improves Sharpe ratio of the total portfolio.'],
    historicalPrices: generateHistoricalPrices('GOLDETF', 215.4, 0.025, 0.001),
  },
  {
    id: 'i4',
    name: 'Fixed Deposit',
    ticker: 'FD',
    assetClass: 'cash',
    price: 1.0,
    shares: 12000,
    costBasis: 1.0,
    riskScore: 1,
    annualReturn: 7.1,
    investmentDate: '2024-02-01',
    observations: ['Guaranteed cash reserve.', 'Allows quick deployment during market crashes.', 'Yield matches inflation base.'],
    historicalPrices: generateHistoricalPrices('FD', 1, 0.0, 0.0001),
  },
  {
    id: 'i5',
    name: 'US Tech Fund',
    ticker: 'USTECH',
    assetClass: 'mutual_fund',
    price: 188.5,
    shares: 110,
    costBasis: 152.0,
    riskScore: 7,
    annualReturn: 24.2,
    investmentDate: '2024-01-10',
    observations: ['US technology sector growth play.', 'Strong digital thematic exposure.', 'Moderate allocation to balance global assets.'],
    historicalPrices: generateHistoricalPrices('USTECH', 188.5, 0.08, 0.003),
  },
  {
    id: 'i6',
    name: 'Government Bonds',
    ticker: 'GOVBOND',
    assetClass: 'fixed_income',
    price: 100.0,
    shares: 150,
    costBasis: 100.0,
    riskScore: 2,
    annualReturn: 6.7,
    investmentDate: '2023-10-25',
    observations: ['Riskless bond buffer.', 'Stable income generation.', 'Counter-weight to aggressive equity assets.'],
    historicalPrices: generateHistoricalPrices('GOVBOND', 100, 0.01, 0.0001),
  },
  {
    id: 'i7',
    name: 'HDFC Bank Ltd.',
    ticker: 'HDFCBANK',
    assetClass: 'equity',
    price: 1620.0,
    shares: 10,
    costBasis: 1540.0,
    riskScore: 4,
    annualReturn: 5.8,
    investmentDate: '2024-02-15',
    observations: ['Financial sector anchor.', 'Steady business model and index heavyweight.', 'Relatively low volatility equity.'],
    historicalPrices: generateHistoricalPrices('HDFCBANK', 1620, 0.03, 0.0002),
  },
  {
    id: 'i8',
    name: 'Reliance Industries',
    ticker: 'RELIANCE',
    assetClass: 'equity',
    price: 2850.0,
    shares: 7,
    costBasis: 2450.0,
    riskScore: 4,
    annualReturn: 13.2,
    investmentDate: '2024-03-02',
    observations: ['Diversified industrial leader.', 'Consistent market tracking return.', 'Strong balance sheet support.'],
    historicalPrices: generateHistoricalPrices('RELIANCE', 2850, 0.035, 0.0008),
  },
  {
    id: 'i9',
    name: 'Bitcoin',
    ticker: 'BTC',
    assetClass: 'crypto',
    price: 68500.0,
    shares: 0.14,
    costBasis: 52000.0,
    riskScore: 9,
    annualReturn: 42.4,
    investmentDate: '2023-12-10',
    observations: ['Satellite crypto allocation.', 'Asymmetric growth option.', 'Capped size reduces portfolio damage during crypto winters.'],
    historicalPrices: generateHistoricalPrices('BTC', 68500, 0.09, 0.006),
  },
  {
    id: 'i10',
    name: 'Ethereum',
    ticker: 'ETH',
    assetClass: 'crypto',
    price: 3450.0,
    shares: 1.2,
    costBasis: 2800.0,
    riskScore: 9,
    annualReturn: 34.6,
    investmentDate: '2024-01-05',
    observations: ['Web3 infrastructure play.', 'Low relative allocation.', 'Complements the Bitcoin holding.'],
    historicalPrices: generateHistoricalPrices('ETH', 3450, 0.10, 0.005),
  },
  {
    id: 'i11',
    name: 'Tata Motors Ltd.',
    ticker: 'TATAMOT',
    assetClass: 'equity',
    price: 920.0,
    shares: 15,
    costBasis: 720.0,
    riskScore: 6,
    annualReturn: 29.5,
    investmentDate: '2024-02-28',
    observations: ['Cyclical EV sector exposure.', 'Adds alpha to index equities.', 'Moderate risk parameters.'],
    historicalPrices: generateHistoricalPrices('TATAMOT', 920, 0.06, 0.002),
  },
  {
    id: 'i12',
    name: 'Corporate Debt Fund',
    ticker: 'CORPDEBT',
    assetClass: 'fixed_income',
    price: 12.5,
    shares: 800,
    costBasis: 12.1,
    riskScore: 3,
    annualReturn: 8.1,
    investmentDate: '2024-04-15',
    observations: ['Stable corporate bond exposures.', 'Provides quarterly cash interest.', 'Highly liquid.'],
    historicalPrices: generateHistoricalPrices('CORPDEBT', 12.5, 0.015, 0.0002),
  },
  {
    id: 'i13',
    name: 'Public Provident Fund',
    ticker: 'PPF',
    assetClass: 'fixed_income',
    price: 1.0,
    shares: 6000,
    costBasis: 1.0,
    riskScore: 1,
    annualReturn: 7.1,
    investmentDate: '2023-04-05',
    observations: ['Guaranteed long term tax free interest.', 'Locks capital away from impulsive moves.', 'Sovereign guaranteed.'],
    historicalPrices: generateHistoricalPrices('PPF', 1, 0.0, 0.00015),
  },
  {
    id: 'i14',
    name: 'Nasdaq 100 ETF',
    ticker: 'QQQ',
    assetClass: 'equity',
    price: 440.0,
    shares: 25,
    costBasis: 390.0,
    riskScore: 6,
    annualReturn: 18.2,
    investmentDate: '2024-03-12',
    observations: ['Provides global growth equity coverage.', 'Mainly large-cap tech companies.', 'Provides currency depreciation offset.'],
    historicalPrices: generateHistoricalPrices('QQQ', 440, 0.045, 0.002),
  },
  {
    id: 'i15',
    name: 'REIT Office Trust',
    ticker: 'REIT',
    assetClass: 'real_estate',
    price: 88.0,
    shares: 90,
    costBasis: 84.0,
    riskScore: 5,
    annualReturn: 8.3,
    investmentDate: '2024-05-20',
    observations: ['Commercial property rental yields.', 'Low correlation with general stock indices.', 'Solid dividend distributor.'],
    historicalPrices: generateHistoricalPrices('REIT', 88, 0.045, 0.0002),
  },
  {
    id: 'i16',
    name: 'NVIDIA Corp.',
    ticker: 'NVDA',
    assetClass: 'equity',
    price: 128.5,
    shares: 50,
    costBasis: 80.0,
    riskScore: 9,
    annualReturn: 62.4,
    investmentDate: '2024-04-10',
    observations: ['AI hardware infrastructure catalyst.', 'High profit margins, but subject to chip cycle fluctuations.', 'Significant valuation premiums currently present.'],
    historicalPrices: generateHistoricalPrices('NVDA', 128.5, 0.11, 0.012),
  },
];

// ─── Predefined Portfolios for 4 Distinct Behavioral Archetypes ──────────────
const PORTFOLIO_USER1: Investment[] = [
  {
    id: 'u1_1',
    name: 'Bitcoin',
    ticker: 'BTC',
    assetClass: 'crypto',
    price: 68500.0,
    shares: 0.35,
    costBasis: 52000.0,
    riskScore: 9,
    annualReturn: 42.4,
    investmentDate: '2023-12-10',
    observations: ['Satellite crypto allocation.', 'Asymmetric growth option.', 'Capped size reduces portfolio damage during crypto winters.'],
    historicalPrices: generateHistoricalPrices('BTC', 68500, 0.09, 0.006),
  },
  {
    id: 'u1_2',
    name: 'Ethereum',
    ticker: 'ETH',
    assetClass: 'crypto',
    price: 3450.0,
    shares: 2.8,
    costBasis: 2800.0,
    riskScore: 9,
    annualReturn: 34.6,
    investmentDate: '2024-01-05',
    observations: ['Web3 infrastructure play.', 'Low relative allocation.', 'Complements the Bitcoin holding.'],
    historicalPrices: generateHistoricalPrices('ETH', 3450, 0.10, 0.005),
  },
  {
    id: 'u1_3',
    name: 'NVIDIA Corp.',
    ticker: 'NVDA',
    assetClass: 'equity',
    price: 128.5,
    shares: 80,
    costBasis: 80.0,
    riskScore: 9,
    annualReturn: 62.4,
    investmentDate: '2024-04-10',
    observations: ['AI hardware infrastructure catalyst.', 'High profit margins, but subject to chip cycle fluctuations.', 'Significant valuation premiums currently present.'],
    historicalPrices: generateHistoricalPrices('NVDA', 128.5, 0.11, 0.012),
  },
  {
    id: 'u1_4',
    name: 'Tesla Inc.',
    ticker: 'TSLA',
    assetClass: 'equity',
    price: 180.0,
    shares: 40,
    costBasis: 220.0,
    riskScore: 8,
    annualReturn: -15.4,
    investmentDate: '2024-02-18',
    observations: ['EV growth and robotics play.', 'High beta stock prone to emotional price action.', 'Currently under cost basis.'],
    historicalPrices: generateHistoricalPrices('TSLA', 180.0, 0.09, -0.001),
  },
  {
    id: 'u1_5',
    name: 'SBI Small Cap Fund',
    ticker: 'SBISML',
    assetClass: 'mutual_fund',
    price: 135.2,
    shares: 100,
    costBasis: 112.0,
    riskScore: 7,
    annualReturn: 21.4,
    investmentDate: '2024-03-20',
    observations: ['Growth booster via small-caps.', 'Managed by robust small-cap fund managers.', 'High variance offset by long-term holding period.'],
    historicalPrices: generateHistoricalPrices('SBISML', 135.2, 0.07, 0.003),
  }
];

const PORTFOLIO_USER2: Investment[] = [
  {
    id: 'u2_1',
    name: 'Government Bonds',
    ticker: 'GOVBOND',
    assetClass: 'fixed_income',
    price: 100.0,
    shares: 350,
    costBasis: 100.0,
    riskScore: 2,
    annualReturn: 6.7,
    investmentDate: '2023-10-25',
    observations: ['Riskless bond buffer.', 'Stable income generation.', 'Counter-weight to aggressive equity assets.'],
    historicalPrices: generateHistoricalPrices('GOVBOND', 100, 0.01, 0.0001),
  },
  {
    id: 'u2_2',
    name: 'Fixed Deposit',
    ticker: 'FD',
    assetClass: 'cash',
    price: 1.0,
    shares: 32000,
    costBasis: 1.0,
    riskScore: 1,
    annualReturn: 7.1,
    investmentDate: '2024-02-01',
    observations: ['Guaranteed cash reserve.', 'Allows quick deployment during market crashes.', 'Yield matches inflation base.'],
    historicalPrices: generateHistoricalPrices('FD', 1, 0.0, 0.0001),
  },
  {
    id: 'u2_3',
    name: 'Public Provident Fund',
    ticker: 'PPF',
    assetClass: 'fixed_income',
    price: 1.0,
    shares: 22000,
    costBasis: 1.0,
    riskScore: 1,
    annualReturn: 7.1,
    investmentDate: '2023-04-05',
    observations: ['Guaranteed long term tax free interest.', 'Locks capital away from impulsive moves.', 'Sovereign guaranteed.'],
    historicalPrices: generateHistoricalPrices('PPF', 1, 0.0, 0.00015),
  },
  {
    id: 'u2_4',
    name: 'Gold ETF',
    ticker: 'GOLDETF',
    assetClass: 'commodities',
    price: 215.4,
    shares: 90,
    costBasis: 192.0,
    riskScore: 3,
    annualReturn: 11.8,
    investmentDate: '2023-11-12',
    observations: ['Acts as safe haven asset.', 'Optimal allocation for diversification.', 'Improves Sharpe ratio of the total portfolio.'],
    historicalPrices: generateHistoricalPrices('GOLDETF', 215.4, 0.025, 0.001),
  },
  {
    id: 'u2_5',
    name: 'Corporate Debt Fund',
    ticker: 'CORPDEBT',
    assetClass: 'fixed_income',
    price: 12.5,
    shares: 1000,
    costBasis: 12.1,
    riskScore: 3,
    annualReturn: 8.1,
    investmentDate: '2024-04-15',
    observations: ['Stable corporate bond exposures.', 'Provides quarterly cash interest.', 'Highly liquid.'],
    historicalPrices: generateHistoricalPrices('CORPDEBT', 12.5, 0.015, 0.0002),
  }
];

const PORTFOLIO_USER3: Investment[] = [
  {
    id: 'u3_1',
    name: 'Nifty 50 Index Fund',
    ticker: 'NIFTY50',
    assetClass: 'mutual_fund',
    price: 52.0,
    shares: 1000,
    costBasis: 46.0,
    riskScore: 5,
    annualReturn: 13.8,
    investmentDate: '2023-08-14',
    observations: ['Core portfolio equity ballast.', 'Tracks top 50 domestic companies.', 'Excellent compounder.'],
    historicalPrices: generateHistoricalPrices('NIFTY50', 52, 0.035, 0.001),
  },
  {
    id: 'u3_2',
    name: 'Nasdaq 100 ETF',
    ticker: 'QQQ',
    assetClass: 'equity',
    price: 440.0,
    shares: 40,
    costBasis: 390.0,
    riskScore: 6,
    annualReturn: 18.2,
    investmentDate: '2024-03-12',
    observations: ['Provides global growth equity coverage.', 'Mainly large-cap tech companies.', 'Provides currency depreciation offset.'],
    historicalPrices: generateHistoricalPrices('QQQ', 440, 0.045, 0.002),
  },
  {
    id: 'u3_3',
    name: 'US Tech Fund',
    ticker: 'USTECH',
    assetClass: 'mutual_fund',
    price: 188.5,
    shares: 100,
    costBasis: 152.0,
    riskScore: 7,
    annualReturn: 24.2,
    investmentDate: '2024-01-10',
    observations: ['US technology sector growth play.', 'Strong digital thematic exposure.', 'Moderate allocation to balance global assets.'],
    historicalPrices: generateHistoricalPrices('USTECH', 188.5, 0.08, 0.003),
  },
  {
    id: 'u3_4',
    name: 'Reliance Industries',
    ticker: 'RELIANCE',
    assetClass: 'equity',
    price: 2850.0,
    shares: 8,
    costBasis: 2450.0,
    riskScore: 4,
    annualReturn: 13.2,
    investmentDate: '2024-03-02',
    observations: ['Diversified industrial leader.', 'Consistent market tracking return.', 'Strong balance sheet support.'],
    historicalPrices: generateHistoricalPrices('RELIANCE', 2850, 0.035, 0.0008),
  },
  {
    id: 'u3_5',
    name: 'REIT Office Trust',
    ticker: 'REIT',
    assetClass: 'real_estate',
    price: 88.0,
    shares: 120,
    costBasis: 84.0,
    riskScore: 5,
    annualReturn: 8.3,
    investmentDate: '2024-05-20',
    observations: ['Commercial property rental yields.', 'Low correlation with general stock indices.', 'Solid dividend distributor.'],
    historicalPrices: generateHistoricalPrices('REIT', 88, 0.045, 0.0002),
  }
];

const PORTFOLIO_USER4: Investment[] = [
  {
    id: 'u4_1',
    name: 'NVIDIA Corp.',
    ticker: 'NVDA',
    assetClass: 'equity',
    price: 128.5,
    shares: 450,
    costBasis: 65.0,
    riskScore: 9,
    annualReturn: 62.4,
    investmentDate: '2024-04-10',
    observations: ['Concentrated tactical focus.', 'High alpha exposure.', 'Significant single-asset risk.'],
    historicalPrices: generateHistoricalPrices('NVDA', 128.5, 0.11, 0.012),
  },
  {
    id: 'u4_2',
    name: 'Fixed Deposit',
    ticker: 'FD',
    assetClass: 'cash',
    price: 1.0,
    shares: 5000,
    costBasis: 1.0,
    riskScore: 1,
    annualReturn: 7.1,
    investmentDate: '2024-02-01',
    observations: ['Guaranteed cash reserve.', 'Allows quick deployment during market crashes.', 'Yield matches inflation base.'],
    historicalPrices: generateHistoricalPrices('FD', 1, 0.0, 0.0001),
  }
];

// ─── Context types ──────────────────────────────────────────────────────────
export interface NewAssetForm {
  name: string;
  ticker: string;
  assetClass: AssetClass;
  price: string;
  shares: string;
  costBasis: string;
  riskScore: string;
  annualReturn: string;
  investmentDate: string;
}

interface PortfolioContextType {
  investments: Investment[];
  addInvestment: (form: NewAssetForm) => void;
  removeInvestment: (id: string) => void;
  isLoggedIn: boolean;
  login: (email: string, pass: string) => boolean;
  signup: (email: string, pass: string) => boolean;
  logout: () => void;
}

const PortfolioContext = createContext<PortfolioContextType>({
  investments: DEFAULT_PORTFOLIO,
  addInvestment: () => {},
  removeInvestment: () => {},
  isLoggedIn: false,
  login: () => false,
  signup: () => false,
  logout: () => {},
});

// ─── Provider ───────────────────────────────────────────────────────────────
export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [investments, setInvestments] = useState<Investment[]>(DEFAULT_PORTFOLIO);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('investmirror-user');
      const savedLogin = localStorage.getItem('investmirror-loggedin');
      
      let email = '';
      if (savedLogin === 'true' && savedUser) {
        setIsLoggedIn(true);
        setCurrentUser(savedUser);
        email = savedUser;
      }

      const portfolioKey = email ? `investmirror-portfolio-${email}` : 'investmirror-portfolio';
      const saved = localStorage.getItem(portfolioKey);
      if (saved) {
        const parsed = JSON.parse(saved) as Investment[];
        const restored = parsed.map((inv) => ({
          ...inv,
          historicalPrices: generateHistoricalPrices(inv.ticker, inv.price, 0.05, 0.001),
        }));
        setInvestments(restored);
      } else {
        if (email === 'user1@gmail.com') setInvestments(PORTFOLIO_USER1);
        else if (email === 'user2@gmail.com') setInvestments(PORTFOLIO_USER2);
        else if (email === 'user3@gmail.com') setInvestments(PORTFOLIO_USER3);
        else if (email === 'user4@gmail.com') setInvestments(PORTFOLIO_USER4);
        else {
          if (email) {
            setInvestments([]);
          } else {
            setInvestments(DEFAULT_PORTFOLIO);
          }
        }
      }
    } catch {
      // ignore parse errors
    }
    setHydrated(true);
  }, []);

  // Persist whenever investments change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    const portfolioKey = currentUser ? `investmirror-portfolio-${currentUser}` : 'investmirror-portfolio';
    const toSave = investments.map(({ historicalPrices: _hp, ...rest }) => rest);
    localStorage.setItem(portfolioKey, JSON.stringify(toSave));
  }, [investments, hydrated, currentUser]);

  const login = useCallback((email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Check predefined test users
    const isPredefined = ['user1@gmail.com', 'user2@gmail.com', 'user3@gmail.com', 'user4@gmail.com'].includes(cleanEmail);
    if (isPredefined && cleanPass !== 'user@1234') {
      return false; // Invalid password for test accounts
    }

    if (cleanPass.length < 6) {
      return false;
    }

    setIsLoggedIn(true);
    setCurrentUser(cleanEmail);
    localStorage.setItem('investmirror-loggedin', 'true');
    localStorage.setItem('investmirror-user', cleanEmail);

    // Load user-specific portfolio
    const portfolioKey = `investmirror-portfolio-${cleanEmail}`;
    const saved = localStorage.getItem(portfolioKey);
    if (saved) {
      const parsed = JSON.parse(saved) as Investment[];
      const restored = parsed.map((inv) => ({
        ...inv,
        historicalPrices: generateHistoricalPrices(inv.ticker, inv.price, 0.05, 0.001),
      }));
      setInvestments(restored);
    } else {
      if (cleanEmail === 'user1@gmail.com') setInvestments(PORTFOLIO_USER1);
      else if (cleanEmail === 'user2@gmail.com') setInvestments(PORTFOLIO_USER2);
      else if (cleanEmail === 'user3@gmail.com') setInvestments(PORTFOLIO_USER3);
      else if (cleanEmail === 'user4@gmail.com') setInvestments(PORTFOLIO_USER4);
      else setInvestments([]);
    }

    return true;
  }, []);

  const signup = useCallback((email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (cleanPass.length < 6) {
      return false;
    }

    setIsLoggedIn(true);
    setCurrentUser(cleanEmail);
    localStorage.setItem('investmirror-loggedin', 'true');
    localStorage.setItem('investmirror-user', cleanEmail);

    // For new signups, start with empty portfolio (0 assets)
    setInvestments([]);
    return true;
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('investmirror-loggedin');
    localStorage.removeItem('investmirror-user');
    setInvestments(DEFAULT_PORTFOLIO);
  }, []);

  const addInvestment = useCallback((form: NewAssetForm) => {
    const price = parseFloat(form.price) || 0;
    const shares = parseFloat(form.shares) || 0;
    const costBasis = parseFloat(form.costBasis) || price;
    const riskScore = Math.min(10, Math.max(1, parseInt(form.riskScore) || 5));
    const annualReturn = parseFloat(form.annualReturn) || 0;

    const newInv: Investment = {
      id: `custom_${Date.now()}`,
      name: form.name.trim(),
      ticker: form.ticker.trim().toUpperCase(),
      assetClass: form.assetClass,
      price,
      shares,
      costBasis,
      riskScore,
      annualReturn,
      investmentDate: form.investmentDate || new Date().toISOString().split('T')[0],
      observations: ['Manually added asset.', `Expected annual return: ${annualReturn}%.`, `Risk score: ${riskScore}/10.`],
      historicalPrices: generateHistoricalPrices(form.ticker, price, 0.04, annualReturn / 36500),
    };

    setInvestments((prev) => [newInv, ...prev]);
  }, []);

  const removeInvestment = useCallback((id: string) => {
    setInvestments((prev) => prev.filter((inv) => inv.id !== id));
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        investments,
        addInvestment,
        removeInvestment,
        isLoggedIn,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
