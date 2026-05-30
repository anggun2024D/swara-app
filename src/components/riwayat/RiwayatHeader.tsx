// components/riwayat/RiwayatHeader.tsx
'use client'

import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'
import type { Report } from '@/types'

interface Props {
  reports: Report[]
  isLoading: boolean
}

export default function RiwayatHeader({ reports, isLoading }: Props) {
  const stats = [
    {
      label: 'Diproses',
      count: reports.filter(r => r.status === 'diproses').length,
      icon: Clock,
      color: 'text-yellow-300',
    },
    {
      label: 'Selesai',
      count: reports.filter(r => r.status === 'selesai').length,
      icon: CheckCircle,
      color: 'text-green-300',
    },
    {
      label: 'Ditolak',
      count: reports.filter(r => r.status === 'ditolak').length,
      icon: XCircle,
      color: 'text-red-300',
    },
    {
      label: 'Pending',
      count: reports.filter(r => r.status === 'tersubmit' || r.status === 'diverifikasi').length,
      icon: AlertCircle,
      color: 'text-blue-300',
    },
  ]

  return (
    <div className="bg-gradient-to-r from-primary to-primary-mid rounded-2xl p-6 text-white shadow-lg">
      <h1 className="text-2xl font-extrabold">Riwayat Laporan</h1>
      <p className="text-white/70 text-sm mt-1 mb-4">
        Pantau semua laporan yang telah Anda kirimkan
      </p>

      <div className="flex gap-4 flex-wrap">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-28 h-14 rounded-xl bg-white/10 animate-pulse" />
            ))
          : stats.map(stat => (
              <div
                key={stat.label}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2"
              >
                <stat.icon size={16} className={stat.color} />
                <div>
                  <div className="font-bold text-xl">{stat.count}</div>
                  <div className="text-xs text-white/70">{stat.label}</div>
                </div>
              </div>
            ))}
      </div>
    </div>
  )
}