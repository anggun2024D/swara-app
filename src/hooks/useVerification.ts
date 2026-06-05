'use client'
import { useState, useEffect, useCallback } from 'react'
import { getPendingReports, verifikasiLaporan } from '@/services/reports.service'

export interface VerificationReport {
  id: string
  judul: string
  deskripsi: string
  status: string
  pelapor: { id: string; nama: string }
  kategori: { id: string; nama: string }
  lokasi: { latitude: number; longitude: number; address: string }
  foto: { id: string; url: string }[]
  dibuat_pada: string
}

export function useVerification() {
  const [queue, setQueue]             = useState<VerificationReport[]>([])
  const [current, setCurrent]         = useState(0)
  const [isLoading, setLoading]       = useState(true)
  const [isSubmitting, setSubmitting] = useState(false)
  const [error, setError]             = useState<string | null>(null)

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const raw = await getPendingReports()
      const mapped: VerificationReport[] = raw.map((r: any) => ({
        id:          r.id,
        judul:       r.judul,
        deskripsi:   r.deskripsi,
        status:      r.status,
        pelapor:     r.pelapor,
        kategori:    r.category,
        lokasi:      r.lokasi,
        foto:        r.foto ?? [],
        dibuat_pada: r.dibuat_pada,
      }))
      setQueue(mapped)
      setCurrent(0)
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Gagal memuat laporan')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPending() }, [fetchPending])

  const handleVerify = useCallback(async (
    status: 'diproses' | 'ditolak',
    adminNotes?: string
  ) => {
    if (!queue[current]) return

    // ── Validasi frontend: alasan wajib saat menolak ──
    if (status === 'ditolak') {
      if (!adminNotes || adminNotes.trim().length < 10) {
        setError('Alasan penolakan wajib diisi minimal 10 karakter.')
        return
      }
    }

    setError(null)

    try {
      setSubmitting(true)
      await verifikasiLaporan(queue[current].id, { status, admin_notes: adminNotes })
      setQueue(prev => {
        const next = prev.filter((_, i) => i !== current)
        if (current >= next.length && next.length > 0) setCurrent(next.length - 1)
        return next
      })
    } catch (e: any) {
      const msg = e?.response?.data?.errors?.admin_notes?.[0]
        ?? e?.response?.data?.message
        ?? 'Gagal memverifikasi laporan'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }, [queue, current])

  return {
    queue,
    current,
    setCurrent,
    report:       queue[current] ?? null,
    isLoading,
    isSubmitting,
    error,
    refetch:      fetchPending,
    handleVerify,
    total:        queue.length,
  }
}