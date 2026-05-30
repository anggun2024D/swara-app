'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft, MapPin, Calendar, User,
  Clock, CheckCircle, XCircle, ShieldCheck,
  AlertTriangle, ImageOff,
} from 'lucide-react'
import api from '@/services/api'
import EmptyState from '@/components/ui/EmptyState'
import type { Report, ReportStatus } from '@/types'

// ── helpers ──────────────────────────────────────────────────────────────────

function parseBackendDate(str: string): Date {
  const iso = Date.parse(str)
  if (!isNaN(iso)) return new Date(iso)

  const bulanMap: Record<string, string> = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04',
    Mei: '05', Jun: '06', Jul: '07', Agu: '08',
    Sep: '09', Okt: '10', Nov: '11', Des: '12',
  }
  const m = str.match(/(\d{1,2})\s+(\w+)\s+(\d{4})(?:\s+(\d{2}:\d{2}))?/)
  if (m) {
    const [, day, bulan, year, time] = m
    const month = bulanMap[bulan] ?? '01'
    return new Date(`${year}-${month}-${day.padStart(2, '0')}T${time ?? '00:00'}:00`)
  }
  return new Date()
}

// ── status config ─────────────────────────────────────────────────────────────

const statusConfig: Record<ReportStatus, {
  label: string
  bgBadge: string
  icon: React.ElementType
}> = {
  tersubmit:    { label: 'Tersubmit',    bgBadge: 'bg-blue-100 text-blue-800',   icon: Clock },
  diverifikasi: { label: 'Diverifikasi', bgBadge: 'bg-indigo-100 text-indigo-800', icon: ShieldCheck },
  diproses:     { label: 'Diproses',     bgBadge: 'bg-amber-100 text-amber-800', icon: Clock },
  selesai:      { label: 'Selesai',      bgBadge: 'bg-green-100 text-green-800', icon: CheckCircle },
  ditolak:      { label: 'Ditolak',      bgBadge: 'bg-red-100 text-red-800',     icon: XCircle },
}

// ── progress bar ──────────────────────────────────────────────────────────────

