import { client } from './client';
import { mockPredictions, mockAnomalies, mockCostForecasts, mockModelMetrics } from '../utils/mockData';

export const analyticsApi = {
  getPredictions: () => client.get(mockPredictions),
  getAnomalies: () => client.get(mockAnomalies),
  getCostForecasts: () => client.get(mockCostForecasts),
  getModelMetrics: () => client.get(mockModelMetrics)
};
