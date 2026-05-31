import { useState, useEffect } from 'react'
import { usersService, AdminUserDetail } from '@/services/users.service'

interface UseUserDetailReturn {
  user: AdminUserDetail | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useUserDetail(id: string): UseUserDetailReturn {
  const [user, setUser]         = useState<AdminUserDetail | null>(null)
  const [isLoading, setLoading] = useState(true)
  const [error, setError]       = useState<string | null>(null)

  const fetch = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await usersService.getUserById(id)
      setUser(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data pengguna')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [id])

  return { user, isLoading, error, refetch: fetch }
}