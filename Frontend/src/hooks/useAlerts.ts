import { useState, useEffect } from 'react';
import { Alert } from '../types/alert.types';
import { mockAlerts } from '../utils/mockData';

export const useAlerts = (structureId?: string, severity?: string) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    let filtered = mockAlerts;
    if (structureId) {
      filtered = filtered.filter(a => a.structureId === structureId);
    }
    if (severity) {
      filtered = filtered.filter(a => a.severity === severity);
    }
    setAlerts(filtered);
  }, [structureId, severity]);

  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const warningCount = alerts.filter(a => a.severity === 'warning').length;

  return { alerts, criticalCount, warningCount };
};
