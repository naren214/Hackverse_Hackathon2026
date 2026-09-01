import { apiClient } from './client';
import { Structure } from '../types/structure.types';
import { Alert } from '../types/alert.types';

export const publicApi = {
  getStructures: (): Promise<Structure[]> => {
    return apiClient.get<Structure[]>('/public/structures');
  },
  
  getStructure: (id: string): Promise<Structure> => {
    return apiClient.get<Structure>(`/public/structures/${id}`);
  },

  getAlerts: (): Promise<Alert[]> => {
    return apiClient.get<Alert[]>('/public/alerts');
  },

  getInspectionStatus: (id: string) => apiClient.get<{ scheduled: boolean; date?: string; escalated?: boolean; requestCount: number }>(`/public/structures/${id}/inspection-status`)
};
