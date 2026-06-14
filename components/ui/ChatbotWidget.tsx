'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';
import { usePortfolio } from '@/lib/PortfolioContext';
import { calculatePortfolioSummary, getAssetAllocation } from '@/lib/utils';
import { classifyPortfolio } from '@/lib/archetypeEngine';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ─── Simple Custom Text Formatter to Render Markdown/Styling ──────────────────
function FormattedText({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
      {lines.map((line, idx) => {
        let trimmed = line.trim();

        // Headers (### Header)
        if (trimmed.startsWith('###')) {
          return (
            <h4 key={idx} className="text-xs font-mono font-black tracking-widest uppercase text-[#9fe870] mt-2 mb-1">
              {trimmed.replace(/^###\s*/, '')}
            </h4>
          );
        }

        // Bullet lists (* list item)
        if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
          const content = trimmed.replace(/^[*+-]\s*/, '');
          return (
            <div key={idx} className="flex gap-2 pl-2">
              <span className="text-[#9fe870]">•</span>
              <span className="flex-1">{parseBoldText(content)}</span>
            </div>
          );
        }

        // Number lists (1. list item)
        if (/^\d+\.\s*/.test(trimmed)) {
          const match = trimmed.match(/^(\d+)\.\s*(.*)/);
          const num = match ? match[1] : '';
          const content = match ? match[2] : '';
          return (
            <div key={idx} className="flex gap-2 pl-2">
              <span className="font-mono text-[#9fe870]">{num}.</span>
              <span className="flex-1">{parseBoldText(content)}</span>
            </div>
          );
        }

        // Warning alerts (⚠️ Alert)
        if (trimmed.startsWith('⚠️')) {
          return (
            <div key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 my-2">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <p className="text-[11px] leading-tight flex-1">{parseBoldText(trimmed.replace(/^⚠️\s*/, ''))}</p>
            </div>
          );
        }

        // Success checks (✅ Check)
        if (trimmed.startsWith('✅')) {
          return (
            <div key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 my-2">
              <AlertCircle size={14} className="shrink-0 mt-0.5 fill-emerald-500/20 text-emerald-400" />
              <p className="text-[11px] leading-tight flex-1">{parseBoldText(trimmed.replace(/^✅\s*/, ''))}</p>
            </div>
          );
        }

        // Empty line
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Default paragraph
        return <p key={idx}>{parseBoldText(line)}</p>;
      })}
    </div>
  );
}

// Bold parser (**text**)
function parseBoldText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-extrabold text-[#9fe870]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

// ─── Chatbot Widget Component ────────────────────────────────────────────────
export default function ChatbotWidget() {
  const { investments, isLoggedIn } = usePortfolio();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Compute live portfolio context for payload
  const portfolioPayload = useMemo(() => {
    if (!isLoggedIn || investments.length === 0) {
      return {
        totalValue: 0,
        totalGain: 0,
        gainPercent: 0,
        weightedRiskScore: 0,
        hhi: 0,
        holdingsCount: 0,
        allocation: [],
        topHolding: null,
        archetypeName: 'Undetermined',
        archetypeIcon: '🔮'
      };
    }

    const summary = calculatePortfolioSummary(investments, 'default');
    const allocation = getAssetAllocation(investments);
    const archetypeResult = classifyPortfolio(investments);

    const total = investments.reduce((s, iv) => s + iv.price * iv.shares, 0);
    const hhi = total > 0 
      ? investments.reduce((s, iv) => s + Math.pow((iv.price * iv.shares) / total, 2), 0)
      : 0;

    const top = allocation.length > 0 
      ? { name: allocation[0].name, percentage: allocation[0].percentage } 
      : null;

    return {
      totalValue: summary.totalValue,
      totalGain: summary.totalGain,
      gainPercent: summary.gainPercent,
      weightedRiskScore: summary.weightedRiskScore,
      hhi,
      holdingsCount: investments.length,
      allocation: allocation.map(a => ({ name: a.name, rawType: a.rawType, percentage: a.percentage, value: a.value })),
      topHolding: top,
      archetypeId: archetypeResult?.archetype.id,
      archetypeName: archetypeResult?.archetype.name,
      archetypeIcon: archetypeResult?.archetype.icon,
    };
  }, [investments, isLoggedIn]);

  // Reset or initialize welcome message when logged in or archetype changes
  useEffect(() => {
    if (!isLoggedIn) {
      setMessages([]);
      return;
    }

    const archName = portfolioPayload.archetypeName || "Undetermined";
    const archIcon = portfolioPayload.archetypeIcon || "🔮";

    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `Welcome to **InvestMirror Chat**! 

I am **Mirror AI**, your behavioral finance coach. I see you are classified under the **${archIcon} ${archName}** archetype. 

Ready to explore your behavioral patterns? Click one of the suggested prompts below or ask me anything about your asset allocation, diversification, or risk exposure!`,
        timestamp: new Date()
      }
    ]);
  }, [isLoggedIn, portfolioPayload.archetypeName, portfolioPayload.archetypeIcon]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setLoading(true);

    try {
      // Format chat history to send to endpoint
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          portfolio: portfolioPayload
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned error ${res.status}`);
      }

      const data = await res.json();
      const assistantMsg: Message = {
        id: Math.random().toString(),
        role: 'assistant',
        content: data.reply || "I'm having trouble analyzing your request at the moment. What else can we examine?",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          role: 'assistant',
          content: "⚠️ **Connection Error**: I was unable to connect to the Mirror AI brain. Please check your internet connection or try again shortly.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Analyze my biases",
    "Am I diversified?",
    "Evaluate my risk exposure",
    "Test my GFC crash impact"
  ];

  if (!isLoggedIn) return null;

  return (
    <>
      {/* Floating Toggle Button */}
      <div className={`fixed bottom-6 right-6 z-50 ${isOpen ? 'hidden sm:block' : 'block'}`}>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="h-14 w-14 rounded-full flex items-center justify-center text-white cursor-pointer shadow-2xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)'
          }}
        >
          {/* Subtle breathing glow */}
          <div className="absolute inset-0 bg-[#9fe870] opacity-10 animate-pulse" />
          
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={22} className="stroke-[2.5]" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <MessageSquare size={22} className="stroke-[2.5]" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9fe870] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#9fe870]" />
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-0 right-0 sm:bottom-24 sm:right-6 w-full sm:w-[400px] h-full sm:h-[580px] sm:rounded-[24px] rounded-none border-t border-x-0 border-b-0 sm:border border-zinc-200 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between bg-zinc-900 text-white border-b border-zinc-800 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-indigo-600/10 pointer-events-none" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-[#9fe870] to-[#5a8a3c] flex items-center justify-center text-zinc-950 shadow-md shadow-[#9fe870]/20">
                  <Bot size={16} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black tracking-wider uppercase font-mono text-[#9fe870] flex items-center gap-1.5">
                    Mirror AI Advisor
                    <Sparkles size={10} className="fill-current animate-pulse" />
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase">Behavioral Coach // Active</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4 bg-zinc-50/50 dark:bg-zinc-950/30">
              {messages.map((msg) => {
                const isAI = msg.role === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 max-w-[85%] ${isAI ? 'self-start' : 'self-end flex-row-reverse'}`}
                  >
                    {/* Avatar */}
                    {isAI ? (
                      <div className="h-7 w-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 shadow-sm">
                        <img src="/favicon/favicon.svg" alt="AI" className="h-4.5 w-4.5 object-contain" />
                      </div>
                    ) : (
                      <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                        <User size={13} strokeWidth={2.5} />
                      </div>
                    )}

                    {/* Chat Bubble */}
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm shadow-xs ${
                        isAI
                          ? 'bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 border border-slate-100 dark:border-zinc-800/40 rounded-tl-none'
                          : 'bg-zinc-900 text-white dark:bg-zinc-800 rounded-tr-none'
                      }`}
                    >
                      {isAI ? (
                        <FormattedText text={msg.content} />
                      ) : (
                        <p className="leading-relaxed">{msg.content}</p>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {loading && (
                <div className="flex gap-3 max-w-[85%] self-start">
                  <div className="h-7 w-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 shadow-sm">
                    <img src="/favicon/favicon.svg" alt="AI" className="h-4.5 w-4.5 object-contain animate-pulse" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/40 rounded-tl-none flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Suggestion Chips */}
            <div className="px-4 py-2 border-t border-zinc-100 dark:border-zinc-900 bg-white/50 dark:bg-zinc-950/50 flex gap-2 overflow-x-auto shrink-0 scrollbar-none">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="px-3 py-1.5 rounded-full text-[10px] font-mono font-bold border border-zinc-200 dark:border-zinc-800 hover:border-[#9fe870] hover:bg-[#9fe870]/10 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-[#9fe870] shrink-0 transition-all duration-200 cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input Form Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputVal);
              }}
              className="p-3 border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask Mirror AI Advisor..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-slate-800 dark:text-zinc-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500 dark:focus:border-indigo-500 transition-colors"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || loading}
                className="h-9 w-9 rounded-xl bg-zinc-900 text-white dark:bg-[#9fe870] dark:text-zinc-950 flex items-center justify-center disabled:opacity-40 cursor-pointer hover:scale-[1.03] active:scale-[0.97] transition-all"
              >
                <Send size={15} strokeWidth={2.5} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
