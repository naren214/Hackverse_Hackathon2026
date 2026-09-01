import React from 'react';
import { motion } from 'framer-motion';
import { useTimeRange } from '../context/TimeRangeContext';
import { PredictiveTrends } from '../components/analytics/PredictiveTrends';
import { AnomalyTimeline } from '../components/analytics/AnomalyTimeline';
import { CostForecast } from '../components/analytics/CostForecast';
import { StructureComparison } from '../components/analytics/StructureComparison';
import { ModelPerformance } from '../components/analytics/ModelPerformance';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export const Analytics: React.FC = () => {
  const { timeRange, setTimeRange } = useTimeRange();
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-t-text mb-1">Analytics & Insights</h1>
          <p className="text-t-muted">AI-powered predictive analytics and performance metrics</p>
        </div>
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          className="bg-t-hover border border-t-border text-t-text-secondary text-sm rounded-lg outline-none px-3 py-1.5"
        >
          <option value="1m">1 Month</option>
          <option value="3m">3 Months</option>
          <option value="6m">6 Months</option>
          <option value="1y">1 Year</option>
        </select>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants} className="h-full">
            <PredictiveTrends />
          </motion.div>
          <motion.div variants={itemVariants} className="h-full">
            <AnomalyTimeline />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants} className="h-full">
            <CostForecast />
          </motion.div>
          <motion.div variants={itemVariants} className="h-full">
            <StructureComparison />
          </motion.div>
        </div>

        <motion.div variants={itemVariants}>
          <ModelPerformance />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Analytics;
