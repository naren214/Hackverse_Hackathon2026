import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Alert } from '../../types/alert.types';
import { AlertCard } from './AlertCard';

interface AlertListProps {
  alerts: Alert[];
  onAcknowledge?: (id: string) => void;
  onResolve?: (id: string) => void;
  onAlertClick?: (alert: Alert) => void;
}

export const AlertList: React.FC<AlertListProps> = ({ alerts, onAcknowledge, onResolve, onAlertClick }) => {
  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-t-card border border-t-border rounded-xl">
        <div className="w-16 h-16 bg-t-border rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-t-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-t-text mb-2">No alerts found</h3>
        <p className="text-t-muted">All systems are looking good or no alerts match your filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {alerts.map((alert) => (
          <AlertCard
            key={alert.id}
            alert={alert}
            onAcknowledge={onAcknowledge}
            onResolve={onResolve}
            onClick={onAlertClick}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AlertList;
