import { subDays, subHours, subMinutes } from 'date-fns';
import { generateSparklineData } from './formatters';
import { Structure } from '../types/structure.types';
import { Sensor } from '../types/sensor.types';
import { Alert } from '../types/alert.types';
import { KanbanTask } from '../types/kanban.types';
import { Inspection, Notification } from '../types/common.types';
import { PredictionPoint, AnomalyPoint, CostForecast, ModelMetrics } from '../types/analytics.types';
import { User } from '../types/auth.types';

const now = new Date();

export const mockUser: User = {
  id: 'u1',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@structureai.in',
  role: 'admin',
  avatar: 'https://i.pravatar.cc/150?u=aarav',
  department: 'Operations',
  lastLogin: new Date().toISOString(),
};

export const mockStructures: Structure[] = [
  {
    id: 's1', name: 'Howrah Bridge', type: 'bridge',
    location: { lat: 22.5851, lng: 88.3468, address: 'Howrah Bridge', city: 'Kolkata', state: 'West Bengal' },
    healthScore: 92, status: 'healthy', sensorCount: 45, activeSensors: 45,
    lastInspection: subDays(now, 15).toISOString(), nextInspection: new Date(now.getTime() + 86400000 * 45).toISOString(),
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Howrah_Bridge_Kolkata_India.jpg',
    buildYear: 1943, material: 'Steel', length: 705, spans: 3, description: 'Iconic cantilever bridge over the Hooghly River.'
  },
  {
    id: 's2', name: 'Bandra-Worli Sea Link', type: 'bridge',
    location: { lat: 19.0357, lng: 72.8154, address: 'Bandra-Worli Sea Link', city: 'Mumbai', state: 'Maharashtra' },
    healthScore: 74, status: 'warning', sensorCount: 60, activeSensors: 58,
    lastInspection: subDays(now, 30).toISOString(), nextInspection: new Date(now.getTime() + 86400000 * 15).toISOString(),
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Bandra_Worli_Sea_Link_Mumbai.jpg',
    buildYear: 2009, material: 'Prestressed Concrete-Steel', length: 5600, spans: 50, description: 'Cable-stayed bridge linking Bandra to Worli.'
  },
  {
    id: 's3', name: 'Chenab Rail Bridge', type: 'bridge',
    location: { lat: 33.1553, lng: 74.8258, address: 'Bakkal', city: 'Reasi', state: 'J&K' },
    healthScore: 88, status: 'healthy', sensorCount: 120, activeSensors: 118,
    lastInspection: subDays(now, 5).toISOString(), nextInspection: new Date(now.getTime() + 86400000 * 90).toISOString(),
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Chenab_Bridge.jpg/1024px-Chenab_Bridge.jpg',
    buildYear: 2022, material: 'Steel', length: 1315, spans: 17, description: 'Highest railway bridge in the world.'
  },
  {
    id: 's4', name: 'Signature Bridge', type: 'bridge',
    location: { lat: 28.7180, lng: 77.2291, address: 'Wazirabad', city: 'Delhi', state: 'Delhi' },
    healthScore: 45, status: 'critical', sensorCount: 30, activeSensors: 22,
    lastInspection: subDays(now, 2).toISOString(), nextInspection: new Date(now.getTime() + 86400000 * 5).toISOString(),
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Signature_Bridge_Delhi_2.jpg/1024px-Signature_Bridge_Delhi_2.jpg',
    buildYear: 2018, material: 'Steel-Concrete', length: 675, spans: 5, description: 'Cantilever spar cable-stayed bridge over Yamuna river.'
  },
  {
    id: 's5', name: 'Pamban Bridge', type: 'bridge',
    location: { lat: 9.2789, lng: 79.2081, address: 'Pamban', city: 'Rameswaram', state: 'Tamil Nadu' },
    healthScore: 67, status: 'warning', sensorCount: 40, activeSensors: 35,
    lastInspection: subDays(now, 10).toISOString(), nextInspection: new Date(now.getTime() + 86400000 * 20).toISOString(),
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Pamban_Bridge_India.jpg',
    buildYear: 1914, material: 'Steel', length: 2065, spans: 143, description: 'Historic railway bridge connecting Rameswaram.'
  },
  {
    id: 's6', name: 'Vidyasagar Setu', type: 'bridge',
    location: { lat: 22.5562, lng: 88.3283, address: 'Vidyasagar Setu', city: 'Kolkata', state: 'West Bengal' },
    healthScore: 91, status: 'healthy', sensorCount: 50, activeSensors: 50,
    lastInspection: subDays(now, 20).toISOString(), nextInspection: new Date(now.getTime() + 86400000 * 40).toISOString(),
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Vidyasagar_Setu_Second_Hooghly_Bridge_Kolkata.jpg',
    buildYear: 1992, material: 'Steel', length: 823, spans: 7, description: 'Longest cable-stayed bridge in India.'
  },
  {
    id: 's7', name: 'Mahatma Gandhi Setu', type: 'bridge',
    location: { lat: 25.6179, lng: 85.2152, address: 'Ganga River', city: 'Patna', state: 'Bihar' },
    healthScore: 58, status: 'warning', sensorCount: 80, activeSensors: 72,
    lastInspection: subDays(now, 25).toISOString(), nextInspection: new Date(now.getTime() + 86400000 * 10).toISOString(),
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Mahatma_Gandhi_Setu%2C_Patna.jpg',
    buildYear: 1982, material: 'Concrete-Steel', length: 5750, spans: 46, description: 'One of the longest river bridges in India.'
  },
  {
    id: 's8', name: 'Rajiv Gandhi Flyover', type: 'flyover',
    location: { lat: 12.9716, lng: 77.5946, address: 'Madiwala', city: 'Bangalore', state: 'Karnataka' },
    healthScore: 85, status: 'healthy', sensorCount: 20, activeSensors: 20,
    lastInspection: subDays(now, 40).toISOString(), nextInspection: new Date(now.getTime() + 86400000 * 20).toISOString(),
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Electronic_City_Elevated_Expressway.jpg/1024px-Electronic_City_Elevated_Expressway.jpg',
    buildYear: 2010, material: 'Concrete', length: 9980, description: 'Major elevated expressway.'
  },
  {
    id: 's9', name: 'Nehru Government Complex', type: 'building',
    location: { lat: 28.6139, lng: 77.2090, address: 'Central Secretariat', city: 'Delhi', state: 'Delhi' },
    healthScore: 89, status: 'healthy', sensorCount: 75, activeSensors: 75,
    lastInspection: subDays(now, 60).toISOString(), nextInspection: new Date(now.getTime() + 86400000 * 30).toISOString(),
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/15/North_Block_of_the_Secretariat_Building%2C_New_Delhi.jpg',
    buildYear: 1927, material: 'Stone and Brick', description: 'Historic administrative building.'
  },
  {
    id: 's10', name: 'Mumbai Municipal HQ', type: 'building',
    location: { lat: 18.9388, lng: 72.8339, address: 'Mahapalika Marg', city: 'Mumbai', state: 'Maharashtra' },
    healthScore: 72, status: 'warning', sensorCount: 35, activeSensors: 32,
    lastInspection: subDays(now, 12).toISOString(), nextInspection: new Date(now.getTime() + 86400000 * 18).toISOString(),
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Brihanmumbai_Municipal_Corporation_headquarters.jpg',
    buildYear: 1893, material: 'Stone', description: 'Grade IIA heritage building housing the BMC.'
  }
];

