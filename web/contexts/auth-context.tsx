'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { AuthUser, UserRole } from '../types/auth';
import { loginApi, logoutApi, refreshApi } from '../lib/queries/auth';
import { setAuthToken } from '../lib/api-client';

export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'staff':
      return '/staff';
    case 'customer':
      return '/portal';
    default:
      return '/login';
  }
}

interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const handleSetToken = useCallback((token: string | null) => {
    setAccessTokenState(token);
    setAuthToken(token);
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const data = await refreshApi();
      setUser(data.user);
      handleSetToken(data.accessToken);
    } catch {
      setUser(null);
      handleSetToken(null);
    } finally {
      setIsLoading(false);
    }
  }, [handleSetToken]);

  useEffect(() => {
    // Attempt silent refresh on initial app load
    refreshSession();
  }, [refreshSession]);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    const data = await loginApi({ email, password });
    setUser(data.user);
    handleSetToken(data.accessToken);
    return data.user;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // Continue client-side logout even if network error
    } finally {
      setUser(null);
      handleSetToken(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
