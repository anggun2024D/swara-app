'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Clock, ChevronRight, CheckCircle, Loader, AlertCircle, FileText } from 'lucide-react'
import { UserReport } from '@/hooks/useUserReports'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  tersubmit:    { label: 'Baru Diterima',  color: 'text-blue-600',   bg: 'bg-blue-100',   icon: FileText },
  diverifikasi: { label: 'Diverifikasi',   color: 'text-indigo-600', bg: 'bg-indigo-100', icon: CheckCircle },
  diproses:     { label: 'Diproses',       color: 'text-yellow-700', bg: 'bg-yellow-100', icon: Loader },
  selesai:      { label: 'Selesai',        color: 'text-green-700',  bg: 'bg-green-100',  icon: CheckCircle },
  ditolak:      { label: 'Ditolak',        color: 'text-red-600',    bg: 'bg-red-100',    icon: AlertCircle },
}

// Progress perbaikan berdasarkan status
const progressMap: Record<string, number> = {
  tersubmit:    10,
  diverifikasi: 30,
  diproses:     65,
  selesai:      100,
  ditolak:      0,
}

interface Props {
  report: UserReport | null
  onClose: () => void
}

export default function ReportDetailSidebar({ report, onClose }: Props) {
  const router = useRouter()
  const [imgIdx, setImgIdx] = useState(0)

  const cfg      = report ? (statusConfig[report.status] ?? statusConfig.tersubmit) : null
  const progress = report ? (progressMap[report.status] ?? 0) : 0
  const StatusIcon = cfg?.icon ?? FileText

  return (
    <AnimatePresence>
      {report && (
        <motion.div
          key="sidebar"
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="absolute top-0 right-0 h-full w-[340px] bg-white shadow-2xl z-[999] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-text text-base">Detail Laporan</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">

            {/* Foto */}
            <div className="relative w-full h-48 bg-gray-100">
              {report.foto.length > 0 ? (
                <>
                  <img
                    src={report.foto[imgIdx]?.url}
                    alt={report.judul}
                    className="w-full h-full object-cover"
                  />
                  {/* Status badge */}
                  <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${cfg?.bg} ${cfg?.color}`}>
                    {cfg?.label}
                  </span>
                  {/* Thumbnail dots */}
                  {report.foto.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {report.foto.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setImgIdx(i)}
                          className={`w-1.5 h-1.5 rounded-full transition ${i === imgIdx ? 'bg-white' : 'bg-white/50'}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <FileText size={32} className="mb-1 opacity-40" />
                  <p className="text-xs">Tidak ada foto</p>
                  {/* Status badge tetap tampil */}
                  <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${cfg?.bg} ${cfg?.color}`}>
                    {cfg?.label}
                  </span>
                </div>
              )}
            </div>

            <div className="px-5 py-4 space-y-4">

              {/* Judul & alamat */}
              <div>
                <h2 className="font-bold text-lg text-text leading-tight">{report.judul}</h2>
                <p className="text-xs text-muted flex items-center gap-1 mt-1">
                  <MapPin size={11} className="flex-shrink-0" />
                  {report.lokasi.address || `${report.lokasi.latitude}, ${report.lokasi.longitude}`}
                </p>
              </div>

              {/* Progress perbaikan */}
              {report.status !== 'ditolak' && (
                <div>
                  <div className="flex justify-between text-xs font-semibold text-muted mb-1.5">
                    <span>PROGRESS PERBAIKAN</span>
                    <span className="text-primary">{progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
              )}

              {/* Deskripsi */}
              <div>
                <p className="text-xs font-semibold text-muted mb-1">DESKRIPSI</p>
                <p className="text-sm text-text/80 leading-relaxed line-clamp-3">{report.deskripsi}</p>
              </div>

              {/* Riwayat Aktivitas */}
              <div>
                <p className="text-xs font-semibold text-muted mb-2">RIWAYAT AKTIVITAS</p>
                <div className="space-y-3">
                  {/* Selalu tampil: laporan dikirim */}
                  <ActivityItem
                    label="Laporan Dikirim"
                    time={report.dibuat_pada}
                    done
                  />
                  {['diverifikasi', 'diproses', 'selesai'].includes(report.status) && (
                    <ActivityItem label="Verifikasi Selesai" time={report.diupdate_pada} done />
                  )}
                  {['diproses', 'selesai'].includes(report.status) && (
                    <ActivityItem label="Petugas Menuju Lokasi" time={report.diupdate_pada} done />
                  )}
                  {report.status === 'selesai' && (
                    <ActivityItem label="Perbaikan Selesai" time={report.diupdate_pada} done />
                  )}
                  {report.status === 'ditolak' && (
                    <ActivityItem label="Laporan Ditolak" time={report.diupdate_pada} done={false} rejected />
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Footer CTA */}
          <div className="px-5 py-4 border-t border-gray-100">
            <button
              onClick={() => router.push(`/riwayat`)}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold text-sm rounded-2xl flex items-center justify-center gap-2 transition"
            >
              Lihat Detail Lengkap
              <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ActivityItem({
  label, time, done, rejected
}: { label: string; time: string; done: boolean; rejected?: boolean }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
        rejected ? 'bg-red-400' : done ? 'bg-primary' : 'bg-gray-300'
      }`} />
      <div>
        <p className={`text-xs font-medium ${rejected ? 'text-red-500' : done ? 'text-text' : 'text-muted'}`}>
          {label}
        </p>
        <p className="text-xs text-muted">{time}</p>
      </div>
    </div>
  )
}