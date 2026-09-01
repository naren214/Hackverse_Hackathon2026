import React from 'react';
import { KPIBar } from '../components/dashboard/KPIBar';
import { InfrastructureMap } from '../components/dashboard/InfrastructureMap';
import { AlertsFeed } from '../components/dashboard/AlertsFeed';
import { SensorActivityChart } from '../components/dashboard/SensorActivityChart';
import { HealthOverview } from '../components/dashboard/HealthOverview';
import { RecentInspections } from '../components/dashboard/RecentInspections';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <div className="w-full min-h-screen bg-t-bg text-t-text p-4 md:p-6 lg:p-8 overflow-x-hidden">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 mb-2">
            Dashboard
          </h1>
          <p className="text-t-muted text-sm md:text-base">
            Real-time infrastructure monitoring overview
          </p>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
          
          <motion.div variants={itemVariants}>
            <KPIBar />
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <InfrastructureMap />
            </div>
            <div className="lg:col-span-4">
              <AlertsFeed />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <SensorActivityChart />
            </div>
            <div className="lg:col-span-4">
              <HealthOverview />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <RecentInspections />
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
