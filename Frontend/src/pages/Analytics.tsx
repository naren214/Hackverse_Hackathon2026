import React from 'react';
import { motion } from 'framer-motion';
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
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-t-text mb-1">Analytics & Insights</h1>
        <p className="text-t-muted">AI-powered predictive analytics and performance metrics</p>
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
