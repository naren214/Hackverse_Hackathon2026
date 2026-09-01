import React from 'react';
import { Brain, Activity } from 'lucide-react';
import { mockModelMetrics } from '../../utils/mockData';

export const ModelPerformance: React.FC = () => {
  return (
    <div className="bg-t-card border border-t-border rounded-xl p-6">
      <div className="flex items-center space-x-2 mb-6">
        <div className="p-2 bg-indigo-500/10 rounded-lg">
          <Brain size={20} className="text-indigo-500" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-t-text">AI Model Performance</h2>
          <p className="text-sm text-t-muted">Real-time metrics for deployed machine learning models</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockModelMetrics.map((model, idx) => (
          <div key={idx} className="bg-t-hover border border-t-border rounded-xl p-5 hover:border-indigo-500/30 transition-colors">
            <h3 className="text-t-text font-medium mb-4 truncate">{model.name}</h3>
            
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="var(--color-border)" strokeWidth="8" fill="none" />
                  <circle 
                    cx="50" cy="50" r="40" 
                    stroke="#6366F1" strokeWidth="8" fill="none" 
                    strokeDasharray="251.2" 
                    strokeDashoffset={251.2 - (251.2 * model.accuracy) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-t-text">{model.accuracy}%</span>
                  <span className="text-[10px] text-t-muted uppercase tracking-wider">Accuracy</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center border-t border-t-border pt-4 mb-4">
              <div>
                <p className="text-lg font-semibold text-t-text">{model.precision}%</p>
                <p className="text-xs text-t-muted">Precision</p>
              </div>
              <div className="border-x border-t-border">
                <p className="text-lg font-semibold text-t-text">{model.recall}%</p>
                <p className="text-xs text-t-muted">Recall</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-t-text">{model.f1Score}%</p>
                <p className="text-xs text-t-muted">F1 Score</p>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-t-muted mt-4 bg-t-card p-2 rounded-lg">
              <span className="flex items-center"><Activity size={12} className="mr-1" /> {(model.dataPoints / 1000).toFixed(1)}k points</span>
              <span>Updated {model.lastTrained}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelPerformance;
