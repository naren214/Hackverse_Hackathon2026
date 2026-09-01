import React from 'react';
import { motion } from 'framer-motion';
import { Sensor } from '../../types/sensor.types';
import { SensorCard } from './SensorCard';

interface SensorGridProps {
  sensors: Sensor[];
  onSensorClick?: (sensor: Sensor) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const SensorGrid: React.FC<SensorGridProps> = ({ sensors, onSensorClick }) => {
  if (sensors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-t-muted">
        <p>No sensors match the current filter.</p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {sensors.map((sensor) => (
        <motion.div key={sensor.id} variants={itemVariants}>
          <SensorCard sensor={sensor} onClick={onSensorClick} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SensorGrid;
