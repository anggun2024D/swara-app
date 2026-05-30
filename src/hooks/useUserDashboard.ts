import { useState, useEffect, useCallback } from 'react'
import api from '@/services/api'
import { Report } from '@/types/report'
import { useKategori } from '@/hooks/useKategori'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface KategoriItem {
  id: number
  nama: string
  icon_url: string | null
  reportCount: number   // dihitung dari riwayat milik user
}

export interface MapMarker {
  id: string
  judul: string
  latitude: number
  longitude: number
  status: Report['status']
}

export interface NotifItem {
  id: string
  judul: string
  pesan: string
  tipe: string
  is_read: boolean
  report_id: string | null
  dibuat_pada: string
}

export interface UserDashboardData {
  // stats
  totalLaporan: number
  selesai: number
  diproses: number

  // kategori + count
  kategori: KategoriItem[]

  // map markers
  markers: MapMarker[]

  // notifikasi terbaru (max 5)
  notifikasi: NotifItem[]
  belumDibaca: number
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseUserDashboardReturn {
  data: UserDashboardData | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useUserDashboard(): UseUserDashboardReturn {
  const [data, setData]         = useState<UserDashboardData | null>(null)
  const [isLoading, setLoading] = useState(true)
  const [error, setError]       = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch paralel: riwayat laporan, kategori, notifikasi
      const [riwayatRes, kategoriRes, notifRes] = await Promise.all([
        api.get<{
          success: boolean
          data: { laporan: Report[] }
        }>('/laporan/riwayat'),

        api.get<{
          success: boolean
          data: Array<{ id: number; nama: string; icon_url: string | null }>
        }>('/kategori'),

        api.get<{
          success: boolean
          data: { notifikasi: NotifItem[]; belum_dibaca: number }
        }>('/notifikasi'),
      ])

      const laporan  = riwayatRes.data.data.laporan   ?? []
      const rawKateg = kategoriRes.data.data           ?? []
      const notifData = notifRes.data.data

      // ── Stats ──────────────────────────────────────────────────────────────
      const totalLaporan = laporan.length
      const selesai      = laporan.filter(r => r.status === 'selesai').length
      const diproses     = laporan.filter(r => r.status === 'diproses').length

      // ── Kategori + count laporan user ──────────────────────────────────────
      const countPerKategori: Record<number, number> = {}
      laporan.forEach(r => {
        if (r.category?.id) {
          countPerKategori[r.category.id] = (countPerKategori[r.category.id] ?? 0) + 1
        }
      })

      const kategori: KategoriItem[] = rawKateg.map(k => ({
        id:          k.id,
        nama:        k.nama,
        icon_url:    k.icon_url,
        reportCount: countPerKategori[k.id] ?? 0,
      }))

      // ── Map markers (hanya yang punya koordinat valid) ─────────────────────
      const markers: MapMarker[] = laporan
        .filter(r => r.lokasi?.latitude && r.lokasi?.longitude)
        .map(r => ({
          id:        r.id,
          judul:     r.judul,
          latitude:  r.lokasi.latitude,
          longitude: r.lokasi.longitude,
          status:    r.status,
        }))

      // ── Notifikasi 5 terbaru ───────────────────────────────────────────────
      const notifikasi = (notifData.notifikasi ?? []).slice(0, 5)

      setData({
        totalLaporan,
        selesai,
        diproses,
        kategori,
        markers,
        notifikasi,
        belumDibaca: notifData.belum_dibaca ?? 0,
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat data dashboard'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  return { data, isLoading, error, refetch: fetchAll }
}