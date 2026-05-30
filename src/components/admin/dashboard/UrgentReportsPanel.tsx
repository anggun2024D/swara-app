'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, MapPin, Clock } from 'lucide-react'
import type { Report } from '@/types'

interface Props {
  reports: Report[]
  isLoading: boolean
}

export default function UrgentReportsPanel({ reports, isLoading }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-red-200 bg-gradient-to-br from-white to-red-50"
    >
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        <h3 className="font-bold text-text">Laporan Urgent</h3>
        <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">
          {reports.length} perlu tindakan
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 animate-pulse bg-red-50 rounded-xl" />)}
        </div>
      ) : reports.length === 0 ? (
        <p className="text-sm text-muted text-center py-6">Tidak ada laporan urgent 🎉</p>
      ) : (
        <div className="space-y-3">
          {reports.map(r => (
            <div key={r.id} className="p-3 bg-white rounded-xl shadow-sm border border-red-100">
              <p className="font-semibold text-text text-sm">{r.judul}</p>
              <div className="flex gap-3 mt-1 text-xs text-muted items-center">
                <MapPin size={11} /> {r.lokasi.address}
              </div>
              <div className="flex gap-3 mt-1 text-xs text-muted items-center">
                <Clock size={11} /> {r.dibuat_pada}
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-red-600 font-semibold capitalize">{r.priority}</span>
                <span className="text-xs text-muted capitalize">{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}