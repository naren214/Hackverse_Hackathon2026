import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

export interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
  noPadding?: boolean;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  icon: Icon,
  children,
  className,
  headerAction,
  noPadding = false,
  hoverable = false,
}) => {
  return (
    <div 
      className={clsx(
        'bg-t-card/80 backdrop-blur-xl border border-t-border rounded-xl overflow-hidden transition-all duration-300 shadow-card flex flex-col',
        hoverable && 'hover:shadow-glow hover:-translate-y-1',
        className
      )}
    >
      {(title || Icon || headerAction) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-t-border">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className="p-2 bg-[#3B82F6]/10 rounded-lg">
                <Icon className="w-5 h-5 text-[#3B82F6]" />
              </div>
            )}
            <div>
              {title && <h3 className="font-semibold text-t-text">{title}</h3>}
              {subtitle && <p className="text-xs text-t-muted mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className={clsx('flex-1 min-h-0', !noPadding && 'p-6')}>
        {children}
      </div>
    </div>
  );
};

export default Card;
