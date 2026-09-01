import React from 'react';
import { LucideIcon, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles = {
  primary: 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] border-transparent',
  secondary: 'bg-t-border text-t-text hover:bg-t-hover border-t-border',
  ghost: 'bg-transparent text-t-muted hover:text-t-text hover:bg-t-hover border-transparent',
  danger: 'bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] border-transparent',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center font-medium rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3B82F6] focus:ring-offset-t-bg',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-60 cursor-not-allowed hover:shadow-none',
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : Icon ? (
        <Icon className={clsx("w-4 h-4", children ? "mr-2" : "")} />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
