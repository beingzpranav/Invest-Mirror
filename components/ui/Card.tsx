'use client';

import React, { useRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: boolean;
  interactive?: boolean;
}

export default function Card({
  children,
  className,
  glow = true,
  interactive = false,
  ...props
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !glow) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        'glass-panel rounded-2xl p-6 glow-card gradient-border-mask relative overflow-hidden',
        interactive && 'hover:-translate-y-1 hover:shadow-2xl hover:border-sky-500/30 dark:hover:border-cyan-500/30 cursor-pointer',
        className
      )}
      {...props}
    >
      <div className="relative z-10 flex flex-col h-full w-full">{children}</div>
    </div>
  );
}
