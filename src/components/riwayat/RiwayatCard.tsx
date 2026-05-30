'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MapPin, Calendar, ChevronRight } from 'lucide-react'
import { timeAgo, formatDate } from '@/utils/date'
import { id } from 'date-fns/locale'
import type { Report } from '@/types'

// Format "10 Mei 2025 14:30" dari backend → relative time
function parseBackendDate(str: string): Date {
  // Coba parse sebagai ISO dulu (fallback)
  const iso = Date.parse(str)
  if (!isNaN(iso)) return new Date(iso)

  // Parse format Indonesia: "10 Mei 2025 14:30"
  const bulanMap: Record<string, string> = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04',
    Mei: '05', Jun: '06', Jul: '07', Agu: '08',
    Sep: '09', Okt: '10', Nov: '11', Des: '12',
  }
  const match = str.match(/(\d{1,2})\s+(\w+)\s+(\d{4})(?:\s+(\d{2}:\d{2}))?/)
  if (match) {
    const [, day, bulan, year, time] = match
    const month = bulanMap[bulan] ?? '01'
    return new Date(`${year}-${month}-${day.padStart(2, '0')}T${time ?? '00:00'}:00`)
  }
  return new Date() // fallback ke sekarang daripada crash
}

const statusConfig: Record<string, { label: string; color: string }> = {
  tersubmit:    { label: 'Tersubmit',    color: 'bg-blue-100 text-blue-700' },
  diverifikasi: { label: 'Diverifikasi', color: 'bg-indigo-100 text-indigo-700' },
  diproses:     { label: 'Diproses',     color: 'bg-amber-100 text-amber-700' },
  selesai:      { label: 'Selesai',      color: 'bg-green-100 text-green-700' },
  ditolak:      { label: 'Ditolak',      color: 'bg-red-100 text-red-700' },
}

export default function RiwayatCard({ report }: { report: Report }) {
  const status = statusConfig[report.status] ?? { label: report.status, color: 'bg-gray-100 text-gray-600' }
  const date   = formatDate(report.dibuat_pada) 
  const relativeTime = timeAgo(report.dibuat_pada)
  const address = report.lokasi?.address ?? '-'

  return (
    <Link href={`/riwayat/${report.id}`}>
      <motion.div
        whileHover={{ x: 4 }}
        className="
          flex items-start gap-4 p-4
          bg-white rounded-2xl border border-border
          shadow-sm hover:shadow-md
          transition-all duration-200
        "
      >
        {/* Foto thumbnail */}
        {report.foto?.[0]?.url ? (
          <img
            src={report.foto[0].url}
            alt={report.judul}
            className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <MapPin size={20} className="text-primary" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status.color}`}>
              {status.label}
            </span>
            {report.is_urgent && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">
                Urgent
              </span>
            )}
            <span className="text-[10px] text-muted bg-gray-100 px-2 py-0.5 rounded-full">
              {report.category?.nama ?? '-'}
            </span>
          </div>

          <h3 className="font-semibold text-text text-sm truncate">{report.judul}</h3>

          <div className="flex items-center gap-3 text-xs text-muted mt-1 flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin size={12} /> {address}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {relativeTime}
            </span>
          </div>
        </div>

        <ChevronRight size={18} className="text-muted self-center flex-shrink-0" />
      </motion.div>
    </Link>
  )
}