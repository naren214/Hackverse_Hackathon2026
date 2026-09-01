import { client } from './client';
import { mockStructures } from '../utils/mockData';

export const structuresApi = {
  getStructures: () => client.get(mockStructures),
  getStructure: (id: string) => client.get(mockStructures.find(s => s.id === id))
};
