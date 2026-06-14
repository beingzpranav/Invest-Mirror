'use client';

import { useState, useMemo } from 'react';
import { Investment, AssetClass } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowUpDown, SlidersHorizontal, Plus, Trash2, Shield } from 'lucide-react';
import { ASSET_CLASS_DETAILS, formatCurrency } from '@/lib/utils';
import { usePortfolio } from '@/lib/PortfolioContext';
import AddAssetModal from '../ui/AddAssetModal';

interface PortfolioExplorerProps {
  onSelectInvestment: (inv: Investment) => void;
  selectedInvestmentId: string | null;
}

type SortOption = 'allocation' | 'risk' | 'return' | 'name';
type SortOrder = 'asc' | 'desc';

function Sparkline({ prices, positive }: { prices: { price: number }[]; positive: boolean }) {
  if (prices.length < 2) return null;
  const vals = prices.map((p) => p.price);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const w = 72;
  const h = 24;

  const points = vals
    .map((v, i) => {
      const x = (i / (vals.length - 1)) * w;
      const y = 2 + (h - 4) - ((v - min) / range) * (h - 4);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const color = positive ? '#2ead4b' : '#d03238'; 
  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 1px 3px ${color}50)` }}
      />
    </svg>
  );
}

function RiskBadge({ score }: { score: number }) {
  const styles =
    score <= 3
      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
      : score <= 6
      ? 'bg-sky-500/10 text-sky-600 dark:text-cyan-400 border-sky-500/20'
      : score <= 8
      ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
  const label = score <= 3 ? 'Low' : score <= 6 ? 'Medium' : score <= 8 ? 'High' : 'Extreme';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${styles}`}>
      <Shield size={9} />
      {label}
    </span>
  );
}

export default function PortfolioExplorer({ onSelectInvestment, selectedInvestmentId }: PortfolioExplorerProps) {
  const { investments, removeInvestment } = usePortfolio();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<AssetClass | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('allocation');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const assetClasses: { value: AssetClass | 'all'; label: string }[] = [
    { value: 'all', label: 'All Assets' },
    { value: 'mutual_fund', label: 'Mutual Funds' },
    { value: 'equity', label: 'Stocks' },
    { value: 'crypto', label: 'Crypto' },
    { value: 'fixed_income', label: 'Bonds' },
    { value: 'cash', label: 'Cash & FDs' },
    { value: 'commodities', label: 'Gold & Metals' },
    { value: 'real_estate', label: 'Real Estate' },
  ];

  const totalValue = useMemo(
    () => investments.reduce((sum, inv) => sum + inv.price * inv.shares, 0),
    [investments]
  );

  const toggleSort = (opt: SortOption) => {
    if (sortBy === opt) setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(opt); setSortOrder('desc'); }
  };

  const filtered = useMemo(() => {
    return investments
      .filter((inv) => {
        const q = searchQuery.toLowerCase();
        return (
          (inv.name.toLowerCase().includes(q) || inv.ticker.toLowerCase().includes(q)) &&
          (selectedClass === 'all' || inv.assetClass === selectedClass)
        );
      })
      .sort((a, b) => {
        let va = 0;
        let vb = 0;
        if (sortBy === 'allocation') { va = a.price * a.shares; vb = b.price * b.shares; }
        else if (sortBy === 'risk') { va = a.riskScore; vb = b.riskScore; }
        else if (sortBy === 'return') { va = a.annualReturn; vb = b.annualReturn; }
        else {
          return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }
        return sortOrder === 'asc' ? va - vb : vb - va;
      });
  }, [investments, searchQuery, selectedClass, sortBy, sortOrder]);

  const SortBtn = ({ opt, label }: { opt: SortOption; label: string }) => {
    const active = sortBy === opt;
    return (
      <button
        onClick={() => toggleSort(opt)}
        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer border ${
          active
            ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-zinc-950'
            : 'bg-white/60 border-slate-200/50 text-slate-500 hover:bg-slate-100 dark:bg-zinc-900/60 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800'
        }`}
      >
        {label}
        {active && (
          <ArrowUpDown size={11} className={`transition-transform duration-200 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
        )}
      </button>
    );
  };

  return (
    <>
      <section className="flex flex-col gap-5">
        
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          
          <div className="relative flex-1 max-w-sm w-full">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 stroke-[2.5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name or ticker…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-panel text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-cyan-500 border border-slate-200/50 dark:border-zinc-800"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100/70 dark:bg-zinc-900/50 border border-slate-200/50 dark:border-zinc-800 text-xs font-bold text-slate-400 dark:text-zinc-500">
              <SlidersHorizontal size={11} /> Sort
            </div>
            <SortBtn opt="allocation" label="Allocation" />
            <SortBtn opt="risk" label="Risk" />
            <SortBtn opt="return" label="Return" />
            <SortBtn opt="name" label="Name" />

            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white text-xs font-black transition-all duration-200 cursor-pointer shadow-lg shadow-sky-500/20 dark:shadow-cyan-500/20 ml-1"
            >
              <Plus size={14} strokeWidth={2.5} />
              Add Asset
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {assetClasses.map((ac) => {
            const active = selectedClass === ac.value;
            return (
              <button
                key={ac.value}
                onClick={() => setSelectedClass(ac.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer border transition-all duration-200 ${
                  active
                    ? 'bg-sky-500/10 border-sky-500/30 text-sky-600 dark:bg-cyan-500/10 dark:border-cyan-500/30 dark:text-cyan-400'
                    : 'bg-white/50 dark:bg-zinc-900/40 border-slate-200/40 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
                }`}
              >
                {ac.label}
              </button>
            );
          })}
          <span className="ml-auto shrink-0 text-xs font-bold text-slate-400 dark:text-zinc-500 whitespace-nowrap">
            {filtered.length} / {investments.length} assets
          </span>
        </div>

        {investments.length === 0 ? (
          <div className="py-12 sm:py-16 text-center flex flex-col items-center justify-center gap-6 border-2 border-dashed border-slate-200/80 dark:border-zinc-800/80 rounded-[32px] bg-white/40 dark:bg-zinc-900/10 backdrop-blur-sm max-w-md mx-auto my-6 p-6 relative overflow-hidden">
            
            <div className="absolute -top-12 -left-12 w-28 h-28 rounded-full bg-sky-500/5 blur-xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-28 h-28 rounded-full bg-cyan-500/5 blur-xl pointer-events-none" />

            <div className="relative flex items-center justify-center w-20 h-20 mb-1">
              <div className="absolute inset-0 rounded-full bg-sky-500/10 dark:bg-cyan-500/5 animate-ping" />
              <div className="absolute w-14 h-14 rounded-full bg-sky-500/20 dark:bg-cyan-500/10 animate-pulse" />
              <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-sky-500 dark:bg-cyan-500 text-white shadow-lg shadow-sky-500/20">
                <Plus size={20} strokeWidth={2.5} />
              </div>
            </div>

            <div>
              <p className="text-base font-black text-slate-900 dark:text-white">Your portfolio is empty</p>
              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-2 max-w-xs mx-auto leading-relaxed">
                Start by adding your first asset (equity, mutual fund, crypto, cash) to calibrate your analyzer.
              </p>
            </div>

            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white text-xs font-black transition-all hover:scale-105 active:scale-95 duration-200 cursor-pointer shadow-lg shadow-sky-500/20 dark:shadow-cyan-500/20"
            >
              <Plus size={14} strokeWidth={2.5} />
              Add First Asset
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-semibold text-slate-400 dark:text-zinc-500">No assets match your filters.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedClass('all'); }}
              className="mt-3 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold cursor-pointer transition-all hover:scale-105"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            
            <div className="hidden md:grid md:grid-cols-[58px_1fr_84px_110px_76px_100px_32px] lg:grid-cols-[58px_1fr_76px_84px_110px_76px_100px_32px] gap-4 px-5 py-2 text-[10px] font-mono tracking-widest text-slate-400 dark:text-zinc-500 uppercase select-none items-center border-b border-slate-200/40 dark:border-zinc-800/20 pb-2 mb-1">
              <div># Asset</div>
              <div>Name</div>
              <div className="hidden lg:block text-center">Trend</div>
              <div className="text-right">Price</div>
              <div className="text-right pr-2">Allocation</div>
              <div className="text-right">Gains</div>
              <div className="text-right">Risk</div>
              <div></div>
            </div>

            <AnimatePresence initial={false} mode="popLayout">
              {filtered.map((inv, idx) => {
                const value = inv.price * inv.shares;
                const cost = inv.costBasis * inv.shares;
                const gain = value - cost;
                const gainPercent = cost > 0 ? (gain / cost) * 100 : 0;
                const allocPercent = totalValue > 0 ? (value / totalValue) * 100 : 0;
                const isPos = gain >= 0;
                const details = ASSET_CLASS_DETAILS[inv.assetClass] ?? { label: inv.assetClass, color: '#6b7280' };
                const isSelected = selectedInvestmentId === inv.id;

                return (
                  <motion.div
                    key={inv.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.22, delay: idx * 0.02 }}
                    onClick={() => onSelectInvestment(inv)}
                    className={`group relative rounded-2xl cursor-pointer transition-all duration-200 border ${
                      isSelected
                        ? 'bg-sky-50 dark:bg-cyan-950/30 border-sky-400/40 dark:border-cyan-500/30 shadow-md'
                        : 'bg-white dark:bg-zinc-900/60 border-slate-200/60 dark:border-zinc-800/60 hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-md'
                    }`}
                  >
                    
                    <div className="hidden md:grid md:grid-cols-[58px_1fr_84px_110px_76px_100px_32px] lg:grid-cols-[58px_1fr_76px_84px_110px_76px_100px_32px] gap-4 px-5 py-4 items-center">
                      
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-slate-300 dark:text-zinc-600 w-5 text-center shrink-0">
                          {idx + 1}
                        </span>
                        <div
                          className="h-9 w-9 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0"
                          style={{ background: `linear-gradient(135deg, ${details.color}, ${details.color}88)` }}
                        >
                          {inv.ticker.slice(0, 3)}
                        </div>
                      </div>

                      <div className="min-w-0 overflow-hidden">
                        <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate leading-tight">
                          {inv.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 select-none text-[10px] font-bold overflow-hidden truncate">
                          <span className="text-slate-400 dark:text-zinc-500 shrink-0">{inv.ticker}</span>
                          <span className="text-slate-300 dark:text-zinc-750 shrink-0">//</span>
                          <span className="uppercase truncate" style={{ color: details.color }}>
                            {details.label.split(' ')[0]}
                          </span>
                        </div>
                      </div>

                      <div className="hidden lg:flex justify-center shrink-0">
                        <Sparkline prices={inv.historicalPrices} positive={isPos} />
                      </div>

                      <div className="text-right font-black text-sm text-slate-900 dark:text-white truncate">
                        {formatCurrency(inv.price)}
                      </div>

                      <div className="flex flex-col items-end pr-2 gap-1 shrink-0">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                          {allocPercent.toFixed(1)}%
                        </span>
                        <div className="h-1 w-12 bg-slate-100 dark:bg-zinc-800/60 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${allocPercent}%`, backgroundColor: details.color }}
                          />
                        </div>
                      </div>

                      <div className={`text-right text-xs font-mono font-black shrink-0 ${isPos ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {isPos ? '+' : ''}{gainPercent.toFixed(1)}%
                      </div>

                      <div className="flex justify-end shrink-0">
                        <RiskBadge score={inv.riskScore} />
                      </div>

                      <div className="flex justify-end shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); removeInvestment(inv.id); }}
                          className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:text-zinc-600 dark:hover:text-rose-400 dark:hover:bg-rose-950/30 md:opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                          title="Remove asset"
                        >
                          <Trash2 size={13} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>

                    <div className="flex md:hidden flex-col gap-3 p-4">
                      
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-slate-300 dark:text-zinc-600 w-4 text-center">
                            {idx + 1}
                          </span>
                          <div
                            className="h-8 w-8 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0"
                            style={{ background: `linear-gradient(135deg, ${details.color}, ${details.color}88)` }}
                          >
                            {inv.ticker.slice(0, 3)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate max-w-[140px] leading-tight">
                              {inv.name}
                            </p>
                            <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-zinc-500 block mt-0.5">
                              {inv.ticker} // <span className="uppercase" style={{ color: details.color }}>{details.label.split(' ')[0]}</span>
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0">
                          <RiskBadge score={inv.riskScore} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-b border-slate-100/50 dark:border-zinc-800/40 py-2 my-0.5">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider leading-none">
                            Price
                          </span>
                          <span className="text-sm font-black text-slate-900 dark:text-white mt-1">
                            {formatCurrency(inv.price)}
                          </span>
                        </div>
                        <div className="shrink-0 pr-1">
                          <Sparkline prices={inv.historicalPrices} positive={isPos} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider leading-none">
                              Alloc.
                            </span>
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white mt-0.5">
                              {allocPercent.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider leading-none">
                              Gains
                            </span>
                            <span className={`text-xs font-black mt-0.5 ${isPos ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {isPos ? '+' : ''}{gainPercent.toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => { e.stopPropagation(); removeInvestment(inv.id); }}
                          className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:text-zinc-600 dark:hover:text-rose-400 dark:hover:bg-rose-950/30 transition-all duration-200 cursor-pointer"
                          title="Remove asset"
                        >
                          <Trash2 size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </section>

      <AddAssetModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} />
    </>
  );
}
