'use client'

import { motion } from 'framer-motion'
import { FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import type { Report, ReportStatus } from '@/types'

interface Props {
  reports: Report[]
  isLoading: boolean
}

const statusIcon: Record<ReportStatus, typeof FileText> = {
  tersubmit:    FileText,
  diverifikasi: CheckCircle,
  diproses:     Clock,
  selesai:      CheckCircle,
  ditolak:      AlertTriangle,
}

const statusColor: Record<ReportStatus, string> = {
  tersubmit:    'text-blue-500',
  diverifikasi: 'text-purple-500',
  diproses:     'text-yellow-500',
  selesai:      'text-green-500',
  ditolak:      'text-red-500',
}

const statusText: Record<ReportStatus, string> = {
  tersubmit:    'Laporan baru masuk',
  diverifikasi: 'Laporan diverifikasi',
  diproses:     'Laporan sedang diproses',
  selesai:      'Laporan diselesaikan',
  ditolak:      'Laporan ditolak',
}

export default function LiveActivityFeed({ reports, isLoading }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-border"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-text">Aktivitas Terbaru</h3>
        <div className="flex items-center gap-1 text-xs text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Live
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-12 animate-pulse bg-gray-100 rounded-xl" />)}
        </div>
      ) : reports.length === 0 ? (
        <p className="text-sm text-muted text-center py-6">Belum ada aktivitas</p>
      ) : (
        <div className="space-y-3">
          {reports.map((r, idx) => {
            const Icon = statusIcon[r.status]
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex gap-3 pb-3 border-b border-gray-100 last:border-0"
              >
                <div className={`w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 ${statusColor[r.status]}`}>
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text truncate">{statusText[r.status]}: {r.judul}</p>
                  <p className="text-xs text-muted">{r.dibuat_pada}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}