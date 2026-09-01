import { client } from './client';
import { mockKanbanTasks } from '../utils/mockData';

export const kanbanApi = {
  getTasks: () => client.get(mockKanbanTasks)
};
