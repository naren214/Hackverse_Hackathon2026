import React from 'react';
import { Activity, Thermometer, Gauge, Move, RotateCcw, Droplets, FlaskConical } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Sensor } from '../../types/sensor.types';
import { SparkLine } from '../common/SparkLine';

interface SensorCardProps {
  sensor: Sensor;
  onClick?: (sensor: Sensor) => void;
}

const getSensorIcon = (type: Sensor['type']) => {
  switch (type) {
    case 'vibration': return <Activity size={20} className="text-blue-400" />;
    case 'temperature': return <Thermometer size={20} className="text-red-400" />;
    case 'strain': return <Gauge size={20} className="text-emerald-400" />;
    case 'displacement': return <Move size={20} className="text-purple-400" />;
    case 'tilt': return <RotateCcw size={20} className="text-amber-400" />;
    case 'humidity': return <Droplets size={20} className="text-cyan-400" />;
    case 'corrosion': return <FlaskConical size={20} className="text-orange-400" />;
    default: return <Activity size={20} />;
  }
};

const getStatusColor = (status: Sensor['status']) => {
  switch (status) {
    case 'online': return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]';
    case 'warning': return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]';
    case 'offline': return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]';
    default: return 'bg-slate-500';
  }
};

const getBatteryColor = (level: number) => {
  if (level > 60) return 'bg-green-500';
  if (level >= 30) return 'bg-amber-500';
  return 'bg-red-500';
};

export const SensorCard: React.FC<SensorCardProps> = ({ sensor, onClick }) => {
  const thresholdPercentage = Math.min(100, Math.max(0, 
    ((sensor.value - sensor.threshold.min) / (sensor.threshold.max - sensor.threshold.min)) * 100
  ));

  const isWarning = sensor.value > sensor.threshold.max || sensor.value < sensor.threshold.min;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="bg-t-card border border-t-border rounded-xl p-5 cursor-pointer hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
      onClick={() => onClick?.(sensor)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3 min-w-0 flex-1 mr-4">
          <div className="p-2 bg-t-hover rounded-lg border border-t-border shrink-0">
            {getSensorIcon(sensor.type)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-t-text font-medium truncate">{sensor.name}</h3>
            <p className="text-t-muted text-sm truncate">{sensor.structureName}</p>
          </div>
        </div>
        <div className={clsx('w-3 h-3 rounded-full animate-pulse shrink-0', getStatusColor(sensor.status))} />
      </div>

      <div className="flex items-end space-x-2 mb-4">
        <span className={clsx("text-3xl font-bold", isWarning ? "text-red-400" : "text-t-text")}>
          {sensor.value.toFixed(2)}
        </span>
        <span className="text-t-muted pb-1">{sensor.unit}</span>
      </div>

      <div className="h-12 mb-4 w-full">
        <SparkLine data={sensor.history.map(r => r.value)} color={isWarning ? '#ef4444' : '#3b82f6'} />
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs text-t-muted mb-1">
            <span>Threshold Range</span>
            <span>{sensor.threshold.min} - {sensor.threshold.max}</span>
          </div>
          <div className="h-1.5 w-full bg-t-border rounded-full overflow-hidden relative">
            <div 
              className={clsx("absolute top-0 bottom-0 left-0 transition-all", isWarning ? "bg-red-500" : "bg-blue-500")}
              style={{ width: `${thresholdPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-t-muted">Battery:</span>
            <div className="w-16 h-1.5 bg-t-border rounded-full overflow-hidden">
              <div 
                className={clsx("h-full transition-all", getBatteryColor(sensor.battery))}
                style={{ width: `${sensor.battery}%` }}
              />
            </div>
            <span className="text-t-text-secondary">{Number(sensor.battery.toFixed(2))}%</span>
          </div>
          <span className="text-t-muted">Last: {new Date(sensor.lastReading).toLocaleTimeString()}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default SensorCard;
