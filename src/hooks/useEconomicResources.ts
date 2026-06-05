// hooks/useEconomicResources.ts
// SWARA — Hooks for Economic Resources

'use client'

import { useState, useEffect, useCallback } from 'react'
import { resourcesService } from '@/services/resources.service'
import type { EconomicResource, ResourceFilters, PaginationData } from '@/types/resource'

// ── Daftar semua potensi (aktif) ─────────────────────────────
export function useEconomicResources(initialFilters?: ResourceFilters) {
  const [resources, setResources] = useState<EconomicResource[]>([])
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ResourceFilters>(initialFilters || {})

  const fetchResources = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await resourcesService.getAll(filters)
      const data = response.data?.data
      setResources(data?.resources || [])
      setPagination(data?.pagination || null)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal memuat potensi ekonomi')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchResources()
  }, [fetchResources])

  return { resources, pagination, loading, error, filters, setFilters, refetch: fetchResources }
}

// ── Potensi milik user login ─────────────────────────────────
export function useMyResources(initialFilters?: ResourceFilters) {
  const [resources, setResources] = useState<EconomicResource[]>([])
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ResourceFilters>(initialFilters || {})

  const fetchResources = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await resourcesService.getMine(filters)
      const data = response.data?.data
      setResources(data?.resources || [])
      setPagination(data?.pagination || null)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal memuat potensi saya')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchResources()
  }, [fetchResources])

  return { resources, pagination, loading, error, filters, setFilters, refetch: fetchResources }
}

// ── Detail potensi by ID ─────────────────────────────────────
export function useResourceById(id: string) {
  const [resource, setResource] = useState<EconomicResource | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchResource = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const response = await resourcesService.getById(id)
      setResource(response.data?.data || null)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal memuat detail potensi')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchResource()
  }, [fetchResource])

  return { resource, loading, error, refetch: fetchResource }
}

export default useEconomicResources
