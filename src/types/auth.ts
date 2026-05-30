export interface AuthUser {
  id: string;            // ← UUID, bukan number
  name: string;          // ← dari backend: kolom "nama" di-map jadi "name"
  email: string;
  role: 'user' | 'admin';
  phone?: string;        // ← dari backend: kolom "no_telp" di-map jadi "phone"
  avatar?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nama: string;                  // ← sesuai validasi backend ("nama", bukan "name")
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    token: string;
    token_type: string;
    expires_in: number;
    user: AuthUser;
  };
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}