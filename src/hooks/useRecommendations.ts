// hooks/useRecommendations.ts
// SWARA — Hook for AI Recommendations

'use client'

import { useState, useEffect, useCallback } from 'react'
import { resourcesService } from '@/services/resources.service'
import type { RecommendationData } from '@/types/resource'

export function useRecommendations(resourceId: string) {
  const [recommendations, setRecommendations] = useState<RecommendationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecommendations = useCallback(async () => {
    if (!resourceId) return
    setLoading(true)
    setError(null)
    try {
      const response = await resourcesService.getRecommendations(resourceId)
      setRecommendations(response.data?.data || null)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal memuat rekomendasi')
    } finally {
      setLoading(false)
    }
  }, [resourceId])

  useEffect(() => {
    fetchRecommendations()
  }, [fetchRecommendations])

  return { recommendations, loading, error, refetch: fetchRecommendations }
}

export default useRecommendations
