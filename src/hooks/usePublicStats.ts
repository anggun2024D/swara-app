'use client'

import { useState, useEffect } from 'react'
import { analyticsService } from '@/services/analytics.service'
import type { PublicStats } from '@/types/analytics'

export function usePublicStats() {
  const [stats, setStats] = useState<PublicStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await analyticsService.getPublicStats()
        setStats(res.data?.data || null)
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Gagal memuat statistik')
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  return { stats, isLoading, error }
}

export default usePublicStats