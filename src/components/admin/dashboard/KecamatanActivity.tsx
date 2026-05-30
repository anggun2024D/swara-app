'use client'

import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import type { DashboardMetrics } from '@/hooks/useAdminDashboard'

interface Props {
  data: DashboardMetrics['kecamatanBreakdown']
  isLoading: boolean
}

export default function KecamatanActivity({ data, isLoading }: Props) {
  const max = data[0]?.total ?? 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-border"
    >
      <h3 className="font-bold text-text mb-3">Kecamatan Aktif</h3>
      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <div key={i} className="h-8 animate-pulse bg-gray-100 rounded-lg" />)}
        </div>
      ) : data.length === 0 ? (
        <p className="text-sm text-muted text-center py-4">Belum ada data</p>
      ) : (
        <div className="space-y-3">
          {data.map(k => (
            <div key={k.nama}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium">{k.nama}</span>
                <span>{k.total} laporan</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${(k.total / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 pt-3 border-t border-border flex justify-between text-xs text-muted">
        <span>{data.length} kecamatan tercatat</span>
        <TrendingUp size={14} className="text-green-500" />
      </div>
    </motion.div>
  )
}