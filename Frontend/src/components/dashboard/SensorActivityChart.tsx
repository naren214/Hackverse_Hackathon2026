import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const generateMockData = () => {
  const data = [];
  const now = new Date();
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: `${time.getHours()}:00`,
      vibration: 30 + Math.random() * 40 + (i === 5 ? 50 : 0),
      strain: 20 + Math.random() * 30,
      temperature: 45 + Math.random() * 15,
    });
  }
  return data;
};

const mockData = generateMockData();

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-t-card/90 backdrop-blur-xl border border-t-border p-3 rounded-lg shadow-xl">
        <p className="text-t-text-secondary text-sm font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-t-muted capitalize">{entry.name}:</span>
            <span className="text-t-text font-semibold">{entry.value.toFixed(1)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const SensorActivityChart: React.FC = () => {
  const [range, setRange] = useState('24H');
  const ranges = ['1H', '24H', '7D', '30D'];

  const headerAction = (
    <div className="flex bg-t-bg rounded-lg p-1 border border-t-border">
      {ranges.map((r) => (
        <button
          key={r}
          onClick={() => setRange(r)}
          className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
            range === r ? 'bg-blue-500/20 text-blue-400' : 'text-t-muted hover:text-t-text-secondary'
          }`}
        >
          {r}
        </button>
      ))}
    </div>
  );

  return (
    <Card 
      title="Sensor Activity" 
      icon={Activity}
      headerAction={headerAction}
      className="h-[400px]"
    >
      <div className="w-full h-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVibration" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorStrain" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="time" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="vibration" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorVibration)" />
            <Area type="monotone" dataKey="strain" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorStrain)" />
            <Area type="monotone" dataKey="temperature" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorTemp)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export { SensorActivityChart };
export default SensorActivityChart;
