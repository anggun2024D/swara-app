'use client'

import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import { useAdminDashboard } from '@/hooks/useAdminDashboard'

const CATEGORY_COLORS = ['#14422d', '#f5c400', '#3b82f6', '#8b5cf6', '#ef4444', '#10b981']

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

function SkeletonCard() {
  return <div className="bg-white rounded-2xl p-5 shadow-sm h-[380px] animate-pulse border border-border" />
}

export default function AnalyticsPage() {
  const { metrics, isLoading } = useAdminDashboard()

  const categoryData = metrics?.categoryBreakdown ?? []
  const statusData = (metrics?.statusBreakdown ?? [])
    .filter(d => d.total > 0)
    .map(d => ({
      name:  STATUS_LABEL[d.status],
      value: d.total,
      color: STATUS_COLORS[d.status],
    }))
  const trendData  = metrics?.trendMingguIni ?? []
  const kecamatan  = metrics?.kecamatanBreakdown ?? []
  const maxLaporan = kecamatan[0]?.total ?? 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Analytics & Statistik</h1>
          <p className="text-sm text-muted mt-0.5">Data dihitung dari seluruh laporan</p>
        </div>
        <button className="px-4 py-2 border border-border rounded-xl flex items-center gap-2 text-sm hover:bg-gray-50">
          <Download size={16} /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Trend 7 Hari */}
        {isLoading ? <SkeletonCard /> : (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-border"
          >
            <h3 className="font-bold mb-1">Trend Laporan</h3>
            <p className="text-xs text-muted mb-4">7 hari terakhir</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Line type="monotone" dataKey="masuk"   stroke="#14422d" strokeWidth={2} name="Masuk" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="selesai" stroke="#f5c400" strokeWidth={2} name="Selesai" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Kategori Dominan */}
        {isLoading ? <SkeletonCard /> : (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-border"
          >
            <h3 className="font-bold mb-1">Kategori Dominan</h3>
            <p className="text-xs text-muted mb-4">{categoryData.length} kategori aktif</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="nama" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" name="Laporan" radius={[8, 8, 0, 0]}>
                  {categoryData.map((_, idx) => (
                    <Cell key={idx} fill={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Status Laporan */}
        {isLoading ? <SkeletonCard /> : (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-border"
          >
            <h3 className="font-bold mb-1">Distribusi Status</h3>
            <p className="text-xs text-muted mb-4">Total {metrics?.total ?? 0} laporan</p>
            {statusData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted text-sm">
                Belum ada data
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={100}
                    paddingAngle={2} dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {statusData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        )}

      </div>
    </div>
  )
}