import React from 'react';
import { Inspection } from '../../types/common.types';
import { ShieldCheck, ShieldAlert, Clock } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface ComplianceCardsProps {
  inspections: Inspection[];
}

export const ComplianceCards: React.FC<ComplianceCardsProps> = ({ inspections }) => {
  const total = inspections.length;
  const passed = inspections.filter(i => i.compliance === 'pass').length;
  const failed = inspections.filter(i => i.compliance === 'fail').length;
  const review = inspections.filter(i => i.compliance === 'review').length;
  
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

  // Mock trend data
  const trendData = [
    { name: 'W1', value: 85 },
    { name: 'W2', value: 88 },
    { name: 'W3', value: 86 },
    { name: 'W4', value: 92 },
    { name: 'W5', value: passRate },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-t-card border border-t-border rounded-xl p-5 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -right-6 -top-6 text-green-500/5">
          <ShieldCheck size={120} />
        </div>
        <div>
          <p className="text-t-muted text-sm font-medium mb-1">Compliance Rate</p>
          <div className="flex items-end space-x-2">
            <h3 className="text-3xl font-bold text-t-text">{passRate}%</h3>
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs text-green-400 bg-green-500/10 w-max px-2 py-1 rounded">
          <span className="font-medium">+2.4% from last month</span>
        </div>
      </div>

      <div className="bg-t-card border border-t-border rounded-xl p-5 flex flex-col justify-between">
        <div>
          <p className="text-t-muted text-sm font-medium mb-1">Trend (Last 5 Weeks)</p>
          <div className="h-16 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#22C55E" 
                  strokeWidth={3} 
                  dot={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-t-card border border-t-border rounded-xl p-5 flex items-center">
        <div className="p-3 bg-red-500/10 rounded-lg mr-4">
          <ShieldAlert size={24} className="text-red-500" />
        </div>
        <div>
          <p className="text-t-muted text-sm font-medium">Failed Inspections</p>
          <h3 className="text-2xl font-bold text-t-text mt-1">{failed}</h3>
        </div>
      </div>

      <div className="bg-t-card border border-t-border rounded-xl p-5 flex items-center">
        <div className="p-3 bg-amber-500/10 rounded-lg mr-4">
          <Clock size={24} className="text-amber-500" />
        </div>
        <div>
          <p className="text-t-muted text-sm font-medium">Pending Review</p>
          <h3 className="text-2xl font-bold text-t-text mt-1">{review}</h3>
        </div>
      </div>
    </div>
  );
};

export default ComplianceCards;
