import React from 'react';
import { clsx } from 'clsx';

export interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';
  size?: 'sm' | 'md';
  dot?: boolean;
  pulse?: boolean;
}

const variants = {
  success: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
  warning: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  danger: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
  info: 'bg-[#0EA5E9]/10 text-[#0EA5E9] border-[#0EA5E9]/20',
  primary: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20',
  neutral: 'bg-t-hover text-t-muted border-t-border',
};

const dotColors = {
  success: 'bg-[#22C55E]',
  warning: 'bg-[#F59E0B]',
  danger: 'bg-[#EF4444]',
  info: 'bg-[#0EA5E9]',
  primary: 'bg-[#3B82F6]',
  neutral: 'bg-[#94A3B8]',
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'md',
  dot = false,
  pulse = false,
}) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium border rounded-full',
        variants[variant],
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      {dot && (
        <span className="relative flex w-2 h-2 mr-2">
          {pulse && (
            <span className={clsx("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", dotColors[variant])} />
          )}
          <span className={clsx("relative inline-flex rounded-full w-2 h-2", dotColors[variant])} />
        </span>
      )}
      {label}
    </span>
  );
};

export default Badge;
