import { apiClient } from './client';
import { PredictionPoint, AnomalyPoint, CostForecast, ModelMetrics } from '../types/analytics.types';

export const analyticsApi = {
  getPredictions: (range = '6m'): Promise<PredictionPoint[]> => {
    return apiClient.get<PredictionPoint[]>(`/analytics/predictions?range=${range}`);
  },

  getAnomalies: (range = '6m'): Promise<AnomalyPoint[]> => {
    return apiClient.get<AnomalyPoint[]>(`/analytics/anomalies?range=${range}`);
  },

  getCostForecasts: (range = '6m'): Promise<CostForecast[]> => {
    return apiClient.get<CostForecast[]>(`/analytics/cost-forecasts?range=${range}`);
  },

  getModelMetrics: (): Promise<ModelMetrics[]> => {
    return apiClient.get<ModelMetrics[]>('/analytics/model-metrics');
  },

  getDashboardStats: (range = '6m'): Promise<{
    totalStructures: number;
    totalSensors: number;
    activeSensors: number;
    criticalAlerts: number;
    warningAlerts: number;
    avgHealth: number;
    statusCounts: { healthy: number; warning: number; critical: number; offline: number };
  }> => {
    return apiClient.get(`/analytics/dashboard-stats?range=${range}`);
  }
};
