import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and set user
      setIsAuthenticated(true);
      // In a real app, you would decode the token or fetch user data
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<{ accessToken: string }>('/auth/login', { email, password });
      const { accessToken } = response.data;
      
      localStorage.setItem('token', accessToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // Fetch user data
      // For now, we'll just set a placeholder user
      setUser({ id: 1, email, firstName: '', lastName: '' });
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const response = await api.post<{ accessToken: string }>('/auth/signup', { email, password, firstName, lastName });
      const { accessToken } = response.data;
      
      localStorage.setItem('token', accessToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      setUser({ id: 1, email, firstName, lastName });
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error('Signup failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};