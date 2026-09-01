export type SensorType = 'vibration' | 'strain' | 'temperature' | 'displacement' | 'tilt' | 'humidity' | 'corrosion';
export type SensorStatus = 'online' | 'offline' | 'warning';

export interface SensorReading {
  time: string;
  value: number;
}

export interface Sensor {
  id: string;
  structureId: string;
  structureName: string;
  name: string;
  type: SensorType;
  status: SensorStatus;
  value: number;
  unit: string;
  battery: number;
  lastReading: string;
  history: SensorReading[];
  threshold: { min: number; max: number; };
  position: { x: number; y: number; z: number; };
  installDate: string;
}
