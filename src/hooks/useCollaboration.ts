// hooks/useCollaboration.ts
// SWARA — Hook for Collaborations

'use client'

import { useState, useEffect, useCallback } from 'react'
import { collaborationService } from '@/services/collaboration.service'
import type { Collaboration, CollaborationStatus, PaginationData, CreateCollaborationRequest } from '@/types/resource'

export function useCollaborations(initialStatus?: CollaborationStatus) {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([])
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<CollaborationStatus | undefined>(initialStatus)

  const fetchCollaborations = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await collaborationService.getAll(
        statusFilter ? { status: statusFilter } : undefined
      )
      const data = response.data?.data
      setCollaborations(data?.collaborations || [])
      setPagination(data?.pagination || null)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal memuat kolaborasi')
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchCollaborations()
  }, [fetchCollaborations])

  const createCollaboration = async (data: CreateCollaborationRequest) => {
    try {
      const response = await collaborationService.create(data)
      await fetchCollaborations() // refresh list
      return response.data
    } catch (err: any) {
      throw err?.response?.data?.message || 'Gagal mengirim permintaan kolaborasi'
    }
  }

  const respondCollaboration = async (id: string, status: 'accepted' | 'rejected') => {
    try {
      const response = await collaborationService.respond(id, status)
      await fetchCollaborations()
      return response.data
    } catch (err: any) {
      throw err?.response?.data?.message || 'Gagal merespons kolaborasi'
    }
  }

  return {
    collaborations,
    pagination,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    createCollaboration,
    respondCollaboration,
    refetch: fetchCollaborations,
  }
}

export default useCollaborations
