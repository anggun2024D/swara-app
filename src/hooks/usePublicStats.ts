'use client'

import { useState, useEffect, useCallback } from 'react'

export interface PublicStats {
  total: number
  selesai: number
  diproses: number
  tersubmit: number
  ditolak: number
  completion_rate: number   // persentase selesai/total
  category_breakdown: {
    name: string
    count: number
    percentage: number
  }[]
}

interface UsePublicStatsReturn {
  stats: PublicStats | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function usePublicStats(): UsePublicStatsReturn {
  const [stats, setStats] = useState<PublicStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const json = await res.json()
      if (!json.success) throw new Error(json.message ?? 'Response tidak valid')

      setStats(json.data)
    } catch (err: any) {
      setError(err?.message ?? 'Gagal memuat statistik')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return { stats, isLoading, error, refetch: fetchStats }
}