'use client'

import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import type { Report, ReportStatus, ReportPriority } from '@/types'

interface ReportsTableProps {
  reports: Report[]
  isLoading: boolean
  onViewDetail: (report: Report) => void
}

const statusColors: Record<ReportStatus, string> = {
  tersubmit:    'bg-gray-100 text-gray-700',
  diverifikasi: 'bg-blue-100 text-blue-700',
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
 
const priorityColors: Record<string, string> = {
  rendah: 'bg-gray-100 text-gray-600',
  sedang: 'bg-blue-100 text-blue-600',
  tinggi: 'bg-orange-100 text-orange-600',
  urgent: 'bg-red-100 text-red-600',
}

export default function ReportsTable({ reports, isLoading, onViewDetail }: ReportsTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-muted animate-pulse">
        Memuat laporan...
      </div>
    )
  }

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center text-muted">
        Tidak ada laporan
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left">Judul</th>
              <th className="px-4 py-3 text-left">Pelapor</th>
              <th className="px-4 py-3 text-left">Kategori</th>
              <th className="px-4 py-3 text-left">Lokasi</th>
              <th className="px-4 py-3 text-left">Prioritas</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Tanggal</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, idx) => (
              <motion.tr
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-4 py-3 font-medium max-w-[180px] truncate">
                  {report.judul}
                </td>
                <td className="px-4 py-3">{report.pelapor.nama}</td>
                <td className="px-4 py-3">{report.category.nama}</td>
                <td className="px-4 py-3 text-muted max-w-[140px] truncate">
                  {report.lokasi.address}
                </td>
                <td className="px-4 py-3">
                  {report.priority ? (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityColors[report.priority]}`}>
                      {report.priority}
                    </span>
                  ) : (
                    <span className="text-muted text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[report.status]}`}>
                    {statusLabel[report.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted text-xs">{report.dibuat_pada}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onViewDetail(report)}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <Eye size={16} className="text-primary" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}