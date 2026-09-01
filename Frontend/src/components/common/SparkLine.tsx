import React from 'react';

export interface SparkLineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  filled?: boolean;
}

export const SparkLine: React.FC<SparkLineProps> = ({ 
  data, 
  color = '#3B82F6', 
  width = 120, 
  height = 40,
  filled = true 
}) => {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1; // Prevent div by 0

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      {filled && (
        <defs>
          <linearGradient id={`sparkline-gradient-${color}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      )}
      
      {filled && (
        <polygon 
          points={areaPoints} 
          fill={`url(#sparkline-gradient-${color})`} 
        />
      )}
      
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

export default SparkLine;
