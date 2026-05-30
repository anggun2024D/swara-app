'use client'

// import { useState } from 'framer-motion'
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import type { DashboardMetrics } from '@/hooks/useAdminDashboard'

interface Props {
  data: DashboardMetrics['trendMingguIni']
  isLoading: boolean
}

export default function ReportsChart({ data, isLoading }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-border"
    >
      <div className="mb-5">
        <h3 className="font-bold text-text">Trend Laporan</h3>
        <p className="text-xs text-muted">7 hari terakhir</p>
      </div>
      {isLoading ? (
        <div className="h-[280px] animate-pulse bg-gray-100 rounded-xl" />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14422d" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#14422d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Area type="monotone" dataKey="masuk" stroke="#14422d" fill="url(#colorMasuk)" strokeWidth={2} name="Masuk" />
            <Line type="monotone" dataKey="selesai" stroke="#f5c400" strokeWidth={2} dot={{ r: 4 }} name="Selesai" />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  )
}