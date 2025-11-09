import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '@/integration/api/client';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  // Check for auth token in localStorage
  const token = localStorage.getItem('authToken');
  const hydrate = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    const userId = parseInt(token || '0');
    if (!userId) {
      localStorage.removeItem('authToken');
      setLoading(false);
      return;
    }
    try {
      const resp = await apiClient.getUserProfile(userId);
      if (resp.status === 'success' && resp.data?.user) {
        setUser(resp.data.user as any);
      } else {
        localStorage.removeItem('authToken');
      }
    } catch {
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };
  hydrate();
}, []);

  const login = async (email: string, password: string) => {
    const response = await apiClient.login(email, password);
    if (response.data?.user) {
      setUser(response.data.user);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    const response = await apiClient.signup(name, email, password);
    if (response.data?.user) {
      setUser(response.data.user);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
