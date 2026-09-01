import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Bell, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { alertsApi } from '../../api/alerts.api';
import { Alert } from '../../types/alert.types';
import { formatRelativeTime } from '../../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const AlertsFeed: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    alertsApi.getAlerts()
      .then(data => setAlerts(data.slice(0, 8)))
      .catch(err => console.error('Failed to load alerts:', err));
  }, []);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-amber-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/10 border-red-500/20';
      case 'warning': return 'bg-amber-500/10 border-amber-500/20';
      default: return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  const headerAction = (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
      </span>
      <span className="text-xs text-red-500 font-semibold tracking-wider">LIVE</span>
    </div>
  );

  return (
    <Card 
      title="Live Alerts" 
      icon={Bell}
      headerAction={headerAction}
      className="h-[450px] flex flex-col"
    >
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
        <AnimatePresence>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              layoutId={alert.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`p-3 rounded-lg border flex gap-3 ${getSeverityBg(alert.severity)} backdrop-blur-sm`}
            >
              <div className="mt-0.5">{getSeverityIcon(alert.severity)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-semibold text-t-text truncate">{alert.structureName}</p>
                  <span className="text-xs text-t-muted whitespace-nowrap ml-2">
                    {formatRelativeTime(alert.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-t-muted line-clamp-2">{alert.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="pt-4 mt-2 border-t border-t-border text-center">
        <Link to="/alerts" className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium">
          View All Alerts
        </Link>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </Card>
  );
};

export { AlertsFeed };
export default AlertsFeed;
