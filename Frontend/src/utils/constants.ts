import { TimeRange } from '../types/common.types';

export const APP_NAME = 'StructureAI';
export const MAP_CENTER: [number, number] = [20.5937, 78.9629]; // India center coords

export const NAV_ITEMS = [
  { icon: 'LayoutDashboard', label: 'Dashboard', path: '/dashboard', group: 'main' },
  { icon: 'Building2', label: 'Infrastructure', path: '/infrastructure', group: 'main' },
  { icon: 'Activity', label: 'Sensors', path: '/sensors', group: 'monitoring' },
  { icon: 'AlertTriangle', label: 'Alerts', path: '/alerts', group: 'monitoring' },
  { icon: 'LineChart', label: 'Analytics', path: '/analytics', group: 'intelligence' },
  { icon: 'ClipboardList', label: 'Maintenance Kanban', path: '/kanban', group: 'intelligence' },
  { icon: 'ShieldCheck', label: 'Audit Logs', path: '/audit', group: 'system' },
  { icon: 'Settings', label: 'Settings', path: '/settings', group: 'system' },
];

export const TIME_RANGES: TimeRange[] = [
  { label: 'Past Hour', value: '1h' },
  { label: 'Past 24 Hours', value: '24h' },
  { label: 'Past 7 Days', value: '7d' },
  { label: 'Past 30 Days', value: '30d' },
  { label: 'Past Year', value: '1y' },
];

export const STATUS_COLORS = {
  healthy: 'text-success bg-success/10',
  warning: 'text-warning bg-warning/10',
  critical: 'text-danger bg-danger/10',
  offline: 'text-gray-400 bg-gray-400/10',
};

export const SEVERITY_COLORS = {
  info: 'text-info bg-info/10',
  warning: 'text-warning bg-warning/10',
  critical: 'text-danger bg-danger/10',
};

export const SENSOR_TYPE_CONFIG = {
  vibration: { unit: 'mm/s', icon: 'Activity', range: [0, 50] },
  strain: { unit: 'µε', icon: 'Scale', range: [0, 1000] },
  temperature: { unit: '°C', icon: 'Thermometer', range: [-20, 80] },
  displacement: { unit: 'mm', icon: 'MoveDiagonal', range: [0, 100] },
  tilt: { unit: 'deg', icon: 'Compass', range: [0, 90] },
  humidity: { unit: '%', icon: 'Droplets', range: [0, 100] },
  corrosion: { unit: 'mm/yr', icon: 'ShieldAlert', range: [0, 5] },
};
