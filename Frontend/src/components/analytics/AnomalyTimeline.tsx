import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { analyticsApi } from '../../api/analytics.api';
import { AnomalyPoint } from '../../types/analytics.types';
import { useTimeRange } from '../../context/TimeRangeContext';

export const AnomalyTimeline: React.FC = () => {
  const [anomalies, setAnomalies] = useState<AnomalyPoint[]>([]);
  const { timeRange } = useTimeRange();

  useEffect(() => {
    analyticsApi.getAnomalies(timeRange)
      .then(data => setAnomalies(data))
      .catch(err => console.error('Failed to load anomalies:', err));
  }, [timeRange]);
  const chartData = anomalies.map(a => ({
    ...a,
    formattedDate: new Date(a.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    deviation: Math.abs(a.value - a.expected)
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-t-card border border-t-border p-3 rounded-lg shadow-xl">
          <p className="text-t-text font-medium mb-1">{data.structureName}</p>
          <p className="text-t-muted text-sm mb-2">{data.sensorName}</p>
          <div className="flex justify-between text-sm">
            <span className="text-t-muted">Deviation:</span>
            <span className="text-t-text ml-4">{data.deviation.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-t-muted">Severity:</span>
            <span className={`ml-4 capitalize ${
              data.severity === 'high' ? 'text-red-500' :
              data.severity === 'medium' ? 'text-amber-500' : 'text-blue-500'
            }`}>
              {data.severity}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-t-card border border-t-border rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center space-x-2 mb-6">
        <div className="p-2 bg-yellow-500/10 rounded-lg">
          <Zap size={20} className="text-yellow-500" />
        </div>
        <h2 className="text-lg font-semibold text-t-text">Anomaly Timeline</h2>
      </div>

      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis 
              type="category" 
              dataKey="formattedDate" 
              name="Date" 
              stroke="#94A3B8" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              type="number" 
              dataKey="value" 
              name="Value" 
              stroke="#94A3B8" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <ZAxis type="number" dataKey="deviation" range={[50, 400]} name="Deviation" />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            
            <Scatter name="High" data={chartData.filter(a => a.severity === 'high')} fill="#EF4444" opacity={0.8} />
            <Scatter name="Medium" data={chartData.filter(a => a.severity === 'medium')} fill="#F59E0B" opacity={0.8} />
            <Scatter name="Low" data={chartData.filter(a => a.severity === 'low')} fill="#3B82F6" opacity={0.8} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center items-center space-x-6 mt-4 pt-4 border-t border-t-border">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
          <span className="text-sm text-t-muted">High</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
          <span className="text-sm text-t-muted">Medium</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#FDE047]" />
          <span className="text-sm text-t-muted">Low</span>
        </div>
      </div>
    </div>
  );
};

export default AnomalyTimeline;
