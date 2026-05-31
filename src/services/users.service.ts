import api from './api'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string
  nama: string
  email: string
  no_telp: string | null
  foto: string | null
  role: 'user' | 'admin'
  is_active: boolean
  total_laporan: number
  bergabung_pada: string
}

export interface AdminUserDetail {
  id: string
  nama: string
  email: string
  no_telp: string | null
  foto: string | null
  role: 'user' | 'admin'
  is_active: boolean
  total_laporan: number
  bergabung_pada: string
}

export interface UserFilters {
  search?: string
  role?: 'user' | 'admin' | ''
  status?: 'aktif' | 'nonaktif' | ''
  per_halaman?: number
  halaman?: number
}

export interface UserPagination {
  total: number
  per_halaman: number
  halaman_ini: number
  total_halaman: number
}

export interface UsersResponse {
  users: AdminUser[]
  pagination: UserPagination
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const usersService = {
  async getUsers(filters: UserFilters = {}): Promise<UsersResponse> {
    const params = new URLSearchParams()

    if (filters.search)      params.set('search',      filters.search)
    if (filters.role)        params.set('role',         filters.role)
    if (filters.status)      params.set('status',       filters.status)
    if (filters.per_halaman) params.set('per_halaman',  String(filters.per_halaman))
    if (filters.halaman)     params.set('halaman',      String(filters.halaman))

    const res = await api.get<{ success: boolean; data: UsersResponse }>(
      `/admin/users?${params.toString()}`
    )
    return res.data.data
  },

  getUserById: async (id: string): Promise<AdminUserDetail> => {
    const res = await api.get(`/admin/users/${id}`)
    return res.data.data
  },
}