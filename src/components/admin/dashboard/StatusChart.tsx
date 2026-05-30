'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { motion } from 'framer-motion'
import type { DashboardMetrics } from '@/hooks/useAdminDashboard'

const STATUS_COLORS: Record<string, string> = {
  tersubmit:    '#3b82f6',
  diverifikasi: '#8b5cf6',
  diproses:     '#f5c400',
  selesai:      '#22c55e',
  ditolak:      '#ef4444',
}

const STATUS_LABEL: Record<string, string> = {
  tersubmit:    'Tersubmit',
  diverifikasi: 'Diverifikasi',
  diproses:     'Diproses',
  selesai:      'Selesai',
  ditolak:      'Ditolak',
}

interface Props {
  data: DashboardMetrics['statusBreakdown']
  isLoading: boolean
}

export default function StatusChart({ data, isLoading }: Props) {
  const chartData = data
    .filter(d => d.total > 0)
    .map(d => ({ name: STATUS_LABEL[d.status], value: d.total, color: STATUS_COLORS[d.status] }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-border"
    >
      <h3 className="font-bold text-text mb-4">Status Laporan</h3>
      {isLoading ? (
        <div className="h-[200px] animate-pulse bg-gray-100 rounded-xl" />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={chartData} cx="50%" cy="42%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value"
              label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  )
}