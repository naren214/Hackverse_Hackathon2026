import { useState, useEffect } from 'react';
import { Alert } from '../types/alert.types';
import { alertsApi } from '../api/alerts.api';

export const useAlerts = (structureId?: string, severity?: string) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (structureId) params.structureId = structureId;
    if (severity) params.severity = severity;

    alertsApi.getAlerts(Object.keys(params).length > 0 ? params : undefined)
      .then(data => setAlerts(data))
      .catch(err => console.error('Failed to load alerts:', err));
  }, [structureId, severity]);

  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const warningCount = alerts.filter(a => a.severity === 'warning').length;

  return { alerts, criticalCount, warningCount };
};
