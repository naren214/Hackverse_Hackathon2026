import { apiClient, getToken } from './client';
import { Inspection } from '../types/common.types';

const API_BASE = 'http://localhost:5001/api';

export const inspectionsApi = {
  getInspections: (query = '') => apiClient.get<Inspection[]>(`/inspections${query}`),
  getInspection: (id: string) => apiClient.get<Inspection>(`/inspections/${id}`),
  createInspection: (data: Partial<Inspection>) => apiClient.post<Inspection>('/inspections', data),
  scheduleInspection: (data: any) => apiClient.post<Inspection>('/inspections/schedule', data),
  exportPdf: async (query = '') => {
    const token = getToken();
    const response = await fetch(`${API_BASE}/inspections/export/pdf${query}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Export failed');
    return await response.blob();
  }
};
