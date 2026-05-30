'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Clock, CheckCircle } from 'lucide-react'

interface StatsData {
  total: number
  selesai: number
  diproses: number
  tersubmit: number
  ditolak: number
  completion_rate: number
  category_breakdown: { name: string; count: number; percentage: number }[]
}

const BAR_COLORS = [
  'bg-primary', 'bg-gold', 'bg-blue-500', 'bg-emerald-500', 'bg-red-500'
]

const C = 2 * Math.PI * 45 // ~282.7

export default function AnalyticsSection() {
  const [stats, setStats]       = useState<StatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats`)
      .then(r => r.json())
      .then(json => { if (json.success) setStats(json.data) })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const diprosesPct = stats
    ? Math.round((stats.diproses / (stats.total || 1)) * 100)
    : 0

  const metrics = [
    { label: 'Total Laporan',       value: stats?.total.toLocaleString('id-ID') ?? '–',    icon: BarChart3 },
    { label: 'Laporan Selesai',     value: stats?.selesai.toLocaleString('id-ID') ?? '–',  icon: CheckCircle },
    { label: 'Sedang Diproses',     value: stats?.diproses.toLocaleString('id-ID') ?? '–', icon: Clock },
    { label: 'Tingkat Penyelesaian',value: stats ? `${stats.completion_rate}%` : '–',      icon: TrendingUp },
  ]

  return (
    <section id="analytics" className="py-20 bg-white">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Smart Analytics</h2>
          <p className="section-subtitle mt-4">Pantau kinerja penanganan laporan secara real-time</p>
        </motion.div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {metrics.map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="card-premium p-5"
            >
              {isLoading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-5 w-5 bg-gray-200 rounded" />
                  <div className="h-8 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                </div>
              ) : (
                <>
                  <div className="mb-3">
                    <metric.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-3xl font-extrabold text-text">{metric.value}</p>
                  <p className="text-sm text-muted mt-1">{metric.label}</p>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Bar — kategori */}
          <div className="card-premium p-6">
            <h3 className="font-bold text-lg mb-4">Laporan per Kategori</h3>
            {isLoading ? (
              <div className="space-y-3 animate-pulse">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i}>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                    <div className="h-2 bg-gray-100 rounded-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {stats?.category_breakdown.map((cat, i) => (
                  <div key={cat.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{cat.name}</span>
                      <span className="font-semibold text-muted">
                        {cat.count} ({cat.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${cat.percentage}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className={`h-full ${BAR_COLORS[i] ?? 'bg-gray-400'} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Donut — status */}
          <div className="card-premium p-6 flex flex-col items-center justify-center">
            <h3 className="font-bold text-lg mb-4">Distribusi Status</h3>
            {isLoading ? (
              <div className="w-48 h-48 rounded-full bg-gray-100 animate-pulse" />
            ) : (
              <>
                <div className="relative w-48 h-48">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="45" fill="transparent" stroke="#f3f4f6" strokeWidth="10" />
                    <circle
                      cx="50" cy="50" r="45" fill="transparent" stroke="#22c55e" strokeWidth="10"
                      strokeDasharray={`${((stats?.completion_rate ?? 0) / 100) * C} ${C}`}
                      strokeDashoffset="0"
                    />
                    <circle
                      cx="50" cy="50" r="45" fill="transparent" stroke="#f5c400" strokeWidth="10"
                      strokeDasharray={`${(diprosesPct / 100) * C} ${C}`}
                      strokeDashoffset={`${-((stats?.completion_rate ?? 0) / 100) * C}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-2xl font-extrabold">{stats?.selesai ?? 0}</p>
                    <p className="text-xs text-muted">Selesai</p>
                  </div>
                </div>
                <div className="flex gap-4 mt-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    Selesai ({stats?.completion_rate ?? 0}%)
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-gold" />
                    Diproses ({diprosesPct}%)
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}