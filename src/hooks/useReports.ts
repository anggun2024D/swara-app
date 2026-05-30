// hooks/useReports.ts
import { useState, useEffect, useCallback } from 'react'
import { reportsService } from '@/services/reports.service'
import { getErrorMessage } from '@/services/api'
import type { Report, ReportFilters } from '@/types'

interface ReportsData {
  laporan: Report[]
  pagination: {
    total: number
    per_halaman: number
    halaman_ini: number
    total_halaman: number
  }
}

export function useReports(filters: ReportFilters = {}) {
  const [data, setData] = useState<ReportsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReports = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await reportsService.getReports(filters)
      setData(res)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }, [JSON.stringify(filters)]) // eslint-disable-line

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  return { data, isLoading, error, refetch: fetchReports }
}