import { apiClient, getToken } from './client';
import { Structure } from '../types/structure.types';

const API_BASE = 'http://localhost:5001/api';

export const structuresApi = {
  getStructures: (params?: { type?: string; status?: string; city?: string; search?: string }): Promise<Structure[]> => {
    const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return apiClient.get<Structure[]>(`/structures${query}`);
  },

  getStructure: (id: string): Promise<Structure> => {
    return apiClient.get<Structure>(`/structures/${id}`);
  },

  createStructure: (data: Partial<Structure>): Promise<Structure> => {
    return apiClient.post<Structure>('/structures', data);
  },

  updateStructure: (id: string, data: Partial<Structure>): Promise<Structure> => {
    return apiClient.put<Structure>(`/structures/${id}`, data);
  },

  deleteStructure: (id: string): Promise<void> => {
    return apiClient.delete(`/structures/${id}`);
  },

  generateReport: async (id: string): Promise<Blob> => {
    const token = getToken();
    const response = await fetch(`${API_BASE}/structures/${id}/report`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Report generation failed');
    return await response.blob();
  }
};
