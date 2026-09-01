import React, { useEffect, useState } from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

import { clsx } from 'clsx';
import { Card } from './Card';

export interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  secondaryStat?: React.ReactNode;
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
  sparklineData?: number[];
}

const colorMap = {
  blue: { bg: 'bg-[#3B82F6]/10', text: 'text-[#3B82F6]' },
  green: { bg: 'bg-[#22C55E]/10', text: 'text-[#22C55E]' },
  amber: { bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]' },
  red: { bg: 'bg-[#EF4444]/10', text: 'text-[#EF4444]' },
  purple: { bg: 'bg-[#8B5CF6]/10', text: 'text-[#8B5CF6]' },
};

export const StatCard: React.FC<StatCardProps> = ({
  title, value, prefix = '', suffix = '', icon: Icon, trend, secondaryStat, color = 'blue', sparklineData
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <Card className="relative overflow-hidden group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-t-muted">{title}</p>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-bold text-t-text tracking-tight">
              {prefix}{displayValue.toLocaleString()}{suffix}
            </span>
          </div>
          {(trend || secondaryStat) && (
            <div className="flex items-center mt-2 space-x-3">
              {trend && (
                <div className={clsx("flex items-center text-sm font-medium", trend.isPositive ? "text-[#22C55E]" : "text-[#EF4444]")}>
                  {trend.isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                  <span>{Math.abs(trend.value)}%</span>
                </div>
              )}
              {secondaryStat && (
                <div className="text-sm">
                  {secondaryStat}
                </div>
              )}
            </div>
          )}
        </div>
        <div className={clsx("p-3 rounded-xl transition-transform duration-300 group-hover:scale-110", colorMap[color].bg)}>
          <Icon className={clsx("w-6 h-6", colorMap[color].text)} />
        </div>
      </div>
      
      {sparklineData && (
        <div className="absolute bottom-0 left-0 right-0 h-12 opacity-30">
           {/* Simple placeholder for sparkline visual */}
           <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
             <path d="M0 100 L 20 80 L 40 90 L 60 40 L 80 50 L 100 20 L 100 100 Z" fill="currentColor" className={colorMap[color].text} opacity="0.2"/>
             <path d="M0 100 L 20 80 L 40 90 L 60 40 L 80 50 L 100 20" fill="none" stroke="currentColor" strokeWidth="2" className={colorMap[color].text}/>
           </svg>
        </div>
      )}
    </Card>
  );
};

export default StatCard;
