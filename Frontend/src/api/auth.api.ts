import { client } from './client';
import { mockUser } from '../utils/mockData';

export const authApi = {
  login: () => client.get({ token: 'fake-token', user: mockUser }),
  me: () => client.get(mockUser)
};
