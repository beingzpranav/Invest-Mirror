'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, ChevronDown } from 'lucide-react';
import { usePortfolio, NewAssetForm } from '@/lib/PortfolioContext';
import { AssetClass } from '@/lib/types';
import { ASSET_CLASS_DETAILS } from '@/lib/utils';

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ASSET_CLASSES: { value: AssetClass; label: string }[] = [
  { value: 'equity', label: 'Equities / Stocks' },
  { value: 'mutual_fund', label: 'Mutual Funds' },
  { value: 'crypto', label: 'Cryptocurrency' },
  { value: 'fixed_income', label: 'Fixed Income / Bonds' },
  { value: 'cash', label: 'Cash & Deposits' },
  { value: 'commodities', label: 'Commodities / Gold' },
  { value: 'real_estate', label: 'Real Estate / REITs' },
];

const EMPTY_FORM: NewAssetForm = {
  name: '',
  ticker: '',
  assetClass: 'equity',
  price: '',
  shares: '',
  costBasis: '',
  riskScore: '7',
  annualReturn: '',
  investmentDate: new Date().toISOString().split('T')[0],
};

export default function AddAssetModal({ isOpen, onClose }: AddAssetModalProps) {
  const { addInvestment } = usePortfolio();
  const [form, setForm] = useState<NewAssetForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof NewAssetForm, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isRiskManual, setIsRiskManual] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setForm(EMPTY_FORM);
      setErrors({});
      setSubmitted(false);
      setIsRiskManual(false);
      setTimeout(() => firstInputRef.current?.focus(), 120);
    }
  }, [isOpen]);

  // Automatically calculate risk score based on asset class
  useEffect(() => {
    if (isRiskManual) return;
    const defaultRisks: Record<AssetClass, string> = {
      crypto: '9',
      equity: '7',
      mutual_fund: '5',
      real_estate: '5',
      commodities: '3',
      fixed_income: '2',
      cash: '1',
    };
    setForm((prev) => ({
      ...prev,
      riskScore: defaultRisks[prev.assetClass] || '5',
    }));
  }, [form.assetClass, isRiskManual]);

  const set = (key: keyof NewAssetForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const validate = (): boolean => {
    const errs: Partial<Record<keyof NewAssetForm, string>> = {};
    if (!form.name.trim()) errs.name = 'Asset name is required';
    if (!form.ticker.trim()) errs.ticker = 'Ticker is required';
    if (!form.price || isNaN(+form.price) || +form.price <= 0) errs.price = 'Enter a valid price > 0';
    if (!form.shares || isNaN(+form.shares) || +form.shares <= 0) errs.shares = 'Enter a valid quantity > 0';
    if (form.riskScore && (+form.riskScore < 1 || +form.riskScore > 10)) errs.riskScore = '1–10 only';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    addInvestment(form);
    setSubmitted(true);
    setTimeout(() => onClose(), 900);
  };

  const accent = ASSET_CLASS_DETAILS[form.assetClass]?.color ?? '#06b6d4';

  const inputClass = (key: keyof NewAssetForm) =>
    `w-full rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-zinc-800/70 border transition-all duration-150 outline-none focus:ring-2 focus:ring-sky-500/60 dark:focus:ring-cyan-500/60 ${
      errors[key]
        ? 'border-rose-500/60 bg-rose-50 dark:bg-rose-900/20'
        : 'border-slate-200/60 dark:border-zinc-700/60 focus:border-sky-400 dark:focus:border-cyan-500'
    }`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal sheet */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="fixed inset-x-4 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 w-full sm:max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200/50 dark:border-zinc-800/60 overflow-hidden">
              {/* Colored accent strip */}
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl transition-colors duration-300"
                style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
              />

              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Add New Asset</h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Enter the details of your investment</p>
                </div>
                <button
                  onClick={onClose}
                  className="h-8 w-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-6 pb-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">

                {/* Name + Ticker */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-1.5">Asset Name *</label>
                    <input
                      ref={firstInputRef}
                      type="text"
                      value={form.name}
                      onChange={set('name')}
                      placeholder="e.g. Nifty 50 Fund"
                      className={inputClass('name')}
                    />
                    {errors.name && <p className="text-[10px] text-rose-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-1.5">Ticker *</label>
                    <input
                      type="text"
                      value={form.ticker}
                      onChange={set('ticker')}
                      placeholder="e.g. NIFTY50"
                      className={inputClass('ticker')}
                    />
                    {errors.ticker && <p className="text-[10px] text-rose-500 mt-1">{errors.ticker}</p>}
                  </div>
                </div>

                {/* Asset Class */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-1.5">Asset Class *</label>
                  <div className="relative">
                    <select
                      value={form.assetClass}
                      onChange={set('assetClass')}
                      className="w-full rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-zinc-800/70 border border-slate-200/60 dark:border-zinc-700/60 appearance-none outline-none focus:ring-2 focus:ring-sky-500/60 dark:focus:ring-cyan-500/60 cursor-pointer transition-all"
                    >
                      {ASSET_CLASSES.map((ac) => (
                        <option key={ac.value} value={ac.value}>{ac.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Price + Shares */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-1.5">Current Price *</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={form.price}
                      onChange={set('price')}
                      placeholder="0.00"
                      className={inputClass('price')}
                    />
                    {errors.price && <p className="text-[10px] text-rose-500 mt-1">{errors.price}</p>}
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-1.5">Quantity / Units *</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={form.shares}
                      onChange={set('shares')}
                      placeholder="0"
                      className={inputClass('shares')}
                    />
                    {errors.shares && <p className="text-[10px] text-rose-500 mt-1">{errors.shares}</p>}
                  </div>
                </div>

                {/* Cost Basis + Risk */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-1.5">Avg. Buy Price</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={form.costBasis}
                      onChange={set('costBasis')}
                      placeholder="Leave blank = current price"
                      className={inputClass('costBasis')}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400">Risk Score (1–10)</label>
                      <span className={`text-[9px] px-2 py-0.5 rounded-md font-extrabold uppercase tracking-wider transition-all duration-300 ${
                        isRiskManual
                          ? 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400'
                          : 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400'
                      }`}>
                        {isRiskManual ? 'Custom' : 'Auto'}
                      </span>
                    </div>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      max="10"
                      value={form.riskScore}
                      onChange={(e) => {
                        setIsRiskManual(true);
                        setForm((prev) => ({ ...prev, riskScore: e.target.value }));
                      }}
                      placeholder="5"
                      className={inputClass('riskScore')}
                    />
                    {errors.riskScore && <p className="text-[10px] text-rose-500 mt-1">{errors.riskScore}</p>}
                  </div>
                </div>

                {/* Annual Return + Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-1.5">Expected Return %</label>
                    <input
                      type="number"
                      step="any"
                      value={form.annualReturn}
                      onChange={set('annualReturn')}
                      placeholder="e.g. 12.5"
                      className={inputClass('annualReturn')}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400 block mb-1.5">Investment Date</label>
                    <input
                      type="date"
                      value={form.investmentDate}
                      onChange={set('investmentDate')}
                      className={inputClass('investmentDate')}
                    />
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={submitted}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-1 h-12 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  style={{
                    background: submitted
                      ? '#10b981'
                      : `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                    color: '#fff',
                    boxShadow: `0 4px 20px ${accent}40`,
                  }}
                >
                  {submitted ? (
                    <>✓ Asset Added!</>
                  ) : (
                    <>
                      <Plus size={16} strokeWidth={2.5} />
                      Add to Portfolio
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
