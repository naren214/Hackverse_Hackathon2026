import React, { createContext, useState } from 'react';
import { AuthState } from '../types/auth.types';
import { mockUser } from '../utils/mockData';

interface AuthContextType extends AuthState {
  login: (email: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: mockUser,
    isAuthenticated: true,
    isLoading: false,
  });

  const login = async (email: string) => {
    setState(s => ({ ...s, isLoading: true }));
    setTimeout(() => {
      setState({
        user: { ...mockUser, email },
        isAuthenticated: true,
        isLoading: false
      });
    }, 1000);
  };

  const logout = () => {
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
