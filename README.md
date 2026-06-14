# InvestMirror 🪞

> An inspired, premium Investment Portfolio & Behavioral Analyzer built with Next.js, Framer Motion, and Tailwind CSS. Stress-test your wealth in the Crash Lab, discover your financial DNA from 7 distinct behavioral archetypes, and navigate your assets with visual excellence.

---

## 🌟 Key Features

*   **📊 Immersive Dashboard**: Dynamic overview of your total portfolio value, weighted risk scores, cost basis, and net gains. Built with highly polished glassmorphism cards and clean charts.
*   **🧬 Financial DNA Engine**: Analyzes your asset allocation, diversification, and activity to map your investing style into 7 unique archetypes (e.g., *The Builder*, *The Protector*, *The Explorer*, *The Collector*).
*   **💥 The Crash Lab**: Simulate real historical market drawdowns (Great Financial Crisis, Dotcom Bubble, Covid-19 Crash, Crypto Winter) on your exact assets to test your risk tolerance.
*   **🔍 Portfolio Explorer**: Smoothly filter, search, and drill down into asset classes (`equity`, `fixed_income`, `crypto`, `real_estate`, `commodities`, `mutual_fund`, `cash`) with inline stock tick historical mini-charts.
*   **💬 Behavioral Counselor Widget**: Interactive chat assistant helping you understand your financial behavior and suggest rebalancing strategies.
*   **📝 Decision Journal**: Dedicated in-app page outlining the system architecture, product decisions, UX heuristics, and engineering logs.

---

## 🎨 Inspired Design & Aesthetics

InvestMirror is built upon a curated adaptation of Wise's Scandinavian-fintech magazine design language:

*   **Vibrant Brand Accents**: Lime-green highlights (`#9fe870`) for focus points and primary action buttons.
*   **Sage-Tinted Canvas**: Sage backgrounds (`#e8ebe6`) contrasted with pure white floating cards.
*   **Smooth Micro-Animations**: Built with **Framer Motion** and **GSAP** for responsive hovers, scramble text effects, and interactive sliders.
*   **Clean Empty States**: Redesigned placeholder areas using modern glassmorphic circles and pulsing vector radars (no raw emojis) for a sleek, premium experience.
*   **Dynamic Dark Mode**: Toggle seamlessly between clean sage/white layouts and deep, space-black olive-tinted interfaces.

---

## 🛠️ Tech Stack

*   **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
*   **UI Library**: [React 19](https://react.dev/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & PostCSS
*   **Animations**: [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)
*   **Charts & Visualizations**: [Recharts](https://recharts.org/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Context & State**: React Context (`ThemeContext`, `PortfolioContext`)

---

## 📁 Repository Structure

```tree
investmirror/
├── app/                      # Next.js App Router Page Layouts & API routes
│   ├── api/                  # Backend API routes for behavioral calculations
│   │   ├── chat/             # AI Counselor API 
│   │   └── portfolio-story/  # AI Portfolio Story / Commentary API
│   ├── archetype/            # Behavioral analysis page
│   ├── crash-lab/            # Interactive market crash simulator
│   ├── dashboard/            # Core portfolio dashboard
│   ├── decision-journal/     # Architectural engineering logs
│   ├── explorer/             # Asset screening page
│   ├── globals.css           # Tailwind design system & global styles
│   └── page.tsx              # Interactive landing page
├── components/               # Reusable React UI Components
│   ├── archetype/            # DNA Profiling cards, scanners, and stories
│   ├── dashboard/            # Allocation pie-charts, risk bars, performance charts
│   ├── explorer/             # Search items, list assets, table headers
│   └── ui/                   # Modals, Animated Testimonials, Chat Widget, Theme Toggle
├── lib/                      # Helper utilities, Engines, and Shared Data
│   ├── archetypeEngine.ts    # Scoring rules, factors, and archetypes mapping
│   ├── data.ts               # Default starting assets & mock history
│   ├── types.ts              # Domain interfaces (AssetClass, Investment, Archetype)
│   └── utils.ts              # Formatting & math functions
├── DESIGN.md                 # Original Wise-design analysis system tokens
└── package.json              # Script runners and dependencies
```

---

## 📊 Behavioral DNA Archetypes

InvestMirror dynamically calculates your alignment across 7 distinct profiling archetypes based on weighted allocation and volatility scores:

| Archetype | Icon | Core Tagline | Main Trait |
| :--- | :---: | :--- | :--- |
| **The Builder** | 🏗️ | *Patient, diversified, relentless.* | Balanced, Long-Term, Systematic |
| **The Protector** | 🛡️ | *Safety first. Growth second.* | Capital Preservation, Income-Focused |
| **The Optimist** | ☀️ | *Equity believer. Long horizon holder.* | Equity-Heavy, Bullish, Buy & Hold |
| **The Explorer** | 🚀 | *You go where others fear to tread.* | Crypto-Native, Speculative, High-Risk |
| **The Collector** | 💎 | *Every asset class is a piece of art.* | Hyper-Diversified, Asset-Agnostic |
| **The Opportunist** | ⚡ | *High conviction. Concentrated bets.* | Concentrated, High Conviction, Aggressive |
| **The Visionary** | 🔭 | *Investing in the world of tomorrow.* | Tech-Forward, Innovation-First, Thematic |

---

## 📝 Design Decisions & Logs
For a thorough description of why we chose these patterns, how we structured the GFC / Dotcom stress simulation engines, or why we styled components with Sage-lime themes, visit the in-app **[Decision Journal](./app/decision-journal/page.tsx)** page or consult **[DESIGN.md](./DESIGN.md)**.

---
*Developed with 💚 by [Pranav Khandelwal](https://pranavk.tech) for modern wealth builders.*