export const mockSensors: Sensor[] = [];
for (let i = 1; i <= 50; i++) {
  const structure = mockStructures[i % 10];
  const types: any[] = ['vibration', 'strain', 'temperature', 'displacement', 'tilt', 'humidity', 'corrosion'];
  const type = types[i % 7];
  
  let unit = '', min = 0, max = 100, val = 0;
  if (type === 'vibration') { unit = 'mm/s'; min = 0; max = 50; val = 12 + Math.random() * 5; }
  else if (type === 'strain') { unit = 'µε'; min = 0; max = 1000; val = 300 + Math.random() * 50; }
  else if (type === 'temperature') { unit = '°C'; min = -20; max = 80; val = 25 + Math.random() * 10; }
  else if (type === 'displacement') { unit = 'mm'; min = 0; max = 100; val = 5 + Math.random() * 2; }
  else if (type === 'tilt') { unit = 'deg'; min = 0; max = 90; val = 0.5 + Math.random() * 0.1; }
  else if (type === 'humidity') { unit = '%'; min = 0; max = 100; val = 60 + Math.random() * 20; }
  else if (type === 'corrosion') { unit = 'mm/yr'; min = 0; max = 5; val = 0.1 + Math.random() * 0.2; }

  let status: any = 'online';
  if (i % 10 === 0) status = 'offline';
  else if (i % 7 === 0) status = 'warning';

  mockSensors.push({
    id: `sen${i}`,
    structureId: structure.id,
    structureName: structure.name,
    name: `${type.charAt(0).toUpperCase() + type.slice(1)} Sensor ${i}`,
    type,
    status,
    value: val,
    unit,
    battery: 60 + Math.random() * 40,
    lastReading: new Date().toISOString(),
    history: generateSparklineData(24, min, max),
    threshold: { min: min, max: max * 0.8 },
    position: { x: Math.random() * 10, y: Math.random() * 10, z: Math.random() * 10 },
    installDate: subDays(now, 365 + Math.random() * 365).toISOString()
  });
}

