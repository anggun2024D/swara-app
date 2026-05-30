'use client'

import { useState, useEffect, useCallback } from 'react'

export interface MapReport {
  id: string
  lat: number
  lng: number
  status: string
  is_urgent: boolean
  title: string
  pelapor: string   // ✅ required oleh MapComponent — kosongkan untuk data publik
  kategori: string
  address: string
}

interface UsePublicMapReportsReturn {
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
  }
}

export function usePublicMapReports(): UsePublicMapReportsReturn {
  const [reports, setReports] = useState<MapReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReports = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // ✅ Pakai fetch biasa — TANPA Axios instance bertoken
      // Endpoint publik: tidak butuh Authorization header
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/publik/peta`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          // cache: 'no-store' jika ingin selalu fresh
        }
      )

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }

      const json = await res.json()

      if (!json.success) {
        throw new Error(json.message ?? 'Response tidak valid')
      }

      const rawData: any[] = json.data ?? []

      const mapped: MapReport[] = rawData
        .filter(r => r.lokasi?.latitude != null && r.lokasi?.longitude != null)
        .map(r => ({
          id:        r.id,
          lat:       parseFloat(r.lokasi.latitude),
          lng:       parseFloat(r.lokasi.longitude),
          status:    r.status ?? 'tersubmit',
          is_urgent: r.is_urgent ?? false,
          title:     r.judul ?? 'Laporan',
          pelapor:   '',   // tidak diekspos di endpoint publik
          kategori:  r.category?.nama ?? '-',
          address:   r.lokasi?.address ?? '',
        }))

      setReports(mapped)
    } catch (err: any) {
      setError(err?.message ?? 'Gagal memuat data peta')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReports()
    const interval = setInterval(fetchReports, 30_000)
    return () => clearInterval(interval)
  }, [fetchReports])

  const stats = {
    total:     reports.length,
    urgent:    reports.filter(r => r.is_urgent).length,
    tersubmit: reports.filter(r => r.status === 'tersubmit').length,
    diproses:  reports.filter(r => r.status === 'diproses').length,
    selesai:   reports.filter(r => r.status === 'selesai').length,
  }

  return { reports, isLoading, error, refetch: fetchReports, stats }
}