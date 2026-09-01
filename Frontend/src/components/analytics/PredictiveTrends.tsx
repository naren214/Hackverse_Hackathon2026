import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import { mockPredictions } from '../../utils/mockData';

export const PredictiveTrends: React.FC = () => {
  const [timeRange, setTimeRange] = useState('6m');

  return (
    <div className="bg-t-card border border-t-border rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <TrendingUp size={20} className="text-blue-500" />
          </div>
          <h2 className="text-lg font-semibold text-t-text">Predictive Health Trends</h2>
        </div>
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-t-hover border border-t-border text-t-text-secondary text-sm rounded-lg outline-none px-3 py-1.5"
        >
          <option value="1m">1 Month</option>
          <option value="3m">3 Months</option>
          <option value="6m">6 Months</option>
          <option value="1y">1 Year</option>
        </select>
      </div>

      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockPredictions} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} domain={[60, 100]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1A1D27', borderColor: '#2A2D3A', borderRadius: '8px' }}
              itemStyle={{ color: '#F1F5F9' }}
            />
            {/* Confidence band */}
            <Area 
              type="monotone" 
              dataKey="predicted" 
              stroke="none" 
              fillOpacity={1} 
              fill="url(#colorConfidence)" 
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              name="Predicted"
              stroke="#3B82F6" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="actual" 
              name="Actual"
              stroke="#22C55E" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center items-center space-x-6 mt-4 pt-4 border-t border-t-border">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
          <span className="text-sm text-t-muted">Actual Health</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full border-2 border-[#3B82F6] border-dashed" />
          <span className="text-sm text-t-muted">Predicted Health</span>
        </div>
      </div>
    </div>
  );
};

export default PredictiveTrends;
