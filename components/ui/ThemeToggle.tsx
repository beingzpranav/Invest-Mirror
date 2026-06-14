'use client';

import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      style={{ width: 68 }}
      className="relative flex h-9 cursor-pointer items-center rounded-full bg-zinc-200 dark:bg-zinc-800 p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shrink-0"
    >
      {/* Track icons */}
      <span className="absolute left-2 text-amber-500 dark:text-zinc-600">
        <Sun size={13} strokeWidth={2.5} />
      </span>
      <span className="absolute right-2 text-zinc-400 dark:text-violet-400">
        <Moon size={13} strokeWidth={2.5} />
      </span>

      {/* Sliding knob */}
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white dark:bg-zinc-950 shadow-md"
        style={{ x: isDark ? 30 : 0 }}
      >
        {isDark ? (
          <Moon size={13} className="text-violet-400" strokeWidth={2.5} />
        ) : (
          <Sun size={13} className="text-amber-500" strokeWidth={2.5} />
        )}
      </motion.span>
    </button>
  );
}
