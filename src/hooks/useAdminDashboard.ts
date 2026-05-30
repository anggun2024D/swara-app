// hooks/useAdminDashboard.ts
import { useState, useEffect, useCallback } from 'react'
import { reportsService } from '@/services/reports.service'
import { getErrorMessage } from '@/services/api'
import type { Report, ReportStatus } from '@/types'

export interface DashboardMetrics {
  total: number
  tersubmit: number
  diverifikasi: number
  diproses: number
  selesai: number
  ditolak: number
  urgent: number
  recentReports: Report[]        // 5 terbaru
  urgentReports: Report[]        // priority=urgent yang belum selesai
  categoryBreakdown: { nama: string; total: number }[]
  statusBreakdown: { status: ReportStatus; total: number }[]
  trendMingguIni: { label: string; masuk: number; selesai: number }[]
  // Kecamatan dihitung dari address — best-effort
  kecamatanBreakdown: { nama: string; total: number }[]
}

function buildTrend(reports: Report[]): DashboardMetrics['trendMingguIni'] {
  const hari = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
  const today = new Date()

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    const dateStr = d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })

    // "dibuat_pada" format dari backend: "10 Mei 2025 14:30"
    // Kita match berdasarkan tanggal saja
    const masuk = reports.filter(r => {
      const parts = r.dibuat_pada.split(' ')   // ["10", "Mei", "2025", "14:30"]
      const tgl = `${parts[0].padStart(2,'0')}/${monthToNum(parts[1])}/${parts[2]}`
      return tgl === dateStr
    }).length

    const selesai = reports.filter(r => {
      if (r.status !== 'selesai') return false
      const parts = r.diupdate_pada.split(' ')
      const tgl = `${parts[0].padStart(2,'0')}/${monthToNum(parts[1])}/${parts[2]}`
      return tgl === dateStr
    }).length

    return { label: hari[d.getDay()], masuk, selesai }
  })
}

function monthToNum(month: string): string {
  const map: Record<string, string> = {
    Jan:'01', Feb:'02', Mar:'03', Apr:'04', Mei:'05', Jun:'06',
    Jul:'07', Agu:'08', Sep:'09', Okt:'10', Nov:'11', Des:'12'
  }
  return map[month] ?? '01'
}

function computeMetrics(reports: Report[]): DashboardMetrics {
  const byStatus = (s: ReportStatus) => reports.filter(r => r.status === s)

  // Breakdown per kategori
  const catMap = new Map<string, number>()
  reports.forEach(r => {
    const nama = r.category.nama
    catMap.set(nama, (catMap.get(nama) ?? 0) + 1)
  })
  const categoryBreakdown = Array.from(catMap.entries())
    .map(([nama, total]) => ({ nama, total }))
    .sort((a, b) => b.total - a.total)

  // Breakdown per status
  const statusList: ReportStatus[] = ['tersubmit', 'diverifikasi', 'diproses', 'selesai', 'ditolak']
  const statusBreakdown = statusList.map(s => ({
    status: s,
    total: byStatus(s).length,
  }))

  // Kecamatan — ekstrak kata setelah "Kec." di address, atau ambil bagian terakhir
  const kecMap = new Map<string, number>()
  reports.forEach(r => {
    const addr = r.lokasi.address ?? ''
    const match = addr.match(/Kec(?:amatan)?\.?\s+([A-Za-z\s]+?)(?:,|$)/i)
    const nama = match ? match[1].trim() : 'Lainnya'
    kecMap.set(nama, (kecMap.get(nama) ?? 0) + 1)
  })
  const kecamatanBreakdown = Array.from(kecMap.entries())
    .map(([nama, total]) => ({ nama, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)

  const urgentReports = reports.filter(
    r => r.priority === 'urgent' && r.status !== 'selesai' && r.status !== 'ditolak'
  )

  return {
    total:        reports.length,
    tersubmit:    byStatus('tersubmit').length,
    diverifikasi: byStatus('diverifikasi').length,
    diproses:     byStatus('diproses').length,
    selesai:      byStatus('selesai').length,
    ditolak:      byStatus('ditolak').length,
    urgent:       urgentReports.length,
    recentReports:    reports.slice(0, 5),
    urgentReports:    urgentReports.slice(0, 3),
    categoryBreakdown,
    statusBreakdown,
    trendMingguIni:   buildTrend(reports),
    kecamatanBreakdown,
  }
}

export function useAdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await reportsService.getReports({ per_halaman: 'all' } as any)
      setMetrics(computeMetrics(res.laporan))
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { metrics, isLoading, error, refetch: fetch }
}