'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePortfolio } from '@/lib/PortfolioContext';
import AuthModal from '@/components/ui/AuthModal';
import { Sparkles, Search, Flame, ArrowRight, LayoutDashboard } from 'lucide-react';
import { AnimatedTestimonials } from '@/components/ui/AnimatedTestimonials';

// ─── Micro-scramble component for archetype-style feature titles ────────────
function FeatureHeading({ text }: { text: string }) {
  const [display, setDisplay] = useState(text);
  const timerRef = useRef<number | null>(null);

  const triggerScramble = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    let step = 0;
    const totalSteps = 8;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
    
    const tick = () => {
      step++;
      const revealCount = Math.floor((step / totalSteps) * text.length);
      const scrambled = text
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (i < revealCount) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      setDisplay(scrambled);

      if (step < totalSteps) {
        timerRef.current = window.setTimeout(tick, 30);
      } else {
        setDisplay(text);
      }
    };
    tick();
  };

  return (
    <h3 
      onMouseEnter={triggerScramble}
      className="text-base font-black tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors duration-200 cursor-default uppercase font-mono"
    >
      {display}
    </h3>
  );
}

// ─── Mock Testimonials Data ──────────────────────────────────────────────────
const testimonialsData = [
  {
    id: 1,
    content: "InvestMirror showed me I was over-concentrated in tech. The 'Maverick' bias classification was completely spot-on.",
    name: "Rajesh K.",
    role: "Quant Analyst",
    company: "QuantCorp",
    avatar: "/avatar-1.png",
    rating: 5,
  },
  {
    id: 2,
    content: "Stress-testing my bonds in the Crash Lab convinced me to rebalance before the market turned. Extremely valuable tool.",
    name: "Sarah M.",
    role: "Wealth Manager",
    company: "Fidelity",
    avatar: "/avatar-2.png",
    rating: 5,
  },
  {
    id: 3,
    content: "The Wise-like interface is clean and snappy. No jargon, just pure visual clarity about my wealth.",
    name: "Amit S.",
    role: "Product Designer",
    company: "Wise",
    avatar: "/avatar-3.png",
    rating: 5,
  },
  {
    id: 4,
    content: "As a stoic investor, I love the clarity. The metrics scanner is incredibly accurate in mapping out emotional patterns.",
    name: "Elena R.",
    role: "Asset Allocator",
    company: "Vanguard",
    avatar: "/avatar-2.png",
    rating: 5,
  },
  {
    id: 5,
    content: "Fascinating behavioral analysis. It revealed biases in my trading activity that I wasn't even aware of.",
    name: "David T.",
    role: "Private Trader",
    company: "Self-Employed",
    avatar: "/avatar-1.png",
    rating: 5,
  },
  {
    id: 6,
    content: "Stress testing during GFC simulation saved me a lot of sleepless nights. Highly recommended.",
    name: "Chloe L.",
    role: "Hedge Fund Advisor",
    company: "Capital Partners",
    avatar: "/avatar-2.png",
    rating: 5,
  },
];



