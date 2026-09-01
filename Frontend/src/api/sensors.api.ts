import { apiClient } from './client';
import { Sensor } from '../types/sensor.types';

export const sensorsApi = {
  getSensors: (params?: { structureId?: string; type?: string; status?: string; search?: string }): Promise<Sensor[]> => {
    const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return apiClient.get<Sensor[]>(`/sensors${query}`);
  },

  getSensor: (id: string): Promise<Sensor> => {
    return apiClient.get<Sensor>(`/sensors/${id}`);
  },

  createSensor: (data: Partial<Sensor>): Promise<Sensor> => {
    return apiClient.post<Sensor>('/sensors', data);
  },

  updateSensor: (id: string, data: Partial<Sensor>): Promise<Sensor> => {
    return apiClient.put<Sensor>(`/sensors/${id}`, data);
  },

  deleteSensor: (id: string): Promise<void> => {
    return apiClient.delete(`/sensors/${id}`);
  }
};
