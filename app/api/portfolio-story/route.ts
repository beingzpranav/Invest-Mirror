import { NextRequest, NextResponse } from 'next/server'; 

export interface PortfolioInsight {
  tag: string;
  headline: string;
  detail: string;
  tone: 'warning' | 'praise' | 'neutral';
}

interface PortfolioPayload {
  totalValue: number;
  totalGain: number;
  gainPercent: number;
  weightedRiskScore: number;
  hhi: number; 
  holdingsCount: number;
  allocation: { name: string; rawType: string; percentage: number }[];
  topHolding: { name: string; percentage: number } | null;
}

function generateFallbackInsights(p: PortfolioPayload): PortfolioInsight[] {
  const insights: PortfolioInsight[] = [];
  const alloc = p.allocation;

  const mutualFund = alloc.find(a => a.rawType === 'mutual_fund');
  const crypto = alloc.find(a => a.rawType === 'crypto');
  const equity = alloc.find(a => a.rawType === 'equity');
  const bonds = alloc.find(a => a.rawType === 'fixed_income');
  const gold = alloc.find(a => a.rawType === 'commodities');

  if (p.weightedRiskScore >= 7.5) {
    insights.push({
      tag: '// RISK BEHAVIOR',
      headline: "You play to win - or lose big.",
      detail: `Your weighted risk score of ${p.weightedRiskScore.toFixed(1)}/10 puts you in the top tier of risk-takers. You're optimistic about the future, possibly to a fault.`,
      tone: 'warning',
    });
  } else if (p.weightedRiskScore <= 3.5) {
    insights.push({
      tag: '// RISK BEHAVIOR',
      headline: 'You prefer sleep over returns.',
      detail: `Risk score ${p.weightedRiskScore.toFixed(1)}/10 - you've built a defensive portfolio. Capital preservation matters more to you than aggressive growth, and that's a valid strategy.`,
      tone: 'praise',
    });
  } else {
    insights.push({
      tag: '// RISK BEHAVIOR',
      headline: "You're walking the tightrope.",
      detail: `A balanced risk score of ${p.weightedRiskScore.toFixed(1)}/10 shows you understand both sides of the risk-return equation.`,
      tone: 'neutral',
    });
  }

  if (p.hhi > 0.35) {
    insights.push({
      tag: '// CONCENTRATION',
      headline: 'Your eggs are in one basket.',
      detail: p.topHolding
        ? `${p.topHolding.name} commands ${p.topHolding.percentage.toFixed(1)}% of your capital. One bad quarter there affects everything.`
        : 'Your portfolio is heavily concentrated. Diversification could reduce your single-point-of-failure risk.',
      tone: 'warning',
    });
  } else if (p.hhi < 0.12) {
    insights.push({
      tag: '// CONCENTRATION',
      headline: "You've spread your bets wisely.",
      detail: `With ${p.holdingsCount} holdings and a low concentration index, no single asset can derail your entire portfolio. This is textbook risk management.`,
      tone: 'praise',
    });
  }

  if (mutualFund && mutualFund.percentage > 35) {
    insights.push({
      tag: '// MINDSET',
      headline: 'You trust the process, not the hype.',
      detail: `${mutualFund.percentage.toFixed(1)}% in Mutual Funds signals a preference for managed, systematic growth over market-timing. You invest like someone who's read the data.`,
      tone: 'praise',
    });
  }

  if (crypto && crypto.percentage > 20) {
    insights.push({
      tag: '// BEHAVIOR SIGNAL',
      headline: "The future excites you - maybe too much.",
      detail: `${crypto.percentage.toFixed(1)}% in Crypto suggests you believe in technological disruption. But volatility at this weight can move your whole portfolio 10% in a day.`,
      tone: 'warning',
    });
  } else if (crypto && crypto.percentage > 5) {
    insights.push({
      tag: '// BEHAVIOR SIGNAL',
      headline: "A calculated bet on the future.",
      detail: `Your ${crypto.percentage.toFixed(1)}% crypto allocation is curious - enough to benefit from a bull run, small enough not to break you in a bear market.`,
      tone: 'neutral',
    });
  }

  const indiaCentric = (mutualFund?.percentage ?? 0) + (equity?.percentage ?? 0);
  if (indiaCentric > 60) {
    insights.push({
      tag: '// GEOGRAPHY',
      headline: "You believe in India's story.",
      detail: `Over ${indiaCentric.toFixed(0)}% of your portfolio is in India-linked assets. This is a concentrated geographical bet. A global diversification play could reduce currency and country risk.`,
      tone: 'neutral',
    });
  }

  const inflationHedge = (gold?.percentage ?? 0);
  if (inflationHedge < 5) {
    insights.push({
      tag: '// BLIND SPOT',
      headline: 'Inflation could quietly erode your returns.',
      detail: `Less than 5% in Gold or commodities means you have minimal inflation protection. When CPI rises, your fixed-income and equity returns feel the squeeze.`,
      tone: 'warning',
    });
  }

  if (bonds && bonds.percentage > 15) {
    insights.push({
      tag: '// TIME HORIZON',
      headline: "You're building for the long game.",
      detail: `${bonds.percentage.toFixed(1)}% in Fixed Income suggests capital preservation and steady income matter to you. You're not in it for the quick flip.`,
      tone: 'praise',
    });
  }

  if (p.gainPercent > 15) {
    insights.push({
      tag: '// PERFORMANCE',
      headline: 'Your portfolio is working harder than most.',
      detail: `A ${p.gainPercent.toFixed(1)}% unrealised gain means your allocation decisions are paying off. The question is: can you hold through the volatility to let it compound?`,
      tone: 'praise',
    });
  } else if (p.gainPercent < -5) {
    insights.push({
      tag: '// PERFORMANCE',
      headline: "You're underwater - for now.",
      detail: `A ${p.gainPercent.toFixed(1)}% unrealised loss is uncomfortable, but not unusual. The investors who hold through drawdowns often outperform those who panic.`,
      tone: 'neutral',
    });
  }

  return insights.slice(0, 6);
}

