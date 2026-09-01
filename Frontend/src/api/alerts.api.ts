import { client } from './client';
import { mockAlerts } from '../utils/mockData';

export const alertsApi = {
  getAlerts: () => client.get(mockAlerts),
  getAlert: (id: string) => client.get(mockAlerts.find(a => a.id === id))
};