export const mockAlerts: Alert[] = [];
for (let i = 1; i <= 25; i++) {
  const sensor = mockSensors[i % 50];
  const severities: any[] = ['critical', 'warning', 'info'];
  const severity = severities[i % 3];
  
  mockAlerts.push({
    id: `alt${i}`,
    structureId: sensor.structureId,
    structureName: sensor.structureName,
    sensorId: sensor.id,
    sensorName: sensor.name,
    severity,
    status: i % 3 === 0 ? 'resolved' : (i % 2 === 0 ? 'acknowledged' : 'new'),
    message: `${sensor.type.charAt(0).toUpperCase() + sensor.type.slice(1)} exceeds threshold on Span ${Math.ceil(Math.random() * 5)}`,
    details: `Sensor recorded value ${sensor.value.toFixed(2)} ${sensor.unit} which is above normal range.`,
    timestamp: subMinutes(now, Math.random() * 10000).toISOString(),
    recommendation: 'Schedule physical inspection within 24 hours.'
  });
}

export const mockKanbanTasks: KanbanTask[] = [
  { id: 't1', title: 'Replace corroded bolts', description: 'Replace bolts on Span 4 of Howrah Bridge', structureId: 's1', structureName: 'Howrah Bridge', priority: 'high', status: 'backlog', assignee: { name: 'Rahul Desai', avatar: 'https://i.pravatar.cc/150?u=rahul', role: 'Engineer' }, dueDate: new Date(now.getTime() + 86400000 * 2).toISOString(), createdAt: subDays(now, 1).toISOString(), tags: ['maintenance', 'urgent'] },
  { id: 't2', title: 'Sensor battery replacement', description: 'Replace batteries for 5 strain sensors', structureId: 's2', structureName: 'Bandra-Worli Sea Link', priority: 'medium', status: 'in-progress', assignee: { name: 'Priya Patel', avatar: 'https://i.pravatar.cc/150?u=priya', role: 'Technician' }, dueDate: new Date(now.getTime() + 86400000 * 5).toISOString(), createdAt: subDays(now, 2).toISOString(), tags: ['sensors'] }
];

export const mockInspections: Inspection[] = [
  { id: 'i1', structureId: 's1', structureName: 'Howrah Bridge', date: subDays(now, 15).toISOString(), inspector: 'Rahul Desai', type: 'manual', findings: 'Minor rust on secondary joints.', compliance: 'pass', images: [], severity: 'minor', duration: '4h', notes: 'Scheduled for next month.' }
];

export const mockNotifications: Notification[] = [
  { id: 'n1', title: 'Critical Alert', message: 'Vibration spike detected on Signature Bridge', type: 'alert', timestamp: subMinutes(now, 5).toISOString(), read: false },
  { id: 'n2', title: 'Task Completed', message: 'Sensor calibration finished', type: 'success', timestamp: subHours(now, 2).toISOString(), read: true }
];

export const mockPredictions: PredictionPoint[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(now.getTime() + i * 86400000).toISOString(),
  predicted: 80 - Math.random() * 10,
  confidence: 90 + Math.random() * 8
}));

export const mockAnomalies: AnomalyPoint[] = Array.from({ length: 20 }, (_, i) => ({
  date: subDays(now, i + 1).toISOString(),
  sensorId: `sen${i}`,
  sensorName: `Sensor ${i}`,
  structureName: 'Howrah Bridge',
  value: 45 + Math.random() * 10,
  expected: 20,
  severity: i % 3 === 0 ? 'high' : 'medium'
}));

export const mockCostForecasts: CostForecast[] = Array.from({ length: 12 }, (_, i) => ({
  month: `2026-${(i + 1).toString().padStart(2, '0')}`,
  predicted: 50000 + Math.random() * 10000,
  actual: i < 9 ? 48000 + Math.random() * 12000 : undefined,
  category: 'Maintenance'
}));

export const mockModelMetrics: ModelMetrics[] = [
  { name: 'Crack Detection CNN', accuracy: 94.5, precision: 92.1, recall: 95.0, f1Score: 93.5, lastTrained: subDays(now, 2).toISOString(), dataPoints: 150000 },
  { name: 'Corrosion Classifier', accuracy: 89.2, precision: 88.5, recall: 90.1, f1Score: 89.3, lastTrained: subDays(now, 5).toISOString(), dataPoints: 85000 }
];

export function generateRealtimeValue(baseValue: number, variance: number) {
  return baseValue + (Math.random() - 0.5) * variance;
}
