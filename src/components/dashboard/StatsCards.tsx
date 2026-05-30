'use client'

import { motion } from 'framer-motion'
import { FileText, CheckCircle, Clock } from 'lucide-react'
import { UserDashboardData } from '@/hooks/useUserDashboard'

interface Props {
  data: UserDashboardData | null
  isLoading: boolean
}

function Skeleton() {
  return (
    <div className="card p-5 flex items-center gap-4 animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-gray-100" />
      <div className="space-y-2">
        <div className="h-3 w-24 bg-gray-100 rounded" />
        <div className="h-7 w-14 bg-gray-100 rounded" />
      </div>
    </div>
  )
}

export default function StatsCards({ data, isLoading }: Props) {
  const stats = [
    {
      label: 'Laporan Saya',
      value: data?.totalLaporan ?? 0,
      icon: FileText,
      color: 'blue',
    },
    {
      label: 'Selesai',
      value: data?.selesai ?? 0,
      icon: CheckCircle,
      color: 'green',
    },
    {
      label: 'Diproses',
      value: data?.diproses ?? 0,
      icon: Clock,
      color: 'orange',
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[0, 1, 2].map(i => <Skeleton key={i} />)}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="card p-5 flex items-center gap-4"
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              stat.color === 'blue'   ? 'bg-blue-50 text-blue-600'     :
              stat.color === 'green'  ? 'bg-green-50 text-green-600'   :
                                        'bg-orange-50 text-orange-600'
            }`}
          >
            <stat.icon size={24} />
          </div>
          <div>
            <p className="text-xs text-muted font-medium">{stat.label}</p>
            <p className="text-2xl font-extrabold text-text">
              {stat.value.toLocaleString('id-ID')}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}