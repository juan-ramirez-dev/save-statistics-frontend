'use client';
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './hooks/useAuth';

interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  personalToken: string;
}

interface AuthContextProps {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create authentication context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Hook to use the authentication context
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

// Authentication provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
} 