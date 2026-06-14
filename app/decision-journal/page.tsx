'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Cpu, Shield, Sparkles, Code, GitCommit, ChevronRight, CheckCircle2 } from 'lucide-react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function useScramble(target: string, delay = 0) {
  const [display, setDisplay] = useState(target);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let step = 0;
      const totalSteps = 12;
      const intervalMs = 30;

      const tick = () => {
        step++;
        const revealCount = Math.floor((step / totalSteps) * target.length);
        const scrambled = target
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (i < revealCount) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('');
        setDisplay(scrambled);

        if (step < totalSteps) {
          timerRef.current = window.setTimeout(tick, intervalMs);
        } else {
          setDisplay(target);
        }
      };

      tick();
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [target, delay]);

  return display;
}

export default function DecisionJournalPage() {
  const [mounted, setMounted] = useState(false);
  const title = useScramble('DECISION JOURNAL', 200);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950">
        <div className="text-center flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
          <span className="text-xs font-mono text-slate-500 dark:text-zinc-500">Loading Journal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f5f6f4] dark:bg-zinc-950">
      
      <div className="pointer-events-none fixed top-0 right-0 w-[700px] h-[700px] rounded-full opacity-20 blur-[150px]" style={{ background: 'radial-gradient(circle, #9fe870, transparent 70%)' }} />
      <div className="pointer-events-none fixed bottom-0 left-0 w-[600px] h-[600px] rounded-full opacity-15 blur-[130px]" style={{ background: 'radial-gradient(circle, #38c8ff, transparent 70%)' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-28">
        
        <div className="pt-8 pb-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-slate-400 dark:text-zinc-500 transition-opacity hover:opacity-60"
          >
            <ArrowLeft size={12} />
            Back to Home
          </Link>
        </div>

        <section className="pt-10 pb-12 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#9fe870]" />
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-slate-400 dark:text-zinc-500">
              LOGS // ARCHITECTURAL, PRODUCT & UX JOURNAL
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-none text-slate-900 dark:text-white">
            {title}
          </h1>

          <p className="text-sm max-w-2xl leading-relaxed text-slate-500 dark:text-zinc-400">
            Welcome to the engineering and design logs of <strong>InvestMirror</strong>. This journal details the technical architecture, mathematical models, product paradigms, and design guidelines that define this portfolio analysis tool.
          </p>
        </section>

        <div className="h-px w-full bg-slate-200/60 dark:border-zinc-800/40 mb-12" />

        <div className="flex flex-col gap-12 sm:gap-16">

          <article className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 sm:gap-10">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono tracking-widest text-[#9fe870] font-black">[ SECTION 01 ]</span>
              <h2 className="text-base font-black uppercase font-mono tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <Code size={16} /> Architecture
              </h2>
            </div>
            
            <div className="flex flex-col gap-5 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
              <p className="font-extrabold text-slate-950 dark:text-white text-base">
                Why did we structure the project this way?
              </p>
              
              <div className="space-y-4">
                <p>
                  InvestMirror is built as a highly reactive, decoupled single-page application wrapping Next.js 15+ App Router. The core layout utilizes scoping patterns to maintain modular, route-specific components while sharing critical states globally.
                </p>
                
                <div className="p-4 rounded-2xl bg-white/65 dark:bg-zinc-900/40 border border-slate-200/50 dark:border-zinc-800 backdrop-blur-sm">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 font-mono text-xs uppercase text-[#9fe870]">1. Context-Driven Client Core</h4>
                  <p className="text-xs">
                    All user state, authorization, and asset transaction matrices are housed inside the global React Context <span className="font-mono text-emerald-600 dark:text-emerald-400">PortfolioContext</span>. Every modification to assets (adding or deleting investments) syncs instantaneously to the user&apos;s isolated space in browser localStorage.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/65 dark:bg-zinc-900/40 border border-slate-200/50 dark:border-zinc-800 backdrop-blur-sm">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 font-mono text-xs uppercase text-[#38c8ff]">2. Scoped Account Isolation</h4>
                  <p className="text-xs">
                    To prevent cross-pollution of financial records, local storage persistence keys are dynamic: <span className="font-mono">investmirror-portfolio-&#123;email&#125;</span>. This guarantees that different logged-in profiles have strictly segmented assets, while guests fall back to a predefined seed model.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/65 dark:bg-zinc-900/40 border border-slate-200/50 dark:border-zinc-800 backdrop-blur-sm">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 font-mono text-xs uppercase text-purple-500">3. Local Computation & Performance</h4>
                  <p className="text-xs">
                    We decoupled calculations (such as Sharpe values, HHI index, and volatility indicators) from remote server APIs. By executing these math formulas directly on client-side state inside <span className="font-mono">lib/archetypeEngine.ts</span>, we eliminated server roundtrips, allowing real-time re-calculation as soon as a user trims or expands holdings.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/65 dark:bg-zinc-900/40 border border-slate-200/50 dark:border-zinc-800 backdrop-blur-sm">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 font-mono text-xs uppercase text-amber-500">4. Dual-Tier LLM & Rule-Based Fallback</h4>
                  <p className="text-xs">
                    The Mirror AI assistant uses a multi-tier pipeline in <span className="font-mono">app/api/chat/route.ts</span>. It attempts to connect to Groq (using Llama 3.3 70B) for highly specific cognitive behavioral diagnostics. If that fails or is unconfigured, it attempts Gemini 2.5 Flash. If both external APIs fail, it falls back to a smart keyword-matching local regex engine that uses the user&apos;s live HHI, asset classes, and risk metrics, ensuring 100% feature availability.
                  </p>
                </div>
              </div>
            </div>
          </article>

          <div className="h-px w-full bg-slate-200/40 dark:border-zinc-800/20" />

          <article className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 sm:gap-10">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono tracking-widest text-[#38c8ff] font-black">[ SECTION 02 ]</span>
              <h2 className="text-base font-black uppercase font-mono tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <Cpu size={16} /> Product & Archetypes
              </h2>
            </div>
            
            <div className="flex flex-col gap-5 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
              <p className="font-extrabold text-slate-950 dark:text-white text-base">
                Why did we choose our archetypes?
              </p>
              
              <p>
                Most asset managers focus entirely on raw performance charts and gains, which leads to emotional overtrading and FOMO during bull runs. Our product thesis is different: we focus on the **investor&apos;s behavior and cognitive state**. We score allocations on five traits (Risk Appetite, Growth Focus, Safety Bias, Diversification, and Innovation Tilt) and match them to 7 distinct psychological profiles:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/10">
                  <span className="font-bold text-slate-900 dark:text-white block mb-1">🏗️ The Builder</span>
                  <p className="text-xs">
                    <strong>Formula:</strong> Moderate weighted risk (3-7), high diversification score, broad coverage (4+ classes), and balanced growth (&gt;20%) and safety (&gt;10%). This is the index-anchored long-term compounder.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/10">
                  <span className="font-bold text-slate-900 dark:text-white block mb-1">🛡️ The Protector</span>
                  <p className="text-xs">
                    <strong>Formula:</strong> Driven by safety bias (&gt;40% fixed income & cash), low weighted risk score, and minimal crypto or equity volatility. Focuses heavily on capital preservation.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/10">
                  <span className="font-bold text-slate-900 dark:text-white block mb-1">☀️ The Optimist</span>
                  <p className="text-xs">
                    <strong>Formula:</strong> Equity and mutual fund heavy (&gt;80%), long-term horizon buy-and-hold, high historical annual return (&gt;10%), and low safety cushion. Believes fully in equities.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/10">
                  <span className="font-bold text-slate-900 dark:text-white block mb-1">🚀 The Explorer</span>
                  <p className="text-xs">
                    <strong>Formula:</strong> Heavy allocation to cryptocurrencies (&gt;25%), high risk score (&gt;7.5), and low exposure to standard fixed income or cash. Comfortable with extreme volatility.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/10">
                  <span className="font-bold text-slate-900 dark:text-white block mb-1">💎 The Collector</span>
                  <p className="text-xs">
                    <strong>Formula:</strong> Spans 5+ distinct asset classes, has 10+ active individual positions, high balance entropy, and holds mixtures of real estate and gold. True hyper-diversification.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/10">
                  <span className="font-bold text-slate-900 dark:text-white block mb-1">⚡ The Opportunist</span>
                  <p className="text-xs">
                    <strong>Formula:</strong> Highly concentrated in a single asset class (&gt;55%), very few active holdings (&lt;8), low diversification score, and high risk score. Employs concentrated bets.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/10 mt-2">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">🔭 The Visionary</span>
                <p className="text-xs">
                  <strong>Formula:</strong> Focuses heavily on tech-related securities (tickers NVDA, TSLA, MSFT, AAPL, QQQ, or holdings containing &apos;tech&apos;, &apos;nasdaq&apos;, &apos;ai&apos;), tech allocation &gt;35%, high average returns, and moderate crypto exposure.
                </p>
              </div>

              <div className="mt-4">
                <h4 className="font-extrabold text-slate-950 dark:text-white text-sm mb-2">Predefined Behavioral Test Users</h4>
                <p className="mb-3">
                  To allow instant evaluations of the archetype classification engine, we configured 4 test credentials (password <code className="bg-slate-200/60 dark:bg-zinc-900/60 px-1 py-0.5 rounded text-xs font-mono text-rose-500">user@1234</code>) loaded with real portfolio mixtures:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs">
                  <li><strong>user1@gmail.com</strong>: Explorer profile (high crypto, high beta tech equities like Tesla and Nvidia).</li>
                  <li><strong>user2@gmail.com</strong>: Protector profile (heavy bond and cash reserves, fixed deposits, gold ETFs).</li>
                  <li><strong>user3@gmail.com</strong>: Builder / Collector profile (spans index funds, corporate debt, real estate REITs, US tech).</li>
                  <li><strong>user4@gmail.com</strong>: Opportunist profile (highly concentrated portfolio of Nvidia and cash).</li>
                </ul>
              </div>

              <div className="mt-3">
                <h4 className="font-extrabold text-slate-950 dark:text-white text-sm mb-2">Evaluation Constraints & Edge Case Fallbacks</h4>
                <p>
                  To verify reliability during edge-case testing, we introduced custom visual fallback layouts:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs mt-1">
                  <li><strong>Empty Portfolio</strong>: If a new user signs up or wipes their assets, the dashboard renders a beautiful fallback screen notifying them that no assets were found, directing them to the Asset Explorer.</li>
                  <li><strong>Single-Asset Concentration</strong>: Alerts the user immediately to concentration risk and highlights their Herfindahl-Hirschman Index (HHI) score.</li>
                </ul>
              </div>
            </div>
          </article>

          <div className="h-px w-full bg-slate-200/40 dark:border-zinc-800/20" />

          <article className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 sm:gap-10">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono tracking-widest text-purple-500 font-black">[ SECTION 03 ]</span>
              <h2 className="text-base font-black uppercase font-mono tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <Shield size={16} /> UX & Visual Rules
              </h2>
            </div>
            
            <div className="flex flex-col gap-5 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
              <p className="font-extrabold text-slate-950 dark:text-white text-base">
                Why did we design interactions this way?
              </p>
              
              <p>
                We avoided the traditional financial tracking design language of dense Excel-style grids. Instead, we drew inspiration from premium editorial designs, such as Wise and Scandinavian fintech studios.
              </p>

              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <CheckCircle2 size={18} className="text-[#9fe870] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white text-xs block mb-0.5">High-Contrast Editorial Color Palette</strong>
                    <p className="text-xs">
                      We pair a sage canvas base (<span className="font-mono">#e8ebe6</span> in light mode, deep black-olive <span className="font-mono">#0e0f0c</span> in dark mode) with high-contrast slate-900 text. The signature Wise Green (<span className="font-mono">#9fe870</span>) is used strictly for primary CTA buttons, ensuring that action targets stand out immediately.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <CheckCircle2 size={18} className="text-[#9fe870] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white text-xs block mb-0.5">Pill-Rounding Philosophy</strong>
                    <p className="text-xs">
                      All containers, buttons, and cards enforce a soft <span className="font-mono">rounded-3xl (24px)</span> radius. This softness removes the clinical, intimidating look of normal banking apps, inviting exploration.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <CheckCircle2 size={18} className="text-[#9fe870] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white text-xs block mb-0.5">Text Scrambling Micro-Interactions</strong>
                    <p className="text-xs">
                      On initial page loads and route changes, display titles execute a random-character matrix scramble animation. This provides a tactile feedback signal that elements are loading and updates are occurring in real time.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <CheckCircle2 size={18} className="text-[#9fe870] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white text-xs block mb-0.5">Floating Glassmorphic Canvas</strong>
                    <p className="text-xs">
                      Interactive widgets float over subtle background gradient blobs. This layering combined with low-opacity backdrop-blurs creates a distinct visual depth.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <div className="h-px w-full bg-slate-200/40 dark:border-zinc-800/20" />

          <article className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 sm:gap-10">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono tracking-widest text-[#f97316] font-black">[ SECTION 04 ]</span>
              <h2 className="text-base font-black uppercase font-mono tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles size={16} /> Crash Lab Mechanics
              </h2>
            </div>
            
            <div className="flex flex-col gap-5 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
              <p className="font-extrabold text-slate-950 dark:text-white text-base">
                How does the historical stress-test simulator work?
              </p>
              
              <p>
                The <strong>Crash Lab</strong> simulates the behavior of the user&apos;s custom portfolio across three historical financial crises: the 2008 Global Financial Crisis, the 2020 COVID-19 Crash, and the 2022 Interest Rate Hike Selloff.
              </p>

              <div className="space-y-4">
                <p>
                  Instead of generic drops, the simulator applies a class-specific drawdown coefficient vector to the user&apos;s live allocations:
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse border border-slate-200/60 dark:border-zinc-800/60 rounded-xl">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-zinc-900 font-mono">
                        <th className="p-2 border border-slate-200/60 dark:border-zinc-800/60">Crisis Scenario</th>
                        <th className="p-2 border border-slate-200/60 dark:border-zinc-800/60">Equities</th>
                        <th className="p-2 border border-slate-200/60 dark:border-zinc-800/60">Fixed Income</th>
                        <th className="p-2 border border-slate-200/60 dark:border-zinc-800/60">Crypto</th>
                        <th className="p-2 border border-slate-200/60 dark:border-zinc-800/60">Real Estate</th>
                        <th className="p-2 border border-slate-200/60 dark:border-zinc-800/60">Commodities</th>
                        <th className="p-2 border border-slate-200/60 dark:border-zinc-800/60">Cash</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 font-bold border border-slate-200/60 dark:border-zinc-800/60 text-red-500">2008 GFC</td>
                        <td className="p-2 border border-slate-200/60 dark:border-zinc-800/60">-52%</td>
                        <td className="p-2 border border-slate-200/60 dark:border-zinc-800/60">+8%</td>
                        <td className="p-2 border border-slate-200/60 dark:border-zinc-800/60">0%</td>
                        <td className="p-2 border border-slate-200/60 dark:border-zinc-800/60">-42%</td>
                        <td className="p-2 border border-slate-200/60 dark:border-zinc-800/60">+25%</td>
                        <td className="p-2 border border-slate-200/60 dark:border-zinc-800/60">0%</td>
                      </tr>
                      <tr className="bg-slate-50/50 dark:bg-zinc-900/20">
                        <td className="p-2 font-bold border border-slate-200/60 dark:border-zinc-800/60 text-orange-500">2020 COVID</td>
                        <td className="p-2 border border-slate-200/60 dark:border-zinc-800/60">-35%</td>
                        <td className="p-2 border border-slate-200/60 dark:border-zinc-800/60">+6%</td>
                        <td className="p-2 border border-slate-200/60 dark:border-zinc-800/60">-50%</td>
                        <td className="p-2 border border-slate-200/60 dark:border-zinc-800/60">-18%</td>
                        <td className="p-2 border border-slate-200/60 dark:border-zinc-800/60">+12%</td>
                        <td className="p-2 border border-slate-200/60 dark:border-zinc-800/60">0%</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold border border-slate-200/60 dark:border-zinc-800/60 text-purple-500">2022 Rates</td>
                        <td className="p-2 border border-slate-200/60 dark:border-zinc-800/60">-25%</td>
                        <td className="p-2 border border-slate-200/60 dark:border-zinc-800/60">-12%</td>
                        <td className="p-2 border border-slate-200/60 dark:border-zinc-800/60">-65%</td>
                        <td className="p-2 border border-slate-200/60 dark:border-zinc-800/60">-20%</td>
                        <td className="p-2 border border-slate-200/60 dark:border-zinc-800/60">+5%</td>
                        <td className="p-2 border border-slate-200/60 dark:border-zinc-800/60">+2%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-xs">
                  The interface feeds these details into an interactive SVG playback curve. Users click play to watch their simulated portfolio value shrink and recover across 5 historical milestone dates, providing a visual lesson in how specific asset classes cushion or worsen drawdowns.
                </p>

                <p className="text-xs">
                  <strong>Resilience Rating:</strong> In the final breakdown, we map the user&apos;s custom drawdown against a benchmark 100% equity drop. If the user&apos;s drop is smaller, it praises their diversification buffer. If it is larger, it recommends allocating towards defensive instruments (Bonds, Commodities, Cash).
                </p>
              </div>
            </div>
          </article>

          <div className="h-px w-full bg-slate-200/40 dark:border-zinc-800/20" />

          <article className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 sm:gap-10">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono tracking-widest text-amber-500 font-black">[ SECTION 05 ]</span>
              <h2 className="text-base font-black uppercase font-mono tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen size={16} /> Future Improvements
              </h2>
            </div>
            
            <div className="flex flex-col gap-4 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
              <p className="font-extrabold text-slate-950 dark:text-white text-base">
                What would we build with another week?
              </p>
              
              <p>
                If we had another week to build out the platform, we would prioritize these three architectural components:
              </p>
              
              <ol className="list-decimal pl-5 space-y-3">
                <li>
                  <strong>Direct Broker Integrations (Plaid API)</strong>:
                  <p className="text-xs mt-0.5">
                    Instead of manual input form cards, we would connect the portfolio to real brokerage API platforms. Users could link their accounts, automatically pulls balances, prices, and tickers in real time.
                  </p>
                </li>
                <li>
                  <strong>Unsupervised Machine Learning Classifications</strong>:
                  <p className="text-xs mt-0.5">
                    We would replace the heuristic rule scoring matrix with an unsupervised k-means clustering model. We would train the model on anonymized asset allocations, grouping portfolios organically rather than forcing them into predefined buckets.
                  </p>
                </li>
                <li>
                  <strong>Granular Daily stress-test replays</strong>:
                  <p className="text-xs mt-0.5">
                    We would expand the Crash Lab to load real historical closing price records. Instead of a 5-step animation, it would chart daily portfolio metrics, comparing them against the S&amp;P 500 or Nasdaq Index.
                  </p>
                </li>
              </ol>
            </div>
          </article>

          <div className="h-px w-full bg-slate-200/40 dark:border-zinc-800/20" />

          <article className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 sm:gap-10">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono tracking-widest text-rose-500 font-black">[ SECTION 06 ]</span>
              <h2 className="text-base font-black uppercase font-mono tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <GitCommit size={16} /> AI Tooling Report
              </h2>
            </div>
            
            <div className="flex flex-col gap-4 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
              <p className="font-extrabold text-slate-950 dark:text-white text-base">
                Which AI tools did we use and how? (Honest Report)
              </p>
              
              <p>
                This application was developed using a co-pilot workflow, combining human developer oversight with AI assistance. Here is an honest log of AI usage:
              </p>

              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-rose-200/50 dark:border-rose-900/30 bg-rose-50/20 dark:bg-rose-950/10">
                  <h5 className="font-bold text-slate-900 dark:text-white text-xs mb-1">1. Llama-3.3-70B-Versatile (via Groq API)</h5>
                  <p className="text-xs">
                    Acts as the primary model behind the live chatbot. It processes portfolio metrics (such as the HHI concentration, asset classes, and risk scores) to generate responses on behavioral finance.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-rose-200/50 dark:border-rose-900/30 bg-rose-50/20 dark:bg-rose-950/10">
                  <h5 className="font-bold text-slate-900 dark:text-white text-xs mb-1">2. Google Stitch MCP</h5>
                  <p className="text-xs">
                    Leveraged Google's Stitch MCP server tools to design and iterate on the UI layouts of the application, aligning styles against Wise design guidelines.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-rose-200/50 dark:border-rose-900/30 bg-rose-50/20 dark:bg-rose-950/10">
                  <h5 className="font-bold text-slate-900 dark:text-white text-xs mb-1">3. Antigravity AI Agent</h5>
                  <p className="text-xs">
                    Collaborated on writing boilerplate hooks, handling state synchronization with LocalStorage, cleaning up CSS styling issues (like the border alignment on navbar headers), and ensuring that empty and high-risk portfolios resolve correctly.
                  </p>
                </div>
              </div>
            </div>
          </article>

          <div className="h-px w-full bg-slate-200/40 dark:border-zinc-800/20" />

          <article className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 sm:gap-10">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono tracking-widest text-[#2ead4b] font-black">[ SECTION 07 ]</span>
              <h2 className="text-base font-black uppercase font-mono tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles size={16} /> Reflections
              </h2>
            </div>
            
            <div className="flex flex-col gap-4 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
              <p className="font-extrabold text-slate-950 dark:text-white text-base">
                A personal note on discovering a new niche.
              </p>
              <p>
                Building this project has been a completely new and eye-opening experience for me. Before embarking on this build, I had virtually no exposure to or ideas about stocks, asset classes, or portfolio allocation strategies. 
              </p>
              <p>
                InvestMirror served as a powerful hands-on canvas that forced me to dive deep into this niche, helping me learn side-by-side how stocks function, how diversification buffers volatility, and how mathematical models like HHI assess concentration risk. It was incredibly fun designing these behavioral archetypes and building the interactive simulator while gaining real financial literacy along the way.
              </p>
              <p className="italic font-bold text-slate-900 dark:text-white">
                Thank you for giving me this opportunity — it has been a genuine pleasure building this project!
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
