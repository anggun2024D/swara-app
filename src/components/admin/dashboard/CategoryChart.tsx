'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { motion } from 'framer-motion'
import type { DashboardMetrics } from '@/hooks/useAdminDashboard'

const COLORS = ['#14422d', '#f5c400', '#3b82f6', '#8b5cf6', '#ef4444', '#10b981']

interface Props {
  data: DashboardMetrics['categoryBreakdown']
  isLoading: boolean
}

export default function CategoryChart({ data, isLoading }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-border"
    >
      <h3 className="font-bold text-text mb-4">Laporan per Kategori</h3>
      {isLoading ? (
        <div className="h-[220px] animate-pulse bg-gray-100 rounded-xl" />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} layout="vertical" margin={{ left: 8 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="nama" tick={{ fontSize: 11 }} width={72} />
            <Tooltip />
            <Bar dataKey="total" radius={[0, 6, 6, 0]}>
              {data.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  )
}