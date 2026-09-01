import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, Clock, Check } from 'lucide-react';
import clsx from 'clsx';
import { Alert } from '../../types/alert.types';

interface AlertCardProps {
  alert: Alert;
  onAcknowledge?: (id: string) => void;
  onResolve?: (id: string) => void;
  onClick?: (alert: Alert) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onAcknowledge, onResolve, onClick }) => {
  const getSeverityStyles = () => {
    switch (alert.severity) {
      case 'critical': return { stripe: 'bg-red-500', icon: <AlertTriangle className="text-red-500" />, text: 'text-red-400' };
      case 'warning': return { stripe: 'bg-amber-500', icon: <AlertCircle className="text-amber-500" />, text: 'text-amber-400' };
      case 'info': return { stripe: 'bg-blue-500', icon: <Info className="text-blue-500" />, text: 'text-blue-400' };
    }
  };

  const styles = getSeverityStyles();

  const handleAction = (e: React.MouseEvent, action: 'acknowledge' | 'resolve') => {
    e.stopPropagation();
    if (action === 'acknowledge' && onAcknowledge) onAcknowledge(alert.id);
    if (action === 'resolve' && onResolve) onResolve(alert.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={{ scale: 1.005 }}
      onClick={() => onClick?.(alert)}
      className={clsx(
        "relative bg-t-card border border-t-border rounded-xl overflow-hidden cursor-pointer flex flex-col sm:flex-row transition-shadow hover:shadow-lg hover:shadow-black/20",
        alert.status === 'resolved' && "opacity-70"
      )}
    >
      <div className={clsx("absolute left-0 top-0 bottom-0 w-1.5", styles.stripe)} />
      
      <div className="p-4 sm:p-5 flex-1 pl-6">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-t-hover rounded-lg">
              {styles.icon}
            </div>
            <h3 className="text-t-text font-medium text-lg leading-tight">{alert.message}</h3>
          </div>
          <span className="text-sm text-t-muted whitespace-nowrap ml-4">{alert.timestamp}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-3 ml-[46px] text-sm text-t-muted">
          <span className="bg-t-border px-2.5 py-1 rounded-md text-t-text-secondary font-medium">{alert.structureName}</span>
          <span className="flex items-center">•</span>
          <span>Sensor: <span className="text-t-text-secondary">{alert.sensorName}</span></span>
          <span className="flex items-center">•</span>
          <span className={clsx(
            "px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider border",
            alert.status === 'new' ? "bg-red-500/10 text-red-400 border-red-500/20" :
            alert.status === 'acknowledged' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
            "bg-green-500/10 text-green-400 border-green-500/20"
          )}>
            {alert.status}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-row sm:flex-col justify-end items-end gap-2 border-t sm:border-t-0 sm:border-l border-t-border bg-t-hover/50">
        {alert.status === 'new' && (
          <button 
            onClick={(e) => handleAction(e, 'acknowledge')}
            className="flex items-center justify-center space-x-1.5 w-full sm:w-auto px-4 py-2 bg-t-border hover:bg-[#323644] text-t-text rounded-lg transition-colors text-sm font-medium"
          >
            <Clock size={16} />
            <span>Acknowledge</span>
          </button>
        )}
        
        {alert.status !== 'resolved' && (
          <button 
            onClick={(e) => handleAction(e, 'resolve')}
            className="flex items-center justify-center space-x-1.5 w-full sm:w-auto px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors text-sm font-medium border border-green-500/20"
          >
            <Check size={16} />
            <span>Resolve</span>
          </button>
        )}

        {alert.status === 'resolved' && (
          <div className="flex items-center space-x-1.5 text-green-400 text-sm font-medium py-2">
            <CheckCircle2 size={16} />
            <span>Resolved</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AlertCard;
