import { apiClient, setToken, setRefreshToken, removeToken, removeRefreshToken } from './client';
import { User } from '../types/auth.types';

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const data = await apiClient.post<LoginResponse>('/auth/login', { email, password });
    setToken(data.token);
    setRefreshToken(data.refreshToken);
    return data;
  },

  register: async (name: string, email: string, password: string): Promise<LoginResponse> => {
    const data = await apiClient.post<LoginResponse>('/auth/register', { name, email, password });
    setToken(data.token);
    setRefreshToken(data.refreshToken);
    return data;
  },

  me: async (): Promise<User> => {
    return apiClient.get<User>('/auth/me');
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      removeToken();
      removeRefreshToken();
    }
  }
};
