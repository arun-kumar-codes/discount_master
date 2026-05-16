import React, { createContext, useContext, useState, useCallback } from 'react';
import { User } from '../types';
import { MERCHANT_USER, CUSTOMER_USER } from '../constants/mockData';

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: 'customer' | 'merchant';
  lat?: number;
  lng?: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 700));

    const lowerEmail = email.toLowerCase().trim();
    if (lowerEmail === MERCHANT_USER.email) {
      setUser(MERCHANT_USER);
    } else if (lowerEmail === CUSTOMER_USER.email) {
      setUser(CUSTOMER_USER);
    } else {
      // Accept any credentials for demo — default to customer role
      setUser({
        id: `user_${Date.now()}`,
        fullName: email.split('@')[0] ?? 'User',
        email,
        phone: '',
        role: 'customer',
      });
    }

    setIsLoading(false);
    return true;
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setIsLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
