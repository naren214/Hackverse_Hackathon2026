export interface Structure {
  id: string;
  name: string;
  type: 'bridge' | 'flyover' | 'building';
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    state: string;
  };
  healthScore: number;
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  sensorCount: number;
  activeSensors: number;
  lastInspection: string;
  nextInspection: string;
  imageUrl: string;
  buildYear: number;
  material: string;
  length?: number;
  spans?: number;
  description: string;
}
