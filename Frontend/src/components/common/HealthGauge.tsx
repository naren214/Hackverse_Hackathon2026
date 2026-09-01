import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export interface HealthGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

const sizes = {
  sm: { width: 64, stroke: 6, text: 'text-sm' },
  md: { width: 120, stroke: 10, text: 'text-2xl' },
  lg: { width: 180, stroke: 14, text: 'text-4xl' }
};

export const HealthGauge: React.FC<HealthGaugeProps> = ({ score, size = 'md', showLabel = true, animated = true }) => {
  const [currentScore, setCurrentScore] = useState(animated ? 0 : score);
  const { width, stroke, text } = sizes[size];
  const radius = (width - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setCurrentScore(score), 100);
      return () => clearTimeout(timer);
    }
  }, [score, animated]);

  let color = '#EF4444'; // red
  let label = 'Critical';
  if (score >= 80) {
    color = '#22C55E'; // green
    label = 'Healthy';
  } else if (score >= 50) {
    color = '#F59E0B'; // amber
    label = 'Warning';
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg width={width} height={width} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="transparent"
          className="text-t-text/10"
        />
        {/* Progress circle */}
        <motion.circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-bold text-t-text ${text}`}>
          {Math.round(currentScore)}
        </span>
      </div>
      {showLabel && (
        <div className="mt-3 text-sm font-medium" style={{ color }}>
          {label}
        </div>
      )}
    </div>
  );
};

export default HealthGauge;
