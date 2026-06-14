import { Investment, PersonalityArchetype } from './types';

export const PERSONALITY_ARCHETYPES: Record<string, PersonalityArchetype> = {
  maverick: {
    id: 'maverick',
    name: 'The Visionary Maverick',
    badge: 'Speculative Growth',
    description: 'You are attracted to high-growth, high-volatility digital assets and technology stocks. You embrace market disruption, possess a high stomach for risk, and look to stay ahead of the technology curve, even if it means weathering massive double-digit drawdowns.',
    traits: {
      risk: 9.2,
      growth: 9.5,
      diversification: 3.5,
      discipline: 5.5,
      activity: 8.0
    },
    strengths: [
      'High adaptability to emerging technologies and assets.',
      'Unfazed by short-term market corrections or volatility.',
      'Capable of capturing exponential gains on asymmetric bets.'
    ],
    weaknesses: [
      'Extremely high portfolio drawdown risk (up to 40%+).',
      'Over-concentration in a single sector (Tech & Crypto).',
      'Susceptibility to FOMO (Fear of Missing Out).'
    ],
    bias: 'Overconfidence & FOMO',
    biasDescription: 'A tendency to overestimate your ability to timing tech cycles, leading to buying near peaks due to social momentum, while ignoring underlying valuation fundamentals.',
    recommendation: 'Consider allocating 15-20% of your portfolio to low-beta fixed income or index ETFs to establish a solid liquidity floor, reducing overall drawdowns without sacrificing your core growth engine.'
  },
  guardian: {
    id: 'guardian',
    name: 'The Stoic Guardian',
    badge: 'Wealth Preservation',
    description: 'You prioritize capital preservation, inflation protection, and downside defense. Your portfolio is a fortress of stable bonds, defensive giants, and commodities. You value sleeping well at night far more than chasing the latest high-flying trends.',
    traits: {
      risk: 2.2,
      growth: 3.0,
      diversification: 8.5,
      discipline: 9.0,
      activity: 1.5
    },
    strengths: [
      'Extremely resilient during bear markets and recessionary phases.',
      'Low portfolio volatility and highly predictable cash flows.',
      'High psychological discipline, rarely panic-sells.'
    ],
    weaknesses: [
      'Struggles to keep up with inflation during prolonged economic expansions.',
      'Opportunity cost from avoiding secular growth trends.',
      'Under-exposure to high-margin digital businesses.'
    ],
    bias: 'Loss Aversion & Status Quo',
    biasDescription: 'The psychological pain of losing money is twice as powerful as the pleasure of gaining it. This keeps you locked in ultra-conservative assets, even when your financial horizon is long.',
    recommendation: 'Introduce a small allocation (e.g., 5-10%) to global large-cap equities or tech index funds. This adds inflation-beating compound power while keeping your risk profile comfortably within your boundaries.'
  },
  pathseeker: {
    id: 'pathseeker',
    name: 'The Harmony Pathseeker',
    badge: 'Balanced Growth',
    description: 'You represent the golden middle of investing. Your approach centers on asset-class diversification, balance, and methodical compounding. You seek to capture equity upside while cushioning shocks with bonds, real estate, and commodities.',
    traits: {
      risk: 5.5,
      growth: 6.2,
      diversification: 7.8,
      discipline: 8.5,
      activity: 3.0
    },
    strengths: [
      'Robust performance across all stages of the economic cycle.',
      'Optimal risk-adjusted return ratio (high Sharpe ratio potential).',
      'Low emotional trading; relies on systematic rebalancing.'
    ],
    weaknesses: [
      'Will rarely outperform the absolute top-performing asset class in a given year.',
      'Requires active rebalancing discipline to maintain target allocations.',
      'Can feel boring or stagnant during intense stock market rallies.'
    ],
    bias: 'Anchoring & Diversification Bias',
    biasDescription: 'A tendency to rely heavily on standard academic models (like the 60/40 split) without adjusting for shifts in macroeconomic regimes, or spreading capital too thin.',
    recommendation: 'Maintain your core strategy but reserve 3-5% of your portfolio for high-conviction thematic bets (like green energy, robotics, or cloud technology) to add a performance booster without derailing your balance.'
  }
};

