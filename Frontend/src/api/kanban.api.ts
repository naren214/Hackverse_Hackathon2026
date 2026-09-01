import { apiClient } from './client';
import { KanbanTask } from '../types/kanban.types';

export const kanbanApi = {
  getTasks: (params?: { status?: string; priority?: string; structureId?: string; search?: string }): Promise<KanbanTask[]> => {
    const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return apiClient.get<KanbanTask[]>(`/kanban/tasks${query}`);
  },

  getTask: (id: string): Promise<KanbanTask> => {
    return apiClient.get<KanbanTask>(`/kanban/tasks/${id}`);
  },

  createTask: (data: Partial<KanbanTask>): Promise<KanbanTask> => {
    return apiClient.post<KanbanTask>('/kanban/tasks', data);
  },

  updateTask: (id: string, data: Partial<KanbanTask>): Promise<KanbanTask> => {
    return apiClient.put<KanbanTask>(`/kanban/tasks/${id}`, data);
  },

  deleteTask: (id: string): Promise<void> => {
    return apiClient.delete(`/kanban/tasks/${id}`);
  }
};
