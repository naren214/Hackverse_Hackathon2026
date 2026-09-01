import { client } from './client';
import { mockSensors } from '../utils/mockData';

export const sensorsApi = {
  getSensors: () => client.get(mockSensors),
  getSensor: (id: string) => client.get(mockSensors.find(s => s.id === id))
};
