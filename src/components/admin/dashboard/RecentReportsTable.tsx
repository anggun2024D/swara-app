'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Eye } from 'lucide-react'
import type { Report, ReportStatus } from '@/types'

interface Props {
  reports: Report[]
  isLoading: boolean
}

const statusColors: Record<ReportStatus, string> = {
  tersubmit:    'bg-blue-100 text-blue-700',
  diverifikasi: 'bg-purple-100 text-purple-700',
  diproses:     'bg-yellow-100 text-yellow-700',
  selesai:      'bg-green-100 text-green-700',
  ditolak:      'bg-red-100 text-red-700',
}

const statusLabel: Record<ReportStatus, string> = {
  tersubmit:    'Tersubmit',
  diverifikasi: 'Diverifikasi',
  diproses:     'Diproses',
  selesai:      'Selesai',
  ditolak:      'Ditolak',
}

export default function RecentReportsTable({ reports, isLoading }: Props) {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden"
    >
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h3 className="font-bold text-text">Laporan Terbaru</h3>
        <button
          onClick={() => router.push('/admin/reports')}
          className="text-xs text-primary hover:underline"
        >
          Lihat Semua →
        </button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center animate-pulse text-muted">Memuat data...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-muted">
              <tr>
                <th className="px-4 py-3 text-left">Judul</th>
                <th className="px-4 py-3 text-left">Pelapor</th>
                <th className="px-4 py-3 text-left">Kategori</th>
                <th className="px-4 py-3 text-left">Lokasi</th>
                <th className="px-4 py-3 text-left">Prioritas</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium max-w-[160px] truncate">{r.judul}</td>
                  <td className="px-4 py-3">{r.pelapor.nama}</td>
                  <td className="px-4 py-3">{r.category.nama}</td>
                  <td className="px-4 py-3 text-muted max-w-[140px] truncate">{r.lokasi.address}</td>
                  <td className="px-4 py-3">
                    {r.priority
                      ? <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 capitalize">{r.priority}</span>
                      : <span className="text-muted text-xs">—</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[r.status]}`}>
                      {statusLabel[r.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted text-xs">{r.dibuat_pada}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  )
}