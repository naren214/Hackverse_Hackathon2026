import React, { createContext, useState, useEffect } from 'react';
import { AuthState, User } from '../types/auth.types';
import { authApi } from '../api/auth.api';
import { getToken } from '../api/client';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check for existing token on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      authApi.me()
        .then((user: User) => {
          setState({ user, isAuthenticated: true, isLoading: false });
        })
        .catch(() => {
          setState({ user: null, isAuthenticated: false, isLoading: false });
        });
    } else {
      setState(s => ({ ...s, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setState(s => ({ ...s, isLoading: true }));
    try {
      const data = await authApi.login(email, password);
      setState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      setState({ user: null, isAuthenticated: false, isLoading: false });
      throw error;
    }
  };

  const logout = () => {
    authApi.logout().catch(() => {});
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
