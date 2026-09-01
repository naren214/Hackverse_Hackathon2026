import React, { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { analyticsApi } from '../../api/analytics.api';
import { CostForecast as CostForecastType } from '../../types/analytics.types';
import { useTimeRange } from '../../context/TimeRangeContext';

export const CostForecast: React.FC = () => {
  const [forecasts, setForecasts] = useState<CostForecastType[]>([]);
  const { timeRange } = useTimeRange();

  useEffect(() => {
    analyticsApi.getCostForecasts(timeRange)
      .then(data => setForecasts(data))
      .catch(err => console.error('Failed to load cost forecasts:', err));
  }, [timeRange]);

  const totalPredicted = forecasts.reduce((sum, item) => sum + item.predicted, 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-t-card border border-t-border p-3 rounded-lg shadow-xl">
          <p className="text-t-text font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between items-center space-x-4 mb-1 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-t-muted capitalize">{entry.name}</span>
              </div>
              <span className="text-t-text font-mono">${entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-t-card border border-t-border rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <DollarSign size={20} className="text-green-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-t-text">Maintenance Cost Forecast</h2>
            <p className="text-sm text-t-muted">Total Predicted: ${totalPredicted.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={forecasts} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis 
              stroke="#94A3B8" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#222530' }} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="actual" name="Actual Cost" fill="#22C55E" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="predicted" name="Predicted Cost" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CostForecast;
