import api, { tokenStorage } from './api';
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  AuthUser,
} from '@/types';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials);
    
    console.log('=== AUTH SERVICE LOGIN ===', data);
    
    // Store token
    tokenStorage.set(data.data.token);
    localStorage.setItem('swara_user', JSON.stringify(data.data.user));
    return data;
  },

  async register(payload: RegisterRequest): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/register', payload);
    tokenStorage.set(data.data.token);
    localStorage.setItem('swara_user', JSON.stringify(data.data.user));
    return data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      tokenStorage.remove();
    }
  },

  async getProfile(): Promise<AuthUser> {
    const { data } = await api.get<{ data: AuthUser }>('/auth/me');
    localStorage.setItem('swara_user', JSON.stringify(data.data));
    return data.data;
  },

  async refreshToken(): Promise<string> {
    const { data } = await api.post<{ data: { token: string } }>('/auth/refresh');
    tokenStorage.set(data.data.token);
    return data.data.token;
  },

  getStoredUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('swara_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },
};