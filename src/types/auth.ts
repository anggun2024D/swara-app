// ══════════════════════════════════════════════════
// SWARA Auth Types — Dynamic Role System
// ══════════════════════════════════════════════════
// Role dasar: user | admin (hanya 2)
// Status dinamis: business_owner | investor (berdasarkan aktivitas)
// Badge: community_contributor (reputasi)

export interface Badge {
  key: string
  label: string
  icon: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'                // Hanya 2 role sistem
  phone?: string
  avatar?: string | null
  bio?: string
  organization?: string
  website?: string
  social_media?: Record<string, string>
  is_active: boolean
  // Dynamic statuses
  is_investor: boolean
  is_business_owner: boolean
  is_community_contributor: boolean
  active_statuses: string[]             // e.g. ['business_owner', 'investor']
  badges: Badge[]
  total_verifications_given: number
  created_at: string
  updated_at?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  nama: string
  email: string
  password: string
  password_confirmation: string
  // TIDAK ada pilihan role saat registrasi
}

export interface LoginResponse {
  status: string
  message: string
  data: {
    token: string
    token_type: string
    expires_in: number
    user: AuthUser
  }
}

export interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}