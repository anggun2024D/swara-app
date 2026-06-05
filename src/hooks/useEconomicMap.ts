// hooks/useEconomicMap.ts
// SWARA — Hook for Economic Map

'use client'

import { useState, useEffect, useCallback } from 'react'
import { resourcesService } from '@/services/resources.service'
import type { MapMarker } from '@/types/resource'

interface MapFilters {
  category_id?: number
  province?: string
}

export function useEconomicMap(initialFilters?: MapFilters) {
  const [markers, setMarkers] = useState<MapMarker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<MapFilters>(initialFilters || {})

  // Statistik per kategori dari marker data
  const categoryStats = markers.reduce((acc, marker) => {
    const catId = marker.category?.id
    if (catId) {
      if (!acc[catId]) {
        acc[catId] = {
          id: catId,
          name: marker.category.name,
          slug: marker.category.slug,
          color: marker.category.color,
          icon: marker.category.icon,
          count: 0,
        }
      }
      acc[catId].count++
    }
    return acc
  }, {} as Record<number, { id: number; name: string; slug: string; color: string; icon: string; count: number }>)

  const fetchMapData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await resourcesService.getEconomicMap(filters)
      setMarkers(response.data?.data || [])
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal memuat data peta')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchMapData()
  }, [fetchMapData])

  return {
    markers,
    loading,
    error,
    filters,
    setFilters,
    refetch: fetchMapData,
    categoryStats: Object.values(categoryStats),
    totalMarkers: markers.length,
  }
}

export default useEconomicMap
