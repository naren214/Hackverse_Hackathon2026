export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertStatus = 'new' | 'acknowledged' | 'resolved';

export interface Alert {
  id: string;
  structureId: string;
  structureName: string;
  sensorId: string;
  sensorName: string;
  severity: AlertSeverity;
  status: AlertStatus;
  message: string;
  details: string;
  timestamp: string;
  recommendation: string;
}
