import { format, formatDistanceToNow } from 'date-fns';

export function formatNumber(num: number): string {
  return num.toLocaleString();
}

export function formatDate(date: string | Date, formatStr: string = 'PPpp'): string {
  return format(new Date(date), formatStr);
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'healthy':
    case 'online':
    case 'pass':
      return 'text-success bg-success/10 border-success/20';
    case 'warning':
    case 'review':
    case 'minor':
    case 'moderate':
      return 'text-warning bg-warning/10 border-warning/20';
    case 'critical':
    case 'offline':
    case 'fail':
    case 'severe':
      return 'text-danger bg-danger/10 border-danger/20';
    default:
      return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
  }
}

export function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'text-danger bg-danger/10';
    case 'warning':
      return 'text-warning bg-warning/10';
    case 'info':
      return 'text-info bg-info/10';
    default:
      return 'text-gray-400 bg-gray-400/10';
  }
}

export function getHealthColor(score: number): string {
  if (score >= 80) return 'text-success bg-success/10';
  if (score >= 50) return 'text-warning bg-warning/10';
  return 'text-danger bg-danger/10';
}

export function clampValue(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function generateSparklineData(points: number, min: number, max: number) {
  const data = [];
  let currentValue = (min + max) / 2;
  const now = new Date();
  
  for (let i = points; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000);
    const variance = (max - min) * 0.1;
    currentValue += (Math.random() - 0.5) * variance;
    currentValue = clampValue(currentValue, min, max);
    
    data.push({
      time: time.toISOString(),
      value: currentValue
    });
  }
  return data;
}
