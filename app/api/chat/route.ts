import { NextRequest, NextResponse } from 'next/server';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface PortfolioPayload {
  totalValue: number;
  totalGain: number;
  gainPercent: number;
  weightedRiskScore: number;
  hhi: number;
  holdingsCount: number;
  allocation: { name: string; rawType: string; percentage: number; value: number }[];
  topHolding: { name: string; percentage: number } | null;
  archetypeId?: string;
  archetypeName?: string;
  archetypeIcon?: string;
}

function generateFallbackChatResponse(message: string, p: PortfolioPayload): string {
  const query = message.toLowerCase();
  const archetypeName = p.archetypeName || "Undetermined";
  const riskScore = p.weightedRiskScore ? p.weightedRiskScore.toFixed(1) : "0.0";
  const allocationSummary = p.allocation && p.allocation.length > 0
    ? p.allocation.map(a => `${a.name} (${a.percentage.toFixed(0)}%)`).join(', ')
    : "No holdings";

  if (query.includes('hello') || query.includes('hi ') || query.includes('hey') || query.includes('who are you') || query.includes('start')) {
    return `Hello! I am **Mirror AI**, your behavioral finance advisor. I've analyzed your portfolio metrics: you are currently classified as the **${p.archetypeIcon || '🔮'} ${archetypeName}** archetype with a portfolio value of **$${p.totalValue.toLocaleString()}** and a risk profile of **${riskScore}/10**. 

How can I help you today? You can ask me to analyze your biases, discuss your risk exposure, test crash scenarios, or suggest diversification actions.`;
  }

  if (query.includes('bias') || query.includes('psychology') || query.includes('behavior') || query.includes('mindset')) {
    let biasName = "Status Quo Bias";
    let biasDesc = "You might be holding on to assets simply because you already own them, rather than because they represent the best future opportunity.";

    if (p.weightedRiskScore > 7) {
      biasName = "Overconfidence Bias & FOMO (Fear of Missing Out)";
      biasDesc = "Your risk score of " + riskScore + "/10 suggests you feel high control over market directions, which can lead to over-trading or overallocating to high-volatility assets like Crypto.";
    } else if (p.weightedRiskScore < 4) {
      biasName = "Loss Aversion";
      biasDesc = "With a defensive risk score of " + riskScore + "/10, you experience the pain of financial loss twice as intensely as the pleasure of equivalent gain. This bias might cause you to miss long-term wealth compounding opportunities in equities.";
    }

    const hasCrypto = p.allocation.some(a => a.rawType === 'crypto');
    const cryptoBias = hasCrypto 
      ? "\n\nAdditionally, your crypto holdings suggest a susceptibility to **Recency Bias**—meaning you might be heavily influenced by recent high-performing asset narratives." 
      : "";

    return `### Behavioral Bias Diagnostics
Based on your **${archetypeName}** archetype and portfolio signature, your primary cognitive bias is likely **${biasName}**.

* **What it means**: ${biasDesc}
* **Exposure**: You have **${p.holdingsCount}** holdings distributed across: *${allocationSummary}*.${cryptoBias}

**Mirror AI Therapist Action**: Try writing down an investment thesis for each holding. If you wouldn't buy it at today's price with fresh cash, why are you keeping it?`;
  }

  if (query.includes('diversify') || query.includes('concentration') || query.includes('hhi') || query.includes('spread')) {
    const isConcentrated = p.hhi > 0.25;
    return `### Diversification Analysis
Your Herfindahl-Hirschman Index (HHI) is **${p.hhi.toFixed(3)}**. 

${isConcentrated 
  ? `⚠️ **Concentration Risk Detected**: Your portfolio is concentrated. Your largest holding ${p.topHolding ? `(**${p.topHolding.name}** at **${p.topHolding.percentage.toFixed(0)}%**)` : 'commands a massive chunk'} of your capital. A downturn in this specific asset or sector will impact you disproportionately. Consider rebalancing.`
  : `✅ **Well Diversified**: Your HHI is low, meaning your capital is distributed across **${p.holdingsCount}** holdings. This lowers your unsystematic risk and protects you against a single asset failing.`}

**Next Step**: To optimize, consider allocating towards less correlated asset classes like fixed income or commodities to act as a stabilizer.`;
  }

  if (query.includes('risk') || query.includes('volatility') || query.includes('safe') || query.includes('stable')) {
    return `### Risk Analysis
Your portfolio has a weighted risk score of **${riskScore}/10**.
- **Asset Count**: ${p.holdingsCount} positions
- **Structure**: ${p.allocation.map(a => `\n  * **${a.name}**: ${a.percentage.toFixed(0)}% (Risk: ${a.rawType === 'crypto' ? 'High' : a.rawType === 'equity' ? 'Medium-High' : 'Low'})`).join('')}

Your **${archetypeName}** archetype shows that you are comfortable with this level of exposure. However, ensure you have at least 3-6 months of emergency cash in pure liquid savings (risk score 0) so you are never forced to sell these assets during a market downturn.`;
  }

  if (query.includes('crash') || query.includes('gfc') || query.includes('covid') || query.includes('market drop')) {
    const hypotheticalDrop = p.totalValue * 0.28;
    return `### Stress Test Simulation
Under a historical market stress event (like the 2008 GFC or 2020 COVID crash), a portfolio structured like yours would expect an estimated peak-to-trough drawdown of approximately **25% to 35%**.

- **Potential Peak Impact**: A loss of roughly **$${hypotheticalDrop.toLocaleString()}** on paper.
- **Recovery Factor**: Historically, diversified portfolios recover in 8 to 18 months, whereas concentrated ones can take up to 4.5 years.

**Behavioral Tip**: During a crash, our amygdala takes over and screams at us to sell. The best course of action is to turn off the screens and let the assets compound. Are you emotionally prepared for a drop of this scale?`;
  }

  if (query.includes('rebalance') || query.includes('adjust') || query.includes('buy') || query.includes('sell') || query.includes('advice')) {
    return `### Rebalancing Guidelines
To align your current allocation (*${allocationSummary}*) with your **${archetypeName}** persona:

1. **Trim Concentrated Peaks**: If any single holding exceeds 20% of your total value, consider trimming and moving capital.
2. **Hedge Volatility**: If you hold high-growth equities/cryptocurrencies, ensure you balance them with defensive anchors like fixed income.
3. **Automate**: Establish a monthly systematic investment plan (SIP) to buy assets consistently, removing emotional timing decisions from the equation.

*(Note: I am a behavioral finance assistant, not a licensed fiduciary. Always cross-reference with professional advice!)*`;
  }

  return `I hear your question about **"${message}"**. 

As **Mirror AI**, your behavioral finance guide, I want to tie this back to your portfolio. Currently, you hold **$${p.totalValue.toLocaleString()}** across **${p.holdingsCount}** assets as a **${archetypeName}**. 

Could you clarify if you are concerned about your portfolio's **concentration**, **biases**, **risk levels**, or how it behaves during a **market crash**? I can give you a deep-dive analysis on any of these.`;
}

