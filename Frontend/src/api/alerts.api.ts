import { apiClient } from './client';
import { Alert } from '../types/alert.types';

export const alertsApi = {
  getAlerts: (params?: { severity?: string; status?: string; structureId?: string; search?: string }): Promise<Alert[]> => {
    const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return apiClient.get<Alert[]>(`/alerts${query}`);
  },

  getAlert: (id: string): Promise<Alert> => {
    return apiClient.get<Alert>(`/alerts/${id}`);
  },

  updateAlert: (id: string, data: Partial<Alert>): Promise<Alert> => {
    return apiClient.put<Alert>(`/alerts/${id}`, data);
  },

  createAlert: (data: Partial<Alert>): Promise<Alert> => {
    return apiClient.post<Alert>('/alerts', data);
  },

  deleteAlert: (id: string): Promise<void> => {
    return apiClient.delete(`/alerts/${id}`);
  }
};
