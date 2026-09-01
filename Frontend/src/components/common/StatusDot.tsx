import React from 'react';
import { clsx } from 'clsx';

export interface StatusDotProps {
  status: 'online' | 'offline' | 'warning' | 'critical';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const colors = {
  online: 'bg-[#22C55E]',
  warning: 'bg-[#F59E0B]',
  critical: 'bg-[#EF4444]',
  offline: 'bg-[#94A3B8]'
};

const sizes = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2.5 h-2.5',
  lg: 'w-3.5 h-3.5'
};

export const StatusDot: React.FC<StatusDotProps> = ({ status, size = 'md', label }) => {
  const isPulsing = status === 'online' || status === 'critical';

  return (
    <div className="flex items-center">
      <span className="relative flex">
        {isPulsing && (
          <span className={clsx(
            "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
            colors[status]
          )} />
        )}
        <span className={clsx(
          "relative inline-flex rounded-full",
          colors[status],
          sizes[size]
        )} />
      </span>
      {label && (
        <span className="ml-2 text-sm text-t-text capitalize">
          {label}
        </span>
      )}
    </div>
  );
};

export default StatusDot;
