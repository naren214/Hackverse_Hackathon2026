import React, { useState } from 'react';
import { GitCompare } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { mockStructures } from '../../utils/mockData';

export const StructureComparison: React.FC = () => {
  // Generate deterministic synthetic metrics based on health score for demo
  const generateMetrics = (structure: any) => {
    const base = structure.healthScore;
    return {
      integrity: Math.min(100, base + (structure.name.length % 10)),
      corrosion: Math.min(100, base - (structure.id.length % 15)),
      vibration: Math.min(100, base + (structure.buildYear % 12) - 6),
      load: Math.min(100, base + (structure.sensorCount % 8)),
      maintenance: Math.min(100, base - (structure.activeSensors % 5)),
    };
  };

  const [selectedIds, setSelectedIds] = useState<string[]>([mockStructures[0].id, mockStructures[1].id]);

  const toggleStructure = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter(sId => sId !== id));
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      } else {
        setSelectedIds([...selectedIds.slice(1), id]);
      }
    }
  };

  const selectedStructures = mockStructures.filter(s => selectedIds.includes(s.id));
  
  const chartData = [
    { subject: 'Structural Integrity', fullMark: 100 },
    { subject: 'Corrosion Res.', fullMark: 100 },
    { subject: 'Vibration Stab.', fullMark: 100 },
    { subject: 'Load Capacity', fullMark: 100 },
    { subject: 'Maintenance', fullMark: 100 },
  ].map(metric => {
    const dataPoint: any = { subject: metric.subject, fullMark: metric.fullMark };
    selectedStructures.forEach(s => {
      const metrics = generateMetrics(s);
      if (metric.subject === 'Structural Integrity') dataPoint[s.name] = metrics.integrity;
      if (metric.subject === 'Corrosion Res.') dataPoint[s.name] = metrics.corrosion;
      if (metric.subject === 'Vibration Stab.') dataPoint[s.name] = metrics.vibration;
      if (metric.subject === 'Load Capacity') dataPoint[s.name] = metrics.load;
      if (metric.subject === 'Maintenance') dataPoint[s.name] = metrics.maintenance;
    });
    return dataPoint;
  });

  const colors = ['#3B82F6', '#8B5CF6', '#22C55E'];

  return (
    <div className="bg-t-card border border-t-border rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <GitCompare size={20} className="text-purple-500" />
          </div>
          <h2 className="text-lg font-semibold text-t-text">Structure Comparison</h2>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {mockStructures.slice(0, 5).map(s => (
          <button
            key={s.id}
            onClick={() => toggleStructure(s.id)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors border ${
              selectedIds.includes(s.id) 
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' 
                : 'bg-t-hover border-t-border text-t-muted hover:text-t-text'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="var(--color-border)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1A1D27', borderColor: '#2A2D3A', borderRadius: '8px' }}
              itemStyle={{ color: '#F1F5F9' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            {selectedStructures.map((s, idx) => (
              <Radar
                key={s.id}
                name={s.name}
                dataKey={s.name}
                stroke={colors[idx]}
                fill={colors[idx]}
                fillOpacity={0.3}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StructureComparison;