function parseInsightsText(text: string): PortfolioInsight[] {
  const trimmed = text.trim();
  
  try {
    const parsed = JSON.parse(trimmed);
    const list = Array.isArray(parsed) ? parsed : parsed.insights;
    if (Array.isArray(list)) return list.slice(0, 6);
  } catch {}

  const jsonMatch = trimmed.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed)) return parsed.slice(0, 6);
    } catch {}
  }

  const objMatch = trimmed.match(/\{[\s\S]*\}/);
  if (objMatch) {
    try {
      const parsed = JSON.parse(objMatch[0]);
      const list = Array.isArray(parsed) ? parsed : parsed.insights;
      if (Array.isArray(list)) return list.slice(0, 6);
    } catch {}
  }

  throw new Error('Unable to extract valid insights list from text response');
}

async function generateGroqInsights(p: PortfolioPayload): Promise<PortfolioInsight[]> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('No GROQ_API_KEY configured');

  const allocationText = p.allocation
    .map(a => `${a.name}: ${a.percentage.toFixed(1)}%`)
    .join(', ');

  const prompt = `You are a behavioral finance analyst. Analyze this investment portfolio and generate exactly 5 insightful, human, slightly provocative observations about what this portfolio reveals about the investor's psychology, preferences, and blind spots.

Portfolio data:
- Total Value: $${p.totalValue.toLocaleString()}
- Unrealised Gain: ${p.gainPercent.toFixed(1)}%
- Weighted Risk Score: ${p.weightedRiskScore.toFixed(1)}/10
- Number of Holdings: ${p.holdingsCount}
- Diversification Index (HHI): ${p.hhi.toFixed(3)} (lower is better, 0.25+ is concentrated)
- Asset Allocation: ${allocationText}
${p.topHolding ? `- Largest Single Holding: ${p.topHolding.name} at ${p.topHolding.percentage.toFixed(1)}%` : ''}

You MUST return a JSON object with an "insights" key containing a list of exactly 5 objects. Each object must have:
- "tag": short category label starting with "// " (e.g. "// RISK BEHAVIOR", "// MINDSET", "// BLIND SPOT", "// GEOGRAPHY", "// TIME HORIZON")
- "headline": one punchy sentence (max 10 words) about what this reveals
- "detail": 2 sentences expanding on the insight with specific numbers from the data
- "tone": one of "warning", "praise", or "neutral"

Example layout:
{
  "insights": [
    {
      "tag": "// RISK BEHAVIOR",
      "headline": "...",
      "detail": "...",
      "tone": "..."
    }
  ]
}

Be honest, data-driven, and slightly provocative. Think like a financial therapist, not a robo-advisor. Return only the JSON object.`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API Error: ${res.status} - ${errText}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '';
  return parseInsightsText(text);
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as PortfolioPayload;
    let errors: string[] = [];

    const hasGroq = process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here';
    if (hasGroq) {
      try {
        const insights = await generateGroqInsights(payload);
        return NextResponse.json({ insights, source: 'groq' });
      } catch (err) {
        console.error('Groq API failed:', err);
        errors.push(`Groq: ${String(err)}`);
      }
    }

    const insights = generateFallbackInsights(payload);

    if (errors.length > 0) {
      const allErrors = errors.join(' | ');
      return NextResponse.json({
        insights,
        source: 'error',
        errorDetails: allErrors
      });
    }

    return NextResponse.json({ insights, source: 'no_key' });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