const progressMap: Record<ReportStatus, number> = {
  tersubmit: 10, diverifikasi: 30, diproses: 65, selesai: 100, ditolak: 0,
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function DetailLaporanPage() {
  const { id } = useParams()
  const router  = useRouter()

  const [report, setReport]     = useState<Report | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound]   = useState(false)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    api
      .get(`/laporan/${id}`)
      .then(res => {
        const data = res.data?.data ?? res.data
        if (!data) { setNotFound(true); return }
        setReport(data)
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false))
  }, [id])

  // ── loading skeleton ──
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <div className="h-8 w-32 rounded-lg bg-gray-100 animate-pulse" />
        <div className="h-48 rounded-2xl bg-gray-100 animate-pulse" />
        <div className="h-64 rounded-2xl bg-gray-100 animate-pulse" />
      </div>
    )
  }

  if (notFound || !report) {
    return <EmptyState title="Laporan tidak ditemukan" description="ID laporan tidak valid atau sudah dihapus" />
  }

  const sc       = statusConfig[report.status] ?? statusConfig.tersubmit
  const StatusIcon = sc.icon
  const progress = progressMap[report.status] ?? 0
  const date     = parseBackendDate(report.dibuat_pada)
  const photos   = report.foto ?? []

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-primary font-semibold mb-4 hover:underline"
      >
        <ArrowLeft size={18} /> Kembali
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="
        bg-white
        rounded-[20px]
        overflow-hidden
        shadow-sm
        border
        border-border
        "
      >
        {/* ── Hero ── */}
        <div
        className="
            bg-gradient-to-r
            from-primary
            to-primary-mid
            p-8
            text-white
            rounded-t-[20px]
        "
        >
          <div className="flex justify-between items-start flex-wrap gap-2">
            <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              {report.category?.nama ?? '-'}
            </span>
            <div className="flex items-center gap-2">
              {report.is_urgent && (
                <span className="flex items-center gap-1 text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded">
                  <AlertTriangle size={10} /> Urgent
                </span>
              )}
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${sc.bgBadge}`}>
                <StatusIcon size={12} className="inline mr-1" />
                {sc.label}
              </span>
            </div>
          </div>

          <h1 className="text-xl md:text-2xl font-bold mt-3">{report.judul}</h1>

          <div className="flex flex-wrap gap-4 mt-4 text-sm text-white/80">
            <span className="flex items-center gap-1">
              <User size={14} /> {report.pelapor?.nama ?? '-'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} /> {report.dibuat_pada}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {report.lokasi?.address ?? '-'}
            </span>
          </div>
        </div>

        {/* ── Progress ── */}
        {report.status !== 'ditolak' && (
          <div className="px-6 pt-5">
            <div className="flex justify-between text-xs font-semibold text-muted mb-1">
              <span>Progress Penanganan</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {/* ── Content ── */}
        <div className="p-6 space-y-6">

          {/* Deskripsi */}
          <div>
            <h3 className="font-bold text-text mb-2">Deskripsi</h3>
            <p className="text-muted text-sm leading-relaxed">{report.deskripsi}</p>
          </div>

          {/* Foto */}
          {photos.length > 0 && (
            <div>
              <h3 className="font-bold text-text mb-3">Foto Laporan</h3>
              {/* Main photo */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 mb-3">
                <img
                  src={photos[activeImg]?.url}
                  alt={`Foto ${activeImg + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Thumbnails */}
              {photos.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {photos.map((f, i) => (
                    <button
                      key={f.id}
                      onClick={() => setActiveImg(i)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        i === activeImg ? 'border-primary' : 'border-transparent opacity-60'
                      }`}
                    >
                      <img src={f.url} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {photos.length === 0 && (
            <div className="flex items-center gap-2 text-muted text-sm">
              <ImageOff size={16} /> Tidak ada foto terlampir
            </div>
          )}

          {/* Info grid */}
          <div>
            <h3 className="font-bold text-text mb-3">Informasi Tambahan</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <PriorityBox priority={report.priority} />
              <InfoBox label="Kategori"    value={report.category?.nama ?? '-'} />
              <InfoBox label="Pelapor"     value={report.pelapor?.nama ?? '-'} />
              <InfoBox label="Dibuat"      value={report.dibuat_pada} />
              <InfoBox label="Diupdate"    value={report.diupdate_pada} />
              <InfoBox label="ID Laporan"  value={report.id.slice(0, 8) + '...'} title={report.id} />
            </div>
          </div>

          {/* Catatan admin */}
          {report.admin_notes && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs font-bold text-amber-700 mb-1">Catatan Admin</p>
              <p className="text-sm text-amber-900">{report.admin_notes}</p>
            </div>
          )}

          {/* Ditolak notice */}
          {report.status === 'ditolak' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <XCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-700">Laporan Ditolak</p>
                <p className="text-xs text-red-600 mt-0.5">
                  {report.admin_notes ?? 'Laporan ini tidak memenuhi syarat untuk diproses.'}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">

            {/* Secondary Button */}
            <button
                onClick={() => router.push('/riwayat')}
                className="
                flex-1
                h-12
                rounded-2xl
                border
                border-primary/20
                bg-primary/5
                text-primary
                font-semibold
                hover:bg-primary/10
                transition-all
                duration-300
                shadow-sm
                hover:shadow-md
                "
            >
                Lihat Riwayat
            </button>

            {/* Primary Button */}
            <button
                onClick={() => router.push('/laporan')}
                className="
                flex-1
                h-12
                rounded-2xl
                bg-gradient-to-r
                from-primary
                to-primary-hover
                text-white
                font-semibold
                shadow-md
                hover:shadow-xl
                hover:scale-[1.01]
                active:scale-[0.99]
                transition-all
                duration-300
                "
            >
                Buat Laporan Baru
            </button>

            </div>
        </div>
      </motion.div>
    </div>
  )
}

function InfoBox({ label, value, title }: { label: string; value: string; title?: string }) {
  return (
    <div className="bg-gray-50 p-3 rounded-xl">
      <p className="text-muted text-xs mb-0.5">{label}</p>
      <p className="font-semibold text-sm capitalize truncate" title={title}>{value}</p>
    </div>
  )
}

const priorityConfig: Record<string, { label: string; color: string; dot: string }> = {
  rendah: { label: 'Rendah', color: 'text-green-700 bg-green-50', dot: 'bg-green-500' },
  sedang: { label: 'Sedang', color: 'text-blue-700  bg-blue-50',  dot: 'bg-blue-500'  },
  tinggi: { label: 'Tinggi', color: 'text-amber-700 bg-amber-50', dot: 'bg-amber-500' },
  urgent: { label: 'Urgent', color: 'text-red-700   bg-red-50',   dot: 'bg-red-500'   },
}

function PriorityBox({ priority }: { priority: string | null | undefined }) {
  const cfg = priority ? priorityConfig[priority] : null

  return (
    <div className="bg-gray-50 p-3 rounded-xl">
      <p className="text-muted text-xs mb-1.5">Prioritas</p>
      {cfg ? (
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${cfg.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
          {cfg.label}
        </span>
      ) : (
        <p className="font-semibold text-sm text-gray-400">Tidak diset</p>
      )}
    </div>
  )
}