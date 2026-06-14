'use client';

import { useState } from 'react';
import Card from '../ui/Card';
import { Investment } from '@/lib/types';
import { getAssetAllocation, formatCurrency } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { PieChart as ChartIcon } from 'lucide-react';

interface AssetAllocationProps {
  investments: Investment[];
}

export default function AssetAllocation({ investments }: AssetAllocationProps) {
  const data = getAssetAllocation(investments);
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  // Fallback if no data
  if (data.length === 0) return null;

  // Active slice details
  const activeItem = activeIndex !== null ? data[activeIndex] : data[0];

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    // Keep the last hovered index active instead of resetting to null to prevent empty state in center
  };

  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-purple-400 flex items-center justify-center">
          <ChartIcon size={16} />
        </div>
        <div>
          <h2 className="text-sm font-bold tracking-wider uppercase text-slate-500 dark:text-zinc-400">
            Asset Allocation
          </h2>
          <p className="text-xs text-slate-400 dark:text-zinc-500 font-semibold">
            Capital distribution by asset type
          </p>
        </div>
      </div>

      {/* Donut Layout */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-auto">
        {/* Pie container with absolute centered text label */}
        <div className="relative w-[180px] h-[180px] shrink-0">
          {/* Centered label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-10">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest max-w-[110px] truncate">
              {activeItem?.name || 'Asset Class'}
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white leading-tight">
              {formatCurrency(activeItem?.value || 0)}
            </span>
            <span className="text-xs font-bold text-sky-500 dark:text-cyan-400 mt-0.5">
              {activeItem?.percentage.toFixed(1)}%
            </span>
          </div>

          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                cursor="pointer"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    style={{
                      filter: activeIndex === index 
                        ? `drop-shadow(0px 0px 8px ${entry.color}80)` 
                        : 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transformOrigin: '50% 50%',
                      transform: activeIndex === index ? 'scale(1.04)' : 'scale(1)'
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend listing */}
        <div className="flex flex-col gap-3.5 w-full">
          {data.map((item, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                key={item.name}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex items-center justify-between p-2 rounded-xl border border-transparent transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-slate-100/60 dark:bg-zinc-800/40 border-slate-200/50 dark:border-zinc-700/30 scale-[1.01]'
                    : 'hover:bg-slate-50 dark:hover:bg-zinc-900/30'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="h-3.5 w-3.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: item.color,
                      boxShadow: isActive ? `0 0 8px ${item.color}` : 'none'
                    }}
                  />
                  <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 truncate">
                    {item.name}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-slate-900 dark:text-white block">
                    {formatCurrency(item.value)}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 block leading-tight">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
