export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  nik?: string;
  address?: string;
  avatar?: string;
  is_active: boolean;
  reports_count?: number;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar?: File;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface UserFilters {
  search?: string;
  role?: 'user' | 'admin';
  is_active?: boolean;
  page?: number;
  per_page?: number;
}