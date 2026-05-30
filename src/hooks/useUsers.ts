import { useState, useEffect, useCallback } from 'react'
import { usersService, AdminUser, UserFilters, UserPagination } from '@/services/users.service'

interface UseUsersReturn {
  users: AdminUser[]
  pagination: UserPagination | null
  isLoading: boolean
  error: string | null
  filters: UserFilters
  setFilters: (filters: Partial<UserFilters>) => void
  setPage: (page: number) => void
  refetch: () => void
}

export function useUsers(initialFilters: UserFilters = {}): UseUsersReturn {
  const [users, setUsers]           = useState<AdminUser[]>([])
  const [pagination, setPagination] = useState<UserPagination | null>(null)
  const [isLoading, setIsLoading]   = useState(true)
  const [error, setError]           = useState<string | null>(null)
  const [filters, setFiltersState]  = useState<UserFilters>({
    per_halaman: 15,
    halaman: 1,
    ...initialFilters,
  })

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await usersService.getUsers(filters)
      setUsers(data.users)
      setPagination(data.pagination)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat data pengguna'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const setFilters = useCallback((newFilters: Partial<UserFilters>) => {
    setFiltersState(prev => ({
      ...prev,
      ...newFilters,
      // Reset ke halaman 1 kalau filter berubah (kecuali kalau set halaman sendiri)
      halaman: newFilters.halaman ?? 1,
    }))
  }, [])

  const setPage = useCallback((page: number) => {
    setFiltersState(prev => ({ ...prev, halaman: page }))
  }, [])

  return {
    users,
    pagination,
    isLoading,
    error,
    filters,
    setFilters,
    setPage,
    refetch: fetchUsers,
  }
}