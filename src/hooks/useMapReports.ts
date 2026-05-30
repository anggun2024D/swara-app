'use client'

import { useState, useEffect, useCallback } from 'react'
import api from '@/services/api'
import { Report } from '@/types'

export interface MapReport {
  id: string
  lat: number
  lng: number
  status: string
  is_urgent: boolean
  title: string
  pelapor: string
  kategori: string
  address: string
}

interface UseMapReportsReturn {
  reports: MapReport[]
  isLoading: boolean
  error: string | null
  refetch: () => void
  stats: {
    total: number
    urgent: number
    tersubmit: number
    diproses: number
    selesai: number
    ditolak: number
  }
}

export function useMapReports(): UseMapReportsReturn {
  const [reports, setReports] = useState<MapReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReports = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Ambil semua laporan — sesuai API route /api/laporan
      const response = await api.get('/laporan', {
        params: { per_halaman: 'all' } 
      })

      const rawReports = response.data.data.laporan ?? []

      // Filter hanya yang punya koordinat
      const mapped: MapReport[] = rawReports
        .filter((r: any) => r.lokasi?.latitude != null && r.lokasi?.longitude != null)
        .map((r: any) => ({
          id:        r.id,
          lat:       parseFloat(r.lokasi.latitude),
          lng:       parseFloat(r.lokasi.longitude),
          status:    r.status ?? 'tersubmit',
          is_urgent: r.is_urgent ?? false,
          title:     r.judul ?? 'Laporan',
          pelapor:   r.pelapor?.nama ?? '-',
          kategori:  r.category?.nama ?? '-',
          address:   r.lokasi?.address ?? '',
        }))

      setReports(mapped)
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Gagal memuat data laporan')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReports()

    // Auto-refresh setiap 30 detik (real-time feel)
    const interval = setInterval(fetchReports, 30_000)
    return () => clearInterval(interval)
  }, [fetchReports])

  const stats = {
    total:     reports.length,
    urgent:    reports.filter(r => r.is_urgent).length,   // ← dari is_urgent
    tersubmit: reports.filter(r => r.status === 'tersubmit').length,
    diproses:  reports.filter(r => r.status === 'diproses').length,
    selesai:   reports.filter(r => r.status === 'selesai').length,
    ditolak:   reports.filter(r => r.status === 'ditolak').length,
    }

  return { reports, isLoading, error, refetch: fetchReports, stats }
}