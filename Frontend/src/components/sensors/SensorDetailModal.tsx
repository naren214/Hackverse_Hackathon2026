import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Battery, Activity, Calendar, Settings2 } from 'lucide-react';
import { Sensor } from '../../types/sensor.types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import clsx from 'clsx';

interface SensorDetailModalProps {
  sensor: Sensor | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SensorDetailModal: React.FC<SensorDetailModalProps> = ({ sensor, isOpen, onClose }) => {
  if (!sensor) return null;

  const isWarning = sensor.value > sensor.threshold.max || sensor.value < sensor.threshold.min;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-t-card border border-t-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-6 border-b border-t-border">
              <div>
                <h2 className="text-2xl font-semibold text-t-text">{sensor.name}</h2>
                <p className="text-t-muted">{sensor.structureName}</p>
              </div>
              <button onClick={onClose} className="p-2 text-t-muted hover:text-t-text hover:bg-t-hover rounded-lg transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-t-hover p-4 rounded-xl border border-t-border">
                  <div className="flex items-center space-x-2 text-t-muted mb-2">
                    <Activity size={16} />
                    <span className="text-sm font-medium">Current Value</span>
                  </div>
                  <div className="flex items-end space-x-2">
                    <span className={clsx("text-3xl font-bold", isWarning ? "text-red-400" : "text-emerald-400")}>
                      {sensor.value.toFixed(2)}
                    </span>
                    <span className="text-t-muted pb-1">{sensor.unit}</span>
                  </div>
                </div>
                
                <div className="bg-t-hover p-4 rounded-xl border border-t-border">
                  <div className="flex items-center space-x-2 text-t-muted mb-2">
                    <Battery size={16} />
                    <span className="text-sm font-medium">Battery Level</span>
                  </div>
                  <div className="text-2xl font-bold text-t-text mb-2">{Number(sensor.battery.toFixed(2))}%</div>
                  <div className="h-1.5 w-full bg-t-card rounded-full overflow-hidden">
                    <div 
                      className={clsx("h-full", sensor.battery > 60 ? 'bg-green-500' : sensor.battery > 30 ? 'bg-amber-500' : 'bg-red-500')}
                      style={{ width: `${sensor.battery}%` }}
                    />
                  </div>
                </div>

                <div className="bg-t-hover p-4 rounded-xl border border-t-border">
                  <div className="flex items-center space-x-2 text-t-muted mb-2">
                    <Settings2 size={16} />
                    <span className="text-sm font-medium">Thresholds</span>
                  </div>
                  <div className="text-lg font-semibold text-t-text">
                    {sensor.threshold.min} - {sensor.threshold.max} <span className="text-sm text-t-muted font-normal">{sensor.unit}</span>
                  </div>
                </div>

                <div className="bg-t-hover p-4 rounded-xl border border-t-border">
                  <div className="flex items-center space-x-2 text-t-muted mb-2">
                    <Calendar size={16} />
                    <span className="text-sm font-medium">Last Reading</span>
                  </div>
                  <div className="text-lg font-semibold text-t-text">
                    {new Date(sensor.lastReading).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="mb-8 bg-t-hover p-6 rounded-xl border border-t-border">
                <h3 className="text-lg font-medium text-t-text mb-6">Historical Data</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sensor.history}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                      <XAxis dataKey="time" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1A1D27', borderColor: '#2A2D3A', borderRadius: '8px' }}
                        itemStyle={{ color: '#F1F5F9' }}
                      />
                      <ReferenceLine y={sensor.threshold.max} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'Max', fill: '#ef4444', fontSize: 12 }} />
                      <ReferenceLine y={sensor.threshold.min} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'bottom', value: 'Min', fill: '#ef4444', fontSize: 12 }} />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6, fill: '#3B82F6', stroke: '#1A1D27', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-t-hover p-6 rounded-xl border border-t-border">
                <h3 className="text-lg font-medium text-t-text mb-4">Device Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between py-2 border-b border-t-border">
                    <span className="text-t-muted">Sensor ID</span>
                    <span className="text-t-text font-mono">{sensor.id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-t-border">
                    <span className="text-t-muted">Type</span>
                    <span className="text-t-text capitalize">{sensor.type}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-t-border">
                    <span className="text-t-muted">Install Date</span>
                    <span className="text-t-text">{sensor.installDate}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-t-border">
                    <span className="text-t-muted">Position (X,Y,Z)</span>
                    <span className="text-t-text">{sensor.position.x}, {sensor.position.y}, {sensor.position.z}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-t-border">
                    <span className="text-t-muted">Structure ID</span>
                    <span className="text-t-text font-mono">{sensor.structureId}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-t-border">
                    <span className="text-t-muted">Status</span>
                    <span className={clsx("capitalize", sensor.status === 'online' ? 'text-emerald-400' : sensor.status === 'warning' ? 'text-amber-400' : 'text-red-400')}>
                      {sensor.status}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SensorDetailModal;
