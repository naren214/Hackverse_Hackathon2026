export interface PredictionPoint {
  date: string;
  predicted: number;
  actual?: number;
  confidence: number;
}

export interface AnomalyPoint {
  date: string;
  sensorId: string;
  sensorName: string;
  structureName: string;
  value: number;
  expected: number;
  severity: 'high' | 'medium' | 'low';
}

export interface CostForecast {
  month: string;
  predicted: number;
  actual?: number;
  category: string;
}

export interface ModelMetrics {
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  lastTrained: string;
  dataPoints: number;
}
