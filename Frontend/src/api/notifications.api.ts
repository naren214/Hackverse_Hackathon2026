import { apiClient } from './client';

export interface Notification {
  _id: string;
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export const notificationsApi = {
  getNotifications: (): Promise<Notification[]> => {
    return apiClient.get<Notification[]>('/notifications');
  },

  markAsRead: (id: string): Promise<Notification> => {
    return apiClient.put<Notification>(`/notifications/${id}/read`);
  },

  markAllAsRead: (): Promise<{ message: string }> => {
    return apiClient.put<{ message: string }>('/notifications/read-all');
  }
};