// Generates 12 months of daily/weekly mock historical data for an investment
export const generateHistoricalPrices = (
  ticker: string,
  startPrice: number,
  volatility: number,
  drift: number,
  pointsCount: number = 60
): { date: string; price: number }[] => {
  const points: { date: string; price: number }[] = [];
  let currentPrice = startPrice;
  const now = new Date();

  for (let i = pointsCount - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 6 * 24 * 60 * 60 * 1000); // ~6-day intervals
    const change = currentPrice * volatility * (Math.random() - 0.48) + currentPrice * drift;
    currentPrice = Math.max(0.01, currentPrice + change);
    
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    points.push({
      date: formattedDate,
      price: Number(currentPrice.toFixed(2))
    });
  }

  // Ensure last point matches startPrice exactly
  if (points.length > 0) {
    points[points.length - 1].price = startPrice;
  }

  return points;
};

// Define standard investments (16 assets for each profile)
export const getPortfolioInvestments = (portfolioId: string): Investment[] => {
  switch (portfolioId) {
    case 'maverick':
      return [
        {
          id: 'm1',
          name: 'SBI Small Cap Fund',
          ticker: 'SBISML',
          assetClass: 'mutual_fund',
          price: 135.2,
          shares: 280,
          costBasis: 110.5,
          riskScore: 8,
          annualReturn: 24.8,
          investmentDate: '2024-05-12',
          observations: ['Captures rapid growth in small-cap companies.', 'High tracking error risk compensated by stellar historical returns.', 'Vulnerable to system-wide liquidity squeezes.'],
          historicalPrices: generateHistoricalPrices('SBISML', 135.2, 0.07, 0.003)
        },
        {
          id: 'm2',
          name: 'US Tech Fund',
          ticker: 'USTECH',
          assetClass: 'mutual_fund',
          price: 188.5,
          shares: 210,
          costBasis: 150.0,
          riskScore: 8,
          annualReturn: 28.5,
          investmentDate: '2024-03-18',
          observations: ['Highly leveraged on NASDAQ-100 megacaps.', 'Exposed to foreign exchange fluctuations.', 'Tech valuation multiples are currently trading at peak levels.'],
          historicalPrices: generateHistoricalPrices('USTECH', 188.5, 0.08, 0.004)
        },
        {
          id: 'm3',
          name: 'Bitcoin',
          ticker: 'BTC',
          assetClass: 'crypto',
          price: 68500.0,
          shares: 0.95,
          costBasis: 52000.0,
          riskScore: 10,
          annualReturn: 48.2,
          investmentDate: '2023-11-20',
          observations: ['Acts as a high-volatility tailwind.', 'Consumes a significant portion of portfolio volatility.', 'Hedge against traditional fiat debasement.'],
          historicalPrices: generateHistoricalPrices('BTC', 68500, 0.09, 0.006)
        },
        {
          id: 'm4',
          name: 'Ethereum',
          ticker: 'ETH',
          assetClass: 'crypto',
          price: 3450.0,
          shares: 8.5,
          costBasis: 2600.0,
          riskScore: 9,
          observations: ['Decentralized utility asset.', 'Higher beta/drawdowns relative to Bitcoin.', 'Staking yield offers minor passive cashflow.'],
          annualReturn: 38.6,
          investmentDate: '2024-01-15',
          historicalPrices: generateHistoricalPrices('ETH', 3450, 0.10, 0.005)
        },
        {
          id: 'm5',
          name: 'NVIDIA Corp.',
          ticker: 'NVDA',
          assetClass: 'equity',
          price: 128.5,
          shares: 310,
          costBasis: 80.0,
          riskScore: 9,
          annualReturn: 62.4,
          investmentDate: '2024-04-10',
          observations: ['AI hardware infrastructure catalyst.', 'High profit margins, but subject to chip cycle fluctuations.', 'Significant valuation premiums currently present.'],
          historicalPrices: generateHistoricalPrices('NVDA', 128.5, 0.11, 0.012)
        },
        {
          id: 'm6',
          name: 'Tesla Inc.',
          ticker: 'TSLA',
          assetClass: 'equity',
          price: 198.2,
          shares: 90,
          costBasis: 220.0,
          riskScore: 8,
          annualReturn: -9.5,
          investmentDate: '2024-02-05',
          observations: ['Automotive automation growth play.', 'Facing execution hurdles and high margin compression.', 'Extremely retail-sentiment driven.'],
          historicalPrices: generateHistoricalPrices('TSLA', 198.2, 0.10, -0.001)
        },
        {
          id: 'm7',
          name: 'Tata Motors Ltd.',
          ticker: 'TATAMOT',
          assetClass: 'equity',
          price: 920.0,
          shares: 45,
          costBasis: 680.0,
          riskScore: 7,
          annualReturn: 32.4,
          investmentDate: '2024-01-30',
          observations: ['Leading player in EV passenger vehicle market.', 'Strong commercial vehicle cycles driving revenue.', 'Improving corporate debt-to-equity ratio.'],
          historicalPrices: generateHistoricalPrices('TATAMOT', 920, 0.06, 0.002)
        },
        {
          id: 'm8',
          name: 'Nasdaq 100 ETF',
          ticker: 'QN100',
          assetClass: 'equity',
          price: 440.0,
          shares: 60,
          costBasis: 380.0,
          riskScore: 7,
          annualReturn: 21.0,
          investmentDate: '2024-02-12',
          observations: ['Broad US growth equity exposure.', 'Dominated by top 7 technology companies.', 'Diversification cushion against individual stock failures.'],
          historicalPrices: generateHistoricalPrices('QN100', 440, 0.045, 0.002)
        },
        {
          id: 'm9',
          name: 'Nifty 50 Index Fund',
          ticker: 'NIFTY50',
          assetClass: 'mutual_fund',
          price: 52.0,
          shares: 350,
          costBasis: 45.0,
          riskScore: 6,
          annualReturn: 15.2,
          investmentDate: '2024-06-01',
          observations: ['Cushions the speculative small-caps.', 'Tracks top 50 blue-chip Indian companies.', 'Highly liquid and low expense ratio.'],
          historicalPrices: generateHistoricalPrices('NIFTY50', 52, 0.035, 0.001)
        },
        {
          id: 'm10',
          name: 'Gold ETF',
          ticker: 'GOLDETF',
          assetClass: 'commodities',
          price: 215.4,
          shares: 20,
          costBasis: 185.0,
          riskScore: 3,
          annualReturn: 12.1,
          investmentDate: '2024-03-10',
          observations: ['Minimal capital allocation, acting purely as fallback.', 'No yield generated; relies solely on price hedging.', 'Negative correlation to equity during systemic panics.'],
          historicalPrices: generateHistoricalPrices('GOLDETF', 215.4, 0.025, 0.001)
        },
        {
          id: 'm11',
          name: 'HDFC Bank Ltd.',
          ticker: 'HDFCBANK',
          assetClass: 'equity',
          price: 1620.0,
          shares: 8,
          costBasis: 1550.0,
          riskScore: 5,
          observations: ['Stable banking giant to anchor the portfolio.', 'Lagging performance post-merger integration.', 'Strong structural loan growth.'],
          annualReturn: 5.4,
          investmentDate: '2024-04-20',
          historicalPrices: generateHistoricalPrices('HDFCBANK', 1620, 0.03, 0.0002)
        },
        {
          id: 'm12',
          name: 'Reliance Industries',
          ticker: 'RELIANCE',
          assetClass: 'equity',
          price: 2850.0,
          shares: 6,
          costBasis: 2400.0,
          riskScore: 5,
          observations: ['Energy and retail conglomerate balancing tech exposure.', 'Strong capital expenditure in telecom and green energy.', 'High weight in domestic indices.'],
          annualReturn: 14.1,
          investmentDate: '2024-03-25',
          historicalPrices: generateHistoricalPrices('RELIANCE', 2850, 0.035, 0.0008)
        },
        {
          id: 'm13',
          name: 'Clean Energy ETF',
          ticker: 'ICLN',
          assetClass: 'equity',
          price: 14.2,
          shares: 220,
          costBasis: 18.5,
          riskScore: 7,
          annualReturn: -22.5,
          investmentDate: '2024-01-20',
          observations: ['Thematic clean energy infrastructure bet.', 'Highly sensitive to rate hikes and capital funding costs.', 'Underperformed significantly due to supply chain challenges.'],
          historicalPrices: generateHistoricalPrices('ICLN', 14.2, 0.065, -0.0015)
        },
        {
          id: 'm14',
          name: 'REIT Office Trust',
          ticker: 'REITOFF',
          assetClass: 'real_estate',
          price: 88.0,
          shares: 30,
          costBasis: 85.0,
          riskScore: 6,
          annualReturn: 6.8,
          investmentDate: '2024-05-02',
          observations: ['Exposed to commercial real estate downturns.', 'Generates high dividend distributions.', 'Low growth profile but provides stable cash flow.'],
          historicalPrices: generateHistoricalPrices('REITOFF', 88, 0.045, 0.0002)
        },
        {
          id: 'm15',
          name: 'Fixed Deposit',
          ticker: 'FD_HIGH',
          assetClass: 'cash',
          price: 1.0,
          shares: 3000,
          costBasis: 1.0,
          riskScore: 1,
          observations: ['Absolute liquidity floor for panic reserves.', 'Guaranteed capital return.', 'Loses real value relative to CPI inflation.'],
          annualReturn: 7.2,
          investmentDate: '2025-01-01',
          historicalPrices: generateHistoricalPrices('FD_HIGH', 1, 0.0, 0.0001)
        },
        {
          id: 'm16',
          name: 'Government Bonds',
          ticker: 'GOV_BOND',
          assetClass: 'fixed_income',
          price: 100.0,
          shares: 25,
          costBasis: 100.0,
          riskScore: 2,
          observations: ['Sovereign backed security.', 'Pays semi-annual fixed coupons.', 'Exposed to yield curve shifts.'],
          annualReturn: 6.8,
          investmentDate: '2024-07-15',
          historicalPrices: generateHistoricalPrices('GOV_BOND', 100, 0.01, 0.0001)
        }
      ];

    case 'guardian':
      return [
        {
          id: 'g1',
          name: 'Fixed Deposit',
          ticker: 'FD_BANK',
          assetClass: 'cash',
          price: 1.0,
          shares: 32000,
          costBasis: 1.0,
          riskScore: 1,
          annualReturn: 7.3,
          investmentDate: '2024-01-10',
          observations: ['Safe guaranteed yield.', 'Zero capital variance.', 'Highly liquid deposit structure.'],
          historicalPrices: generateHistoricalPrices('FD_BANK', 1, 0.0, 0.0001)
        },
        {
          id: 'g2',
          name: 'Government Bonds',
          ticker: 'GOV_FORT',
          assetClass: 'fixed_income',
          price: 100.0,
          shares: 280,
          costBasis: 100.0,
          riskScore: 2,
          annualReturn: 6.9,
          investmentDate: '2023-12-15',
          observations: ['Sovereign backing ensures complete safety.', 'Semi-annual cash payouts.', 'Locks in long term yield.'],
          historicalPrices: generateHistoricalPrices('GOV_FORT', 100, 0.012, 0.0001)
        },
        {
          id: 'g3',
          name: 'Public Provident Fund',
          ticker: 'PPF_GOV',
          assetClass: 'fixed_income',
          price: 1.0,
          shares: 20000,
          costBasis: 1.0,
          riskScore: 1,
          annualReturn: 7.1,
          investmentDate: '2023-04-01',
          observations: ['Tax-exempt capital growth compounding.', 'Sovereign backed, zero default risk.', 'Long lock-in period buffers emotional trading.'],
          historicalPrices: generateHistoricalPrices('PPF_GOV', 1, 0.0, 0.00015)
        },
        {
          id: 'g4',
          name: 'Treasury Bills',
          ticker: 'T_BILLS',
          assetClass: 'fixed_income',
          price: 98.2,
          shares: 160,
          costBasis: 98.2,
          riskScore: 1,
          annualReturn: 5.9,
          investmentDate: '2024-06-10',
          observations: ['Short term cash equivalent.', 'Negligible default or interest rate risk.', 'Ideal for holding emergency funds.'],
          historicalPrices: generateHistoricalPrices('T_BILLS', 98.2, 0.005, 0.0001)
        },
        {
          id: 'g5',
          name: 'Gold ETF',
          ticker: 'GOLD_SAFE',
          assetClass: 'commodities',
          price: 215.4,
          shares: 110,
          costBasis: 190.0,
          riskScore: 3,
          annualReturn: 12.8,
          investmentDate: '2023-10-15',
          observations: ['Safe haven hedge during global currency expansion.', 'Stores value with zero credit risk.', 'High liquidity compared to physical gold.'],
          historicalPrices: generateHistoricalPrices('GOLD_SAFE', 215.4, 0.025, 0.001)
        },
        {
          id: 'g6',
          name: 'HDFC Bank Ltd.',
          ticker: 'HDFCBANK',
          assetClass: 'equity',
          price: 1620.0,
          shares: 12,
          costBasis: 1580.0,
          riskScore: 4,
          annualReturn: 5.6,
          investmentDate: '2024-02-20',
          observations: ['Diversified large-cap bank asset.', 'High capital safety and systemic importance.', 'Provides inflation beat potential over long-term.'],
          historicalPrices: generateHistoricalPrices('HDFCBANK', 1620, 0.03, 0.0002)
        },
        {
          id: 'g7',
          name: 'Nifty 50 Index Fund',
          ticker: 'NIFTY50',
          assetClass: 'mutual_fund',
          price: 52.0,
          shares: 380,
          costBasis: 46.0,
          riskScore: 5,
          annualReturn: 13.5,
          investmentDate: '2023-09-18',
          observations: ['Anchors equity returns with minimal single-firm risk.', 'Tracks economic growth of India.', 'Consistent long-term compounding.'],
          historicalPrices: generateHistoricalPrices('NIFTY50', 52, 0.035, 0.001)
        },
        {
          id: 'g8',
          name: 'Corporate Debt Fund',
          ticker: 'CORPDEBT',
          assetClass: 'fixed_income',
          price: 12.5,
          shares: 1200,
          costBasis: 12.0,
          riskScore: 3,
          annualReturn: 8.4,
          investmentDate: '2024-03-05',
          observations: ['High quality corporate credit exposure.', 'Better yield than government paper with minimal risk.', 'Liquid asset class.'],
          historicalPrices: generateHistoricalPrices('CORPDEBT', 12.5, 0.015, 0.0002)
        },
        {
          id: 'g9',
          name: 'Reliance Industries',
          ticker: 'RELIANCE',
          assetClass: 'equity',
          price: 2850.0,
          shares: 6,
          costBasis: 2500.0,
          riskScore: 4,
          annualReturn: 11.2,
          investmentDate: '2024-04-12',
          observations: ['Defensive blue chip equity profile.', 'Reliable cash generation from energy business.', 'High weight in domestic market capitalization.'],
          historicalPrices: generateHistoricalPrices('RELIANCE', 2850, 0.035, 0.0008)
        },
        {
          id: 'g10',
          name: 'Vanguard S&P 500 ETF',
          ticker: 'VOO',
          assetClass: 'equity',
          price: 490.0,
          shares: 15,
          costBasis: 410.0,
          riskScore: 5,
          annualReturn: 16.1,
          investmentDate: '2023-11-05',
          observations: ['Captures earnings of the top 500 global giants.', 'Provides international currency hedge.', 'High long-term performance stability.'],
          historicalPrices: generateHistoricalPrices('VOO', 490, 0.038, 0.001)
        },
        {
          id: 'g11',
          name: 'Silver ETF',
          ticker: 'SLV',
          assetClass: 'commodities',
          price: 74.0,
          shares: 80,
          costBasis: 68.0,
          riskScore: 4,
          annualReturn: 9.1,
          investmentDate: '2024-05-18',
          observations: ['Industrial demand commodity play.', 'Higher volatility than gold.', 'Diversifies metal holdings.'],
          historicalPrices: generateHistoricalPrices('SLV', 74, 0.045, 0.0005)
        },
        {
          id: 'g12',
          name: 'US Tech Fund',
          ticker: 'USTECH',
          assetClass: 'mutual_fund',
          price: 188.5,
          shares: 18,
          costBasis: 165.0,
          riskScore: 7,
          annualReturn: 19.4,
          investmentDate: '2024-06-01',
          observations: ['Small satellite allocation to tech sectors.', 'Adds growth juice without compromising base bonds.', 'Volatile but limited to small weight.'],
          historicalPrices: generateHistoricalPrices('USTECH', 188.5, 0.08, 0.002)
        },
        {
          id: 'g13',
          name: 'SBI Small Cap Fund',
          ticker: 'SBISML',
          assetClass: 'mutual_fund',
          price: 135.2,
          shares: 20,
          costBasis: 125.0,
          riskScore: 7,
          annualReturn: 14.5,
          investmentDate: '2024-07-02',
          observations: ['Minute satellite allocation to high beta equities.', 'Exposed to major volatility.', 'Long term compounding vehicle.'],
          historicalPrices: generateHistoricalPrices('SBISML', 135.2, 0.07, 0.001)
        },
        {
          id: 'g14',
          name: 'Bitcoin',
          ticker: 'BTC',
          assetClass: 'crypto',
          price: 68500.0,
          shares: 0.02,
          costBasis: 55000.0,
          riskScore: 9,
          annualReturn: 45.1,
          investmentDate: '2023-12-01',
          observations: ['Speculative placeholder for asymmetric hedge.', 'Extremely minor allocation.', 'High volatility exposure.'],
          historicalPrices: generateHistoricalPrices('BTC', 68500, 0.09, 0.006)
        },
        {
          id: 'g15',
          name: 'Ethereum',
          ticker: 'ETH',
          assetClass: 'crypto',
          price: 3450.0,
          shares: 0.15,
          costBasis: 2900.0,
          riskScore: 9,
          annualReturn: 52.0,
          investmentDate: '2024-01-20',
          observations: ['Small crypto utility placeholder.', 'Provides web3 industry tracker.', 'Extreme risk profile.'],
          historicalPrices: generateHistoricalPrices('ETH', 3450, 0.10, 0.005)
        },
        {
          id: 'g16',
          name: 'REIT Office Trust',
          ticker: 'REITOFF',
          assetClass: 'real_estate',
          price: 88.0,
          shares: 55,
          costBasis: 84.0,
          riskScore: 5,
          annualReturn: 7.9,
          investmentDate: '2024-05-10',
          observations: ['Reliable dividend payout history.', 'Acts similar to fixed income asset.', 'Volatile property values but stable rent collection.'],
          historicalPrices: generateHistoricalPrices('REITOFF', 88, 0.045, 0.0002)
        }
      ];

    case 'pathseeker':
    default:
      return [
        {
          id: 'p1',
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
          historicalPrices: generateHistoricalPrices('NIFTY50', 52, 0.035, 0.001)
        },
        {
          id: 'p2',
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
          historicalPrices: generateHistoricalPrices('SBISML', 135.2, 0.07, 0.003)
        },
        {
          id: 'p3',
          name: 'Gold ETF',
          ticker: 'GOLD_BAL',
          assetClass: 'commodities',
          price: 215.4,
          shares: 80,
          costBasis: 192.0,
          riskScore: 3,
          annualReturn: 11.8,
          investmentDate: '2023-11-12',
          observations: ['Optimal allocation for asset diversification.', 'Acts as safe haven asset.', 'Improves Sharpe ratio of the total portfolio.'],
          historicalPrices: generateHistoricalPrices('GOLD_BAL', 215.4, 0.025, 0.001)
        },
        {
          id: 'p4',
          name: 'Fixed Deposit',
          ticker: 'FD_BAL',
          assetClass: 'cash',
          price: 1.0,
          shares: 12000,
          costBasis: 1.0,
          riskScore: 1,
          annualReturn: 7.1,
          investmentDate: '2024-02-01',
          observations: ['Guaranteed cash reserve.', 'Allows quick deployment during market crashes.', 'Yield matches inflation base.'],
          historicalPrices: generateHistoricalPrices('FD_BAL', 1, 0.0, 0.0001)
        },
        {
          id: 'p5',
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
          historicalPrices: generateHistoricalPrices('USTECH', 188.5, 0.08, 0.003)
        },
        {
          id: 'p6',
          name: 'Government Bonds',
          ticker: 'GOV_BAL',
          assetClass: 'fixed_income',
          price: 100.0,
          shares: 150,
          costBasis: 100.0,
          riskScore: 2,
          annualReturn: 6.7,
          investmentDate: '2023-10-25',
          observations: ['Riskless bond buffer.', 'Stable income generation.', 'Counter-weight to aggressive equity assets.'],
          historicalPrices: generateHistoricalPrices('GOV_BAL', 100, 0.01, 0.0001)
        },
        {
          id: 'p7',
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
          historicalPrices: generateHistoricalPrices('HDFCBANK', 1620, 0.03, 0.0002)
        },
        {
          id: 'p8',
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
          historicalPrices: generateHistoricalPrices('RELIANCE', 2850, 0.035, 0.0008)
        },
        {
          id: 'p9',
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
          historicalPrices: generateHistoricalPrices('BTC', 68500, 0.09, 0.006)
        },
        {
          id: 'p10',
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
          historicalPrices: generateHistoricalPrices('ETH', 3450, 0.10, 0.005)
        },
        {
          id: 'p11',
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
          historicalPrices: generateHistoricalPrices('TATAMOT', 920, 0.06, 0.002)
        },
        {
          id: 'p12',
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
          historicalPrices: generateHistoricalPrices('CORPDEBT', 12.5, 0.015, 0.0002)
        },
        {
          id: 'p13',
          name: 'Public Provident Fund',
          ticker: 'PPF_BAL',
          assetClass: 'fixed_income',
          price: 1.0,
          shares: 6000,
          costBasis: 1.0,
          riskScore: 1,
          annualReturn: 7.1,
          investmentDate: '2023-04-05',
          observations: ['Guaranteed long term tax free interest.', 'Locks capital away from impulsive moves.', 'Sovereign guaranteed.'],
          historicalPrices: generateHistoricalPrices('PPF_BAL', 1, 0.0, 0.00015)
        },
        {
          id: 'p14',
          name: 'Nasdaq 100 ETF',
          ticker: 'QN100',
          assetClass: 'equity',
          price: 440.0,
          shares: 25,
          costBasis: 390.0,
          riskScore: 6,
          annualReturn: 18.2,
          investmentDate: '2024-03-12',
          observations: ['Provides global growth equity coverage.', 'Mainly large-cap tech companies.', 'Provides currency depreciation offset.'],
          historicalPrices: generateHistoricalPrices('QN100', 440, 0.045, 0.002)
        },
        {
          id: 'p15',
          name: 'REIT Office Trust',
          ticker: 'REITOFF',
          assetClass: 'real_estate',
          price: 88.0,
          shares: 90,
          costBasis: 84.0,
          riskScore: 5,
          annualReturn: 8.3,
          investmentDate: '2024-05-20',
          observations: ['Commercial property rental yields.', 'Low correlation with general stock indices.', 'Solid dividend distributor.'],
          historicalPrices: generateHistoricalPrices('REITOFF', 88, 0.045, 0.0002)
        },
        {
          id: 'p16',
          name: 'Clean Energy ETF',
          ticker: 'ICLN',
          assetClass: 'equity',
          price: 14.2,
          shares: 160,
          costBasis: 17.5,
          riskScore: 6,
          annualReturn: -20.4,
          investmentDate: '2024-01-18',
          observations: ['Environmental ESG thematic tilt.', 'Volatile performance under cost pressure.', 'Underlying holdings show long term structural promises.'],
          historicalPrices: generateHistoricalPrices('ICLN', 14.2, 0.065, -0.0015)
        }
      ];
  }
};
