import React from 'react';
import { clsx } from 'clsx';

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  variant = 'text', 
  width, 
  height, 
  count = 1,
  className 
}) => {
  const baseClasses = 'bg-t-border animate-pulse relative overflow-hidden';
  
  const renderSkeleton = (key: number) => {
    let classes = '';
    
    switch (variant) {
      case 'circular':
        classes = 'rounded-full';
        break;
      case 'rectangular':
        classes = 'rounded-md';
        break;
      case 'card':
        classes = 'rounded-xl h-48 w-full';
        break;
      case 'text':
      default:
        classes = 'rounded h-4 w-full mb-2 last:mb-0';
        break;
    }

    return (
      <div 
        key={key} 
        className={clsx(baseClasses, classes, className)} 
        style={{ width, height }}
      >
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
    );
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => renderSkeleton(i))}
    </>
  );
};

export default Skeleton;
