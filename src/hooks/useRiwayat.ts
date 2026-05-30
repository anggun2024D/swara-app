// hooks/useRiwayat.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import api from '@/services/api'
import type { Report } from '@/types'

export function useRiwayat() {
  const [reports, setReports]     = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState<string | null>(null)

  const fetch = useCallback(() => {
    setIsLoading(true)
    setError(null)
    api
      .get('/laporan/riwayat', { params: { per_halaman: 'all' } })
      .then(res => {
        const laporan = res.data?.data?.laporan ?? []
        setReports(laporan)
      })
      .catch(() => setError('Gagal memuat riwayat laporan'))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { reports, isLoading, error, refetch: fetch }
}