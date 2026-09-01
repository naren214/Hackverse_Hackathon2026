import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../common/Card';
import { BarChart as BarChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { structuresApi } from '../../api/structures.api';
import { Structure } from '../../types/structure.types';

const getHealthColor = (score: number) => {
  if (score >= 80) return '#22C55E';
  if (score >= 50) return '#F59E0B';
  return '#EF4444';
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-t-card/90 backdrop-blur-xl border border-t-border p-3 rounded-lg shadow-xl">
        <p className="text-t-text font-bold mb-1">{data.name}</p>
        <p className="text-sm text-t-muted mb-2">{data.type}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-t-muted">Health Score:</span>
          <span className="text-lg font-bold" style={{ color: getHealthColor(data.healthScore) }}>
            {data.healthScore}/100
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export const HealthOverview: React.FC = () => {
  const [structures, setStructures] = useState<Structure[]>([]);

  useEffect(() => {
    structuresApi.getStructures()
      .then(data => setStructures(data))
      .catch(err => console.error('Failed to load structures:', err));
  }, []);

  const data = useMemo(() => {
    return [...structures]
      .sort((a, b) => b.healthScore - a.healthScore)
      .slice(0, 8); // top 8
  }, [structures]);

  return (
    <Card 
      title="Structure Health Ranking" 
      icon={BarChartIcon}
      className="h-[400px]"
      headerAction={<span className="text-xs text-t-muted bg-t-hover px-2 py-1 rounded">Current</span>}
    >
      <div className="w-full h-full pt-2 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={true} vertical={false} />
            <XAxis type="number" domain={[0, 100]} stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={11} width={80} tickLine={false} axisLine={false} />
            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} content={<CustomTooltip />} />
            <Bar dataKey="healthScore" radius={[0, 4, 4, 0]} barSize={16}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getHealthColor(entry.healthScore)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
