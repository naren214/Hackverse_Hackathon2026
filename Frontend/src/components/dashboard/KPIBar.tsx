import React from 'react';
import { Building2, Activity, AlertTriangle, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockStructures, mockSensors, mockAlerts } from '../../utils/mockData';
import { StatCard } from '../common/StatCard';

const KPIBar: React.FC = () => {
  const totalStructures = mockStructures.length;
  const activeSensors = mockSensors.filter((s) => s.status === 'online').length;
  const criticalAlerts = mockAlerts.filter((a) => a.severity === 'critical').length;
  const avgHealth = Math.round(
    mockStructures.reduce((acc, curr) => acc + curr.healthScore, 0) / totalStructures
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  const sparklineData1 = [40, 50, 45, 60, 70, 65, 80];
  const sparklineData2 = [80, 85, 82, 88, 90, 87, 95];
  const sparklineData3 = [5, 4, 6, 3, 2, 4, 1];
  const sparklineData4 = [75, 78, 76, 80, 82, 81, 85];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
    >
      <motion.div variants={itemVariants}>
        <StatCard
          title="Total Structures"
          value={totalStructures}
          icon={Building2}
          trend={{ value: 2, isPositive: true }}
          color="blue"
          sparklineData={sparklineData1}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <StatCard
          title="Active Sensors"
          value={activeSensors}
          icon={Activity}
          trend={{ value: 5, isPositive: true }}
          color="green"
          sparklineData={sparklineData2}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <StatCard
          title="Critical Alerts"
          value={criticalAlerts}
          icon={AlertTriangle}
          trend={{ value: 1, isPositive: false }}
          color="red"
          sparklineData={sparklineData3}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <StatCard
          title="Avg Health Score"
          value={avgHealth}
          suffix="/100"
          icon={Heart}
          trend={{ value: 1, isPositive: true }}
          color="purple"
          sparklineData={sparklineData4}
        />
      </motion.div>
    </motion.div>
  );
};

export { KPIBar };
export default KPIBar;
