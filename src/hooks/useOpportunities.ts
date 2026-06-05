// hooks/useOpportunities.ts
// SWARA — Hook for Opportunity Board

'use client'

import { useState, useEffect, useCallback } from 'react'
import { opportunitiesService } from '@/services/opportunities.service'
import type { EconomicResource, ResourceFilters, PaginationData } from '@/types/resource'

export function useOpportunities(initialFilters?: ResourceFilters) {
  const [opportunities, setOpportunities] = useState<EconomicResource[]>([])
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ResourceFilters>(initialFilters || {})

  const fetchOpportunities = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await opportunitiesService.getAll(filters)
      const data = response.data?.data
      setOpportunities(data?.opportunities || [])
      setPagination(data?.pagination || null)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal memuat peluang')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchOpportunities()
  }, [fetchOpportunities])

  return { opportunities, pagination, loading, error, filters, setFilters, refetch: fetchOpportunities }
}

export function useSavedOpportunities() {
  const [saved, setSaved] = useState<EconomicResource[]>([])
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSaved = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await opportunitiesService.getSaved()
      const data = response.data?.data
      setSaved(data?.saved || [])
      setPagination(data?.pagination || null)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal memuat peluang tersimpan')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSaved()
  }, [fetchSaved])

  const saveOpportunity = async (resourceId: string) => {
    try {
      await opportunitiesService.save(resourceId)
      await fetchSaved()
    } catch (err: any) {
      throw err?.response?.data?.message || 'Gagal menyimpan peluang'
    }
  }

  const unsaveOpportunity = async (resourceId: string) => {
    try {
      await opportunitiesService.unsave(resourceId)
      await fetchSaved()
    } catch (err: any) {
      throw err?.response?.data?.message || 'Gagal menghapus peluang dari simpanan'
    }
  }

  return { saved, pagination, loading, error, saveOpportunity, unsaveOpportunity, refetch: fetchSaved }
}

export default useOpportunities
