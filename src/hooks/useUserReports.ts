'use client'

import { useState, useEffect, useCallback } from 'react'
import api from '@/services/api'

export interface UserReport {
  id: string
  judul: string
  deskripsi: string
  status: string
  kategori: { id: string; nama: string }
  lokasi: { latitude: number; longitude: number; address: string }
  foto: { id: string; url: string }[]
  dibuat_pada: string
  diupdate_pada: string
}

export function useUserReports() {
  const [reports, setReports]   = useState<UserReport[]>([])
  const [isLoading, setLoading] = useState(true)
  const [error, setError]       = useState<string | null>(null)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.get('/laporan', {
        params: { per_halaman: 'all' }
      })
      const raw = res.data.data?.laporan ?? []
      const mapped: UserReport[] = raw
        .filter((r: any) => r.lokasi?.latitude && r.lokasi?.longitude)
        .map((r: any) => ({
          id:          r.id,
          judul:       r.judul,
          deskripsi:   r.deskripsi,
          status:      r.status,
          kategori:    r.category ?? { id: '', nama: 'Lainnya' },
          lokasi:      r.lokasi,
          foto:        r.foto ?? [],
          dibuat_pada: r.dibuat_pada,
          diupdate_pada: r.diupdate_pada,
        }))
      setReports(mapped)
    } catch {
      setError('Gagal memuat laporan')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const stats = {
    total:     reports.length,
    diproses:  reports.filter(r => r.status === 'diproses').length,
    tersubmit: reports.filter(r => r.status === 'tersubmit').length,
    selesai:   reports.filter(r => r.status === 'selesai').length,
  }

  return { reports, isLoading, error, refetch: fetch, stats }
}