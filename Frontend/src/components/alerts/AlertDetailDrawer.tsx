import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, AlertCircle, Info, Lightbulb, MapPin, Activity, Clock, Check } from 'lucide-react';
import clsx from 'clsx';
import { Alert } from '../../types/alert.types';

interface AlertDetailDrawerProps {
  alert: Alert | null;
  isOpen: boolean;
  onClose: () => void;
  onAcknowledge?: (id: string) => void;
  onResolve?: (id: string) => void;
}

export const AlertDetailDrawer: React.FC<AlertDetailDrawerProps> = ({ alert, isOpen, onClose, onAcknowledge, onResolve }) => {
  if (!alert) return null;

  const getSeverityStyles = () => {
    switch (alert.severity) {
      case 'critical': return { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-500', icon: <AlertTriangle className="text-red-500" size={24} /> };
      case 'warning': return { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-500', icon: <AlertCircle className="text-amber-500" size={24} /> };
      case 'info': return { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-500', icon: <Info className="text-blue-500" size={24} /> };
    }
  };

  const styles = getSeverityStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-t-card border-l border-t-border shadow-2xl z-50 flex flex-col"
          >
            <div className={clsx("p-6 border-b border-t-border flex items-start justify-between", styles.bg)}>
              <div className="flex items-start space-x-4">
                <div className={clsx("p-2 rounded-xl bg-t-card border", styles.border)}>
                  {styles.icon}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={clsx("text-xs font-bold uppercase tracking-wider", styles.text)}>
                      {alert.severity} ALERT
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-500" />
                    <span className="text-xs text-t-muted">{alert.timestamp}</span>
                  </div>
                  <h2 className="text-xl font-bold text-t-text leading-tight">{alert.message}</h2>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-t-muted hover:text-t-text bg-black/20 hover:bg-black/40 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
              <div>
                <h3 className="text-sm font-medium text-t-muted mb-3 uppercase tracking-wider">Details</h3>
                <p className="text-t-text-secondary text-sm leading-relaxed bg-t-hover p-4 rounded-xl border border-t-border">
                  {alert.details}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-t-hover p-4 rounded-xl border border-t-border">
                  <div className="flex items-center space-x-2 text-t-muted mb-2">
                    <MapPin size={16} />
                    <span className="text-xs font-medium">Structure</span>
                  </div>
                  <div className="text-sm font-semibold text-t-text truncate">{alert.structureName}</div>
                  <div className="text-xs text-blue-400 mt-1 cursor-pointer hover:underline">View Structure</div>
                </div>
                <div className="bg-t-hover p-4 rounded-xl border border-t-border">
                  <div className="flex items-center space-x-2 text-t-muted mb-2">
                    <Activity size={16} />
                    <span className="text-xs font-medium">Sensor</span>
                  </div>
                  <div className="text-sm font-semibold text-t-text truncate">{alert.sensorName}</div>
                  <div className="text-xs text-blue-400 mt-1 cursor-pointer hover:underline">View Sensor Data</div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-t-muted mb-3 uppercase tracking-wider flex items-center">
                  <Lightbulb size={16} className="mr-2 text-amber-400" /> Recommended Action
                </h3>
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
                  <p className="text-amber-200/90 text-sm">{alert.recommendation}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-t-muted mb-4 uppercase tracking-wider">Status History</h3>
                <div className="relative pl-4 border-l-2 border-t-border space-y-6">
                  <div className="relative">
                    <div className="absolute -left-[21px] p-1 rounded-full bg-t-card border-2 border-red-500 text-red-500">
                      <AlertTriangle size={12} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-t-text">Alert Triggered</p>
                      <p className="text-xs text-t-muted">{alert.timestamp}</p>
                    </div>
                  </div>
                  
                  {alert.status !== 'new' && (
                    <div className="relative">
                      <div className="absolute -left-[21px] p-1 rounded-full bg-t-card border-2 border-blue-500 text-blue-500">
                        <Clock size={12} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-t-text">Acknowledged</p>
                        <p className="text-xs text-t-muted">System admin</p>
                      </div>
                    </div>
                  )}

                  {alert.status === 'resolved' && (
                    <div className="relative">
                      <div className="absolute -left-[21px] p-1 rounded-full bg-t-card border-2 border-green-500 text-green-500">
                        <Check size={12} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-t-text">Resolved</p>
                        <p className="text-xs text-t-muted">System admin</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            <div className="p-6 border-t border-t-border bg-t-hover flex gap-3">
              {alert.status === 'new' && (
                <button
                  onClick={() => onAcknowledge?.(alert.id)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-t-text py-2.5 rounded-lg font-medium transition-colors"
                >
                  Acknowledge Alert
                </button>
              )}
              {alert.status !== 'resolved' && (
                <button
                  onClick={() => onResolve?.(alert.id)}
                  className={clsx(
                    "flex-1 py-2.5 rounded-lg font-medium transition-colors border",
                    alert.status === 'new' 
                      ? "bg-transparent border-t-border text-t-text hover:bg-t-border" 
                      : "bg-green-500 hover:bg-green-600 text-t-text border-transparent"
                  )}
                >
                  Mark as Resolved
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AlertDetailDrawer;