const marqueeLogos = [
  // Goldman Sachs
  () => (
    <div className="flex items-center gap-2 select-none h-full text-slate-800 dark:text-zinc-200">
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current text-[#002c77]">
        <path d="M1.963 9.264h1.452v2.378c-.484.098-.855.148-1.262.148C.561 11.79 0 10.878 0 9.377c0-1.614.778-2.526 2.329-2.526.196 0 .567.014 1.03.084v1.522h-.336l-.19-.582c-.183-.553-.4-.827-.744-.827-.596 0-.912.806-.912 2.315 0 1.515.126 2.23.904 2.23.106 0 .231-.014.351-.048V9.776l-.469-.323v-.189Zm1.424 6.382c0 .954-.651 1.501-1.802 1.501-.315 0-.778-.048-1.213-.119v-1.865h.337l.14.441c.315 1.017.54 1.353.94 1.353.421 0 .722-.371.722-.862 0-.399-.189-.68-.595-.898l-.702-.378c-.541-.287-.835-.736-.835-1.283 0-.828.68-1.326 1.796-1.326.252 0 .547.022 1.016.085v1.521h-.337l-.188-.581c-.19-.618-.393-.842-.764-.842-.415 0-.66.266-.66.652 0 .343.19.589.561.799l.708.399c.596.337.876.786.876 1.403Zm3.101 1.102.14.211v.106H5.556l-.05-.407c-.112.308-.407.491-.786.491-.561 0-.912-.351-.912-.926 0-.561.315-.933 1.283-1.311l.414-.161v-.525c0-.463-.085-.652-.344-.652-.21 0-.329.112-.533.623l-.231.573h-.315v-1.144c.414-.126.828-.21 1.185-.21.792 0 1.221.378 1.221 1.066v2.266Zm.405-6.824c0 1.192-.637 1.866-1.459 1.866-.82 0-1.457-.674-1.457-1.866 0-1.193.637-1.866 1.459-1.866.82 0 1.457.673 1.457 1.866Zm-1.387 6.235v-1.213l-.133.056c-.414.169-.569.547-.569 1.101 0 .414.099.652.329.652.231 0 .373-.225.373-.596Zm.357-6.235c0-1.347-.112-1.704-.427-1.704s-.428.357-.428 1.704c0 1.346.113 1.704.428 1.704s.427-.358.427-1.704Zm3.521 6.269.126.064c-.224.646-.511.89-1.066.89-.904 0-1.409-.679-1.409-1.865 0-1.185.589-1.866 1.55-1.866.258 0 .603.042.897.16v1.193h-.329l-.132-.449c-.176-.596-.273-.75-.449-.75-.281 0-.505.365-.505 1.754 0 1.114.168 1.521.595 1.521.287.001.532-.181.722-.652Zm-.779-4.488H7.342v-.104l.141-.211V7.476l-.141-.21V7.16l1.123-.084v4.313l.14.211v.105Zm1.726.085c-.772 0-1.235-.702-1.235-1.901 0-1.192.483-1.83 1.227-1.83.379 0 .589.147.68.441V7.476l-.141-.21V7.16l1.123-.084v4.313l.14.211v.104h-.996l-.077-.533c-.111.457-.321.619-.721.619Zm2.461 4.958.14.211v.106H11.67v-.106l.14-.211v-2.525c0-.301-.091-.483-.309-.483-.26 0-.449.218-.449.645v2.363l.141.211v.106H9.93v-.106l.14-.211v-3.914l-.14-.21v-.105l1.122-.084v1.451c.127-.301.414-.469.82-.469.576 0 .919.365.919 1.073v2.258h.001Zm-2.664-6.846c0 1.263.112 1.648.421 1.648.385 0 .455-.554.455-1.662 0-1.073-.077-1.606-.449-1.606-.315 0-.427.379-.427 1.62Zm7.041 1.487.14.211v.104h-1.262V11.6l.14-.211V8.787c0-.252-.084-.407-.281-.407-.244 0-.441.219-.441.638v2.371l.14.211v.104h-1.262V11.6l.14-.211V8.787c0-.252-.084-.407-.28-.407-.245 0-.442.219-.442.638v2.371l.141.211v.104h-1.263V11.6l.14-.211V8.535l-.14-.169v-.104l1.01-.12h.084l.028.393c.119-.309.414-.477.814-.477.427 0 .708.21.834.589.105-.365.435-.589.856-.589.553 0 .904.365.904 1.072v2.259Zm-1.311 4.644c0 .609-.393 1.114-1.339 1.114-.245 0-.575-.028-1.087-.119v-1.304h.287l.091.281c.224.715.441.982.785.982.323 0 .533-.232.533-.59 0-.294-.147-.497-.497-.687l-.603-.323c-.385-.21-.596-.539-.596-.946 0-.638.499-1.024 1.325-1.024.239 0 .547.034.884.105v1.024h-.287l-.148-.373c-.168-.449-.329-.595-.595-.595-.287 0-.456.168-.456.449 0 .238.141.399.484.595l.595.337c.406.232.624.561.624 1.074Zm4.538-4.644.14.211v.104h-1.073l-.048-.407c-.112.309-.407.491-.786.491-.561 0-.911-.35-.911-.926 0-.561.315-.932 1.283-1.311l.413-.16v-.526c0-.463-.084-.652-.343-.652-.211 0-.329.113-.533.624l-.231.575h-.317V8.27c.415-.127.828-.211 1.185-.211.792 0 1.221.379 1.221 1.066v2.264Zm-.982-.589V9.587l-.133.056c-.413.168-.567.547-.567 1.101 0 .414.098.653.329.653.23 0 .371-.225.371-.597Zm4.586.8v.104h-1.263V11.6l.141-.211V8.864c0-.302-.091-.484-.309-.484-.26 0-.449.219-.449.646v2.363l.14.211v.104h-1.262V11.6l.14-.211V8.535l-.14-.169v-.104l1.01-.12h.084l.028.393c.119-.309.407-.477.82-.477.575 0 .918.365.918 1.072v2.259L24 11.6Z"/>
      </svg>
      <span className="text-[13px] font-black tracking-tight font-mono uppercase">Goldman Sachs</span>
    </div>
  ),
  // Robinhood
  () => (
    <div className="flex items-center gap-2 select-none h-full text-slate-800 dark:text-zinc-200">
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current text-[#00c805]">
        <path d="M2.84 24h.53c.096 0 .192-.048.224-.128C7.591 13.696 11.94 8.656 14.67 5.638c.112-.128.064-.225-.096-.225h-4.88a.55.55 0 0 0-.45.225L5.746 9.972c-.514.642-.642 1.236-.642 2.086v4.43c-1.14 3.194-1.862 5.361-2.392 7.32-.032.125.016.192.129.192M20.447.646c-.754-.802-4.157-.834-5.73-.224a3 3 0 0 0-.786.465 41 41 0 0 0-3.323 3.178c-.112.113-.064.225.097.225h5.409c.497 0 .786.289.786.786v6.1c0 .16.128.208.225.064l3.258-4.254c.53-.69.69-.898.835-1.861.192-1.413.08-3.58-.77-4.479m-6.982 16.18 2.231-3.676a.7.7 0 0 0 .064-.29V6.73c0-.16-.112-.225-.224-.097-3.355 3.74-5.971 7.672-8.395 12.407-.06.12.016.225.16.177l5.009-1.54c.565-.174.882-.402 1.155-.852"/>
      </svg>
      <span className="text-[13px] font-black tracking-tight font-mono uppercase">Robinhood</span>
    </div>
  ),
  // Coinbase
  () => (
    <div className="flex items-center gap-2 select-none h-full text-slate-800 dark:text-zinc-200">
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current text-[#0052ff]" fillRule="evenodd">
        <path d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zM12 4.5A7.5 7.5 0 1019.5 12 7.5 7.5 0 0012 4.5z"/>
      </svg>
      <span className="text-[13px] font-black tracking-tight font-mono uppercase">Coinbase</span>
    </div>
  ),
  // PayPal
  () => (
    <div className="flex items-center gap-2 select-none h-full text-slate-800 dark:text-zinc-200">
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current text-[#003087]">
        <path d="M15.607 4.653H8.941L6.645 19.251H1.82L4.862 0h7.995c3.754 0 6.375 2.294 6.473 5.513-.648-.478-2.105-.86-3.722-.86m6.57 5.546c0 3.41-3.01 6.853-6.958 6.853h-2.493L11.595 24H6.74l1.845-11.538h3.592c4.208 0 7.346-3.634 7.153-6.949a5.24 5.24 0 0 1 2.848 4.686M9.653 5.546h6.408c.907 0 1.942.222 2.363.541-.195 2.741-2.655 5.483-6.441 5.483H8.714Z"/>
      </svg>
      <span className="text-[13px] font-black tracking-tight font-mono uppercase">PayPal</span>
    </div>
  ),
  // Wise
  () => (
    <div className="flex items-center gap-2 select-none h-full text-slate-800 dark:text-zinc-200">
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current text-[#00b9ff]">
        <path d="M6.488 7.469 0 15.05h11.585l1.301-3.576H7.922l3.033-3.507.01-.092L8.993 4.48h8.873l-6.878 18.925h4.706L24 .595H2.543l3.945 6.874Z"/>
      </svg>
      <span className="text-[13px] font-black tracking-tight font-mono uppercase">Wise</span>
    </div>
  ),
  // Rupeestop
  () => (
    <div className="flex items-center gap-2 select-none h-full">
      <img src="/RP.webp" alt="Rupeestop Logo" className="h-5 w-auto rounded-sm brightness-90 contrast-125 filter invert" />
    </div>
  ),
];

export default function LandingPage() {
  const { isLoggedIn } = usePortfolio();
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('signup');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isLoggedIn) {
      router.push('/dashboard');
    }
  }, [mounted, isLoggedIn, router]);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Scroll animations for scaling the video background
  const videoScale = useTransform(scrollY, [0, 500], [1, 0.94]);
  const videoTranslateY = useTransform(scrollY, [0, 500], [0, -40]);
  const videoBorderRadius = useTransform(scrollY, [0, 500], [0, 32]);
  const contentOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const contentScale = useTransform(scrollY, [0, 300], [1, 0.95]);

  if (!mounted || isLoggedIn) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950">
        <div className="text-center flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
          <span className="text-xs font-mono text-slate-500 dark:text-zinc-500">
            {isLoggedIn ? 'Redirecting to Dashboard...' : 'Loading InvestMirror...'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#f5f6f4] text-slate-900 overflow-x-hidden">
      
      {/* CSS keyframe styles for marquee and grid layout */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-25% - (20px / 4))); }
        }
        .ticker-track {
          display: flex;
          width: max-content;
          animation: scroll 100s linear infinite;
        }
        .ticker-item {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
          filter: none;
          opacity: 1;
        }
        @media (hover: hover) {
          .ticker-wrap:hover .ticker-track { animation-play-state: paused; }
        }
        .st0 {
          fill: #9fe870;
        }
        .st1 {
          fill: #ffffff;
        }
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(14, 15, 12, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(14, 15, 12, 0.04) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>

      {/* ─── Hero Section with Pinned Video Background ─── */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Animated Video Canvas Card */}
        <motion.div 
          style={{ 
            scale: videoScale, 
            y: videoTranslateY,
            borderRadius: videoBorderRadius,
            position: 'absolute',
            inset: 0,
            overflow: 'hidden'
          }}
          className="w-full h-full shadow-2xl origin-top"
        >
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          {/* Dark overlay for contrast */}
          <div className="absolute inset-0 bg-[#0e0f0c]/65" />
        </motion.div>

        {/* Foreground Content */}
        <motion.div 
          style={{ opacity: contentOpacity, scale: contentScale }}
          className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white flex flex-col items-center gap-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono uppercase tracking-widest text-[#9fe870]">
            <Sparkles size={12} className="animate-pulse" />
            Next-Gen Behavioral wealth intelligence
          </div>

          <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] text-white">
            Mirror Your Habits.<br />
            <span className="text-[#9fe870]">Master Your Wealth.</span>
          </h1>

          <p className="text-sm sm:text-xl max-w-2xl text-slate-200/90 leading-relaxed font-medium px-4">
            InvestMirror goes beyond basic performance tracking. We scan your asset weights, stress-test historic market crises, and classify your psychological investor profile.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4 items-center justify-center w-full px-6 sm:px-0">
            <button
              onClick={() => {
                setAuthTab('signup');
                setAuthOpen(true);
              }}
              className="px-8 py-4 bg-[#9fe870] hover:bg-[#8fd860] text-[#0e0f0c] text-sm font-black rounded-2xl flex items-center gap-2 shadow-lg shadow-[#9fe870]/20 transition-all cursor-pointer hover:scale-[1.03] w-full sm:w-auto justify-center"
            >
              Analyze Your Portfolio
              <ArrowRight size={15} className="stroke-[2.5]" />
            </button>
            <button
              onClick={() => {
                setAuthTab('login');
                setAuthOpen(true);
              }}
              className="px-8 py-4 border-2 border-white/30 hover:bg-white/10 text-white text-sm font-black rounded-2xl transition-all cursor-pointer w-full sm:w-auto justify-center"
            >
              Log In to Dashboard
            </button>
          </div>
        </motion.div>

      </section>

      {/* ─── Features Section (Archetype Theme Design) ─── */}
      <section className="relative z-20 py-24 sm:py-32 bg-[#ffffff] border-t border-slate-200/50 bg-grid-pattern overflow-hidden">
        
        {/* Decorative scan line element */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#9fe870]/40 to-transparent animate-pulse" />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          
          {/* Section Header */}
          <div className="flex flex-col gap-3 mb-16 sm:mb-20">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#0e0f0c]" />
              <span className="text-xs font-mono tracking-[0.25em] uppercase text-slate-900 font-black">
                [ DIAGNOSTIC CAPABILITIES ]
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-slate-900 leading-[0.95]">
              Financial Analytics<br />
              <span className="text-slate-500">Meets Behavioral DNA.</span>
            </h2>
          </div>

          {/* Grid container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Module 1 */}
            <div className="group relative flex flex-col gap-6 p-6 sm:p-8 rounded-3xl bg-[#f5f6f4] border border-slate-200/60 overflow-hidden hover:border-[#0e0f0c] transition-all duration-300 hover:shadow-2xl hover:shadow-slate-100">
              
              {/* Corner accent marks */}
              <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-slate-300 group-hover:border-[#0e0f0c]" />
              <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-slate-300 group-hover:border-[#0e0f0c]" />
              
              {/* Module Code Header */}
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 font-bold">
                <span>[ MODULE_01 // SYSTEM ]</span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  ONLINE
                </span>
              </div>

              {/* Dynamic Scramble Heading on Hover */}
              <div className="mt-2">
                <FeatureHeading text="Behavioral DNA Scanner" />
              </div>

              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Analyzes portfolio concentration, volatility, and trading activity metrics to map you into one of our 7 investor archetypes.
              </p>

              {/* Cyber Metadata footer */}
              <div className="mt-auto pt-6 border-t border-slate-200/50 flex flex-wrap gap-x-4 gap-y-1.5 text-[9px] font-mono text-slate-400">
                <span>SAMPLE: DYNAMIC</span>
                <span>REGISTRY: EN-US</span>
                <span>STATUS: STABLE</span>
              </div>
            </div>

            {/* Module 2 */}
            <div className="group relative flex flex-col gap-6 p-6 sm:p-8 rounded-3xl bg-[#f5f6f4] border border-slate-200/60 overflow-hidden hover:border-[#0e0f0c] transition-all duration-300 hover:shadow-2xl hover:shadow-slate-100">
              
              {/* Corner accent marks */}
              <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-slate-300 group-hover:border-[#0e0f0c]" />
              <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-slate-300 group-hover:border-[#0e0f0c]" />
              
              {/* Module Code Header */}
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 font-bold">
                <span>[ MODULE_02 // SEARCH ]</span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  ONLINE
                </span>
              </div>

              {/* Dynamic Scramble Heading on Hover */}
              <div className="mt-2">
                <FeatureHeading text="Portfolio Explorer" />
              </div>

              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Deep dive into your assets. Visualize geographic, sector, and risk-level exposure parameters in unified Wise-inspired layouts.
              </p>

              {/* Cyber Metadata footer */}
              <div className="mt-auto pt-6 border-t border-slate-200/50 flex flex-wrap gap-x-4 gap-y-1.5 text-[9px] font-mono text-slate-400">
                <span>INDEXING: LIVE</span>
                <span>METRIC: ALIGNED</span>
                <span>RE-SYS: PASS</span>
              </div>
            </div>

            {/* Module 3 */}
            <div className="group relative flex flex-col gap-6 p-6 sm:p-8 rounded-3xl bg-[#f5f6f4] border border-slate-200/60 overflow-hidden hover:border-[#0e0f0c] transition-all duration-300 hover:shadow-2xl hover:shadow-slate-100">
              
              {/* Corner accent marks */}
              <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-slate-300 group-hover:border-[#0e0f0c]" />
              <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-slate-300 group-hover:border-[#0e0f0c]" />
              
              {/* Module Code Header */}
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 font-bold">
                <span>[ MODULE_03 // SIM ]</span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  ONLINE
                </span>
              </div>

              {/* Dynamic Scramble Heading on Hover */}
              <div className="mt-2">
                <FeatureHeading text="Downside Stress-Testing" />
              </div>

              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Simulate portfolio resilience against historical black-swan crises. Know where your weaknesses lie before the next crash.
              </p>

              {/* Cyber Metadata footer */}
              <div className="mt-auto pt-6 border-t border-slate-200/50 flex flex-wrap gap-x-4 gap-y-1.5 text-[9px] font-mono text-slate-400">
                <span>SIMULATION: EXT</span>
                <span>DATA: GFC/DOTCOM</span>
                <span>STATUS: ARMED</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Logo Marquee (Using beehiiv-structured SVG ticker) ─── */}
      <section className="relative z-20 py-12 overflow-hidden bg-[#ffffff] border-t border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>
            Trusted by industry leaders
          </p>
        </div>

        <div className="relative">
          {/* Gradient Edges Overlay */}
          <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to right, #ffffff 0%, transparent 20%, transparent 80%, #ffffff 100%)', pointerEvents: 'none' }} />

          {/* Ticker Rows */}
          <div className="relative w-full overflow-hidden ticker-wrap" style={{ marginBottom: 0 }}>
            <div className="ticker-track" style={{ animationDirection: 'normal' }}>
              {[...new Array(24)].map((_, index) => {
                const logoIndex = index % marqueeLogos.length;
                const renderLogo = marqueeLogos[logoIndex];
                return (
                  <div key={index} className="ticker-item flex items-center justify-center shrink-0 px-8" style={{ marginRight: '40px', height: '32px', width: 'auto' }}>
                    <div className="h-full w-auto text-inherit flex items-center justify-center">
                      {renderLogo()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials Section (Animated Deck Layout) ─── */}
      <AnimatedTestimonials
        title="Validated by Investors."
        subtitle="Gain deeper clarity into your financial habits. See how other wealth managers and allocators evaluate their behavioral profiles."
        badgeText="Behavioral Validation"
        testimonials={testimonialsData}
        autoRotateInterval={6000}
      />



      {/* Auth Modal Container */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} defaultTab={authTab} />

    </div>
  );
}