async function callGroqChat(
  history: ChatMessage[],
  message: string,
  p: PortfolioPayload
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('No GROQ_API_KEY configured');

  const allocationText = p.allocation
    .map(a => `${a.name}: ${a.percentage.toFixed(1)}%`)
    .join(', ');

  const systemPrompt = `You are Mirror AI, an expert behavioral finance therapist and private wealth advisor. Your purpose is to help the user understand their investment portfolio from a behavioral perspective, diagnosing psychological biases (like Loss Aversion, Overconfidence, Herd Mentality, Recency Bias, Home Bias, etc.).
  
  You have access to the user's live portfolio context:
  - Total Portfolio Value: $${p.totalValue.toLocaleString()}
  - Total Unrealised Gain: ${p.totalGain >= 0 ? '+' : ''}$${p.totalGain.toLocaleString()} (${p.gainPercent.toFixed(1)}%)
  - Portfolio Weighted Risk Score: ${p.weightedRiskScore.toFixed(1)}/10
  - Herfindahl-Hirschman Concentration Index (HHI): ${p.hhi.toFixed(3)}
  - Number of Active Positions: ${p.holdingsCount}
  - Asset Allocations: ${allocationText}
  - Behavioral Archetype: ${p.archetypeName || 'Undetermined'} (${p.archetypeIcon || '🔮'})
  
  Instructions:
  1. Address the user directly. Leverage their specific portfolio statistics (risk score, assets, and archetype) in your replies to make them highly tailored and contextual.
  2. Keep your tone human, slightly provocative, intelligent, and highly professional. Avoid typical AI introductory boilerplate or generic disclaimers in every message. Feel like an experienced wealth advisor who specializes in investor psychology.
  3. Keep responses reasonably concise (max 150-200 words) and format them beautifully using clean markdown (bold text, bullet points, numbered lists).
  4. Focus heavily on identifying and guiding the user to overcome emotional biases, and encourage disciplined compounding.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: message }
  ];

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.7,
      max_tokens: 800,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API Error: ${res.status} - ${errText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

export async function POST(req: NextRequest) {
  try {
    const { message, history = [], portfolio } = await req.json() as {
      message: string;
      history: ChatMessage[];
      portfolio: PortfolioPayload;
    };

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let errors: string[] = [];

    const hasGroq = process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here';
    if (hasGroq) {
      try {
        const reply = await callGroqChat(history, message, portfolio);
        return NextResponse.json({ reply, source: 'groq' });
      } catch (err) {
        console.error('Groq Chat failed:', err);
        errors.push(`Groq: ${String(err)}`);
      }
    }

    const reply = generateFallbackChatResponse(message, portfolio);
    return NextResponse.json({ reply, source: 'fallback', errors: errors.length > 0 ? errors : undefined });

  } catch (err) {
    console.error('Chat API error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
