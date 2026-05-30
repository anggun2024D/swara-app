'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { tokenStorage } from '@/services/api';
import type { AuthUser, LoginRequest, RegisterRequest } from '@/types';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount — restore session from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const token = tokenStorage.get();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const profile = await authService.getProfile();
        setUser(profile);
      } catch {
        tokenStorage.remove();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      const res = await authService.login(credentials);

      console.log('=== LOGIN RESPONSE ===', res);        // ← tambah
      console.log('=== USER ===', res.data.user);        // ← tambah
      console.log('=== ROLE ===', res.data.user.role);   // ← tambah

      setUser(res.data.user);
      await new Promise(resolve => setTimeout(resolve, 100)); 
      // Role-based redirect
      if (res.data.user.role === 'admin') {
        console.log('=== ADMIN LOGIN ===');
        router.push('/admin/dashboard');
      } else {
        console.log('=== REDIRECT TO DASHBOARD ===');
        router.push('/dashboard');
      }
    },
    [router]
  );

  const register = useCallback(
    async (payload: RegisterRequest) => {
      const res = await authService.register(payload);
      setUser(res.data.user);
      router.push('/dashboard');
    },
    [router]
  );

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    router.push('/login');
  }, [router]);

  const refreshUser = useCallback(async () => {
    const profile = await authService.getProfile();
    setUser(profile);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}

export const useAuth = useAuthContext;