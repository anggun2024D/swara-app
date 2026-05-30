'use client'

import { motion } from 'framer-motion'
import { FileText, CheckCircle, Clock, AlertTriangle, Gauge, MapPin } from 'lucide-react'
import CountUp from 'react-countup'
import type { DashboardMetrics } from '@/hooks/useAdminDashboard'

interface Props {
  metrics: DashboardMetrics | null
  isLoading: boolean
}

export default function AnalyticsCards({ metrics, isLoading }: Props) {
  const cards = [
    { label: 'Total Laporan',   value: metrics?.total ?? 0,        icon: FileText,      color: 'text-primary' },
    { label: 'Diproses',        value: metrics?.diproses ?? 0,     icon: Clock,         color: 'text-yellow-500' },
    { label: 'Selesai',         value: metrics?.selesai ?? 0,      icon: CheckCircle,   color: 'text-green-500' },
    { label: 'Urgent',          value: metrics?.urgent ?? 0,       icon: AlertTriangle, color: 'text-red-500' },
    { label: 'Tersubmit',       value: metrics?.tersubmit ?? 0,    icon: Gauge,         color: 'text-blue-500' },
    { label: 'Kecamatan Aktif', value: metrics?.kecamatanBreakdown.length ?? 0, icon: MapPin, color: 'text-purple-500' },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-3xl p-5 h-[130px] animate-pulse border border-border" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, idx) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          whileHover={{ y: -2 }}
          className="bg-white rounded-3xl p-5 shadow-sm border border-border hover:shadow-md transition-all min-h-[130px]"
        >
          <div className="mb-2">
            <card.icon className={`w-5 h-5 ${card.color}`} />
          </div>
          <p className="text-2xl font-bold text-text">
            <CountUp end={card.value} duration={1} />
          </p>
          <p className="text-xs text-muted mt-1">{card.label}</p>
        </motion.div>
      ))}
    </div>
  )
}