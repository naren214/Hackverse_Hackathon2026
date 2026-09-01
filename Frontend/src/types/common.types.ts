export type ComplianceStatus = 'pass' | 'fail' | 'review';
export type InspectionType = 'manual' | 'ai' | 'scheduled';
export type FindingSeverity = 'none' | 'minor' | 'moderate' | 'severe';

export interface Inspection {
  id: string;
  structureId: string;
  structureName: string;
  date: string;
  inspector: string;
  type: InspectionType;
  findings: string;
  compliance: ComplianceStatus;
  images: string[];
  severity: FindingSeverity;
  duration: string;
  notes: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  timestamp: string;
  read: boolean;
}

export interface TimeRange {
  label: string;
  value: '1h' | '24h' | '7d' | '30d' | '1y';
}
