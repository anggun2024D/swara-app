'use client'
 
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Clock, CheckCircle, ArrowUpRight } from 'lucide-react'
 
// ✅ INTERFACE TIDAK BERUBAH
interface StatsData {
  total: number
  selesai: number
  diproses: number
  tersubmit: number
  ditolak: number
  completion_rate: number
  category_breakdown: { name: string; count: number; percentage: number }[]
}
 
const BAR_COLORS = ['bg-primary', 'bg-gold', 'bg-blue-500', 'bg-emerald-500', 'bg-red-500']
const C = 2 * Math.PI * 45
 
export default function AnalyticsSection() {
  // ✅ STATE & FETCH TIDAK BERUBAH
  const [stats, setStats] = useState<StatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
 
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats`)
      .then(r => r.json())
      .then(json => { if (json.success) setStats(json.data) })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])
 
  const diprosesPct = stats ? Math.round((stats.diproses / (stats.total || 1)) * 100) : 0
 
  const metrics = [
    { label: 'Total Laporan', value: stats?.total.toLocaleString('id-ID') ?? '–', icon: BarChart3, change: '+12%', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Laporan Selesai', value: stats?.selesai.toLocaleString('id-ID') ?? '–', icon: CheckCircle, change: '+8%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Sedang Diproses', value: stats?.diproses.toLocaleString('id-ID') ?? '–', icon: Clock, change: 'aktif', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Tingkat Penyelesaian', value: stats ? `${stats.completion_rate}%` : '–', icon: TrendingUp, change: '+5%', color: 'text-primary', bg: 'bg-primary-light' },
  ]
 
  return (
    <section id="analytics" className="py-24 bg-bg">
      {/* Curved top */}
      <div className="-mt-1">
        <svg viewBox="0 0 1440 80" fill="none" className="w-full" preserveAspectRatio="none">
          <path d="M0,0 C480,80 960,80 1440,0 L1440,80 L0,80 Z" fill="#f5f7f9"/>
        </svg>
      </div>
 
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4"
        >
          <div>
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">Smart Analytics</p>
            <h2 className="section-title">Kinerja Penanganan<br />Laporan Real-Time</h2>
          </div>
          <p className="section-subtitle mt-0 text-left md:max-w-sm">
            Data diperbarui setiap hari untuk memastikan transparansi layanan publik
          </p>
        </motion.div>
 
        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {metrics.map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="card-premium p-5 group cursor-default"
            >
              {isLoading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-10 w-10 bg-gray-100 rounded-xl" />
                  <div className="h-8 bg-gray-100 rounded w-2/3" />
                  <div className="h-3 bg-gray-50 rounded w-3/4" />
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 ${metric.bg} rounded-xl flex items-center justify-center`}>
                      <metric.icon className={`w-5 h-5 ${metric.color}`} />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-semibold ${metric.color}`}>
                      <ArrowUpRight size={12} />
                      {metric.change}
                    </div>
                  </div>
                  <p className="text-3xl font-extrabold text-text leading-none">{metric.value}</p>
                  <p className="text-sm text-muted mt-1.5">{metric.label}</p>
                </>
              )}
            </motion.div>
          ))}
        </div>
 
        {/* Charts */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Bar chart — full width on mobile, 3 cols on desktop */}
          <div className="lg:col-span-3 card-premium p-7">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-text">Laporan per Kategori</h3>
              <span className="text-xs text-muted bg-gray-50 px-3 py-1 rounded-full">Top Kategori</span>
            </div>
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i}>
                    <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
                    <div className="h-2.5 bg-gray-50 rounded-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {stats?.category_breakdown.map((cat, i) => (
                  <div key={cat.name}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-text">{cat.name}</span>
                      <span className="text-muted">{cat.count} laporan ({cat.percentage}%)</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${cat.percentage}%` }}
                        transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                        viewport={{ once: true }}
                        className={`h-full ${BAR_COLORS[i] ?? 'bg-gray-400'} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
 
          {/* Donut chart */}
          <div className="lg:col-span-2 card-premium p-7 flex flex-col items-center justify-center">
            <h3 className="font-bold text-lg text-text mb-6 self-start">Distribusi Status</h3>
            {isLoading ? (
              <div className="w-44 h-44 rounded-full bg-gray-100 animate-pulse" />
            ) : (
              <>
                <div className="relative w-44 h-44">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="45" fill="transparent" stroke="#f3f4f6" strokeWidth="12" />
                    <circle
                      cx="50" cy="50" r="45" fill="transparent" stroke="#14422d" strokeWidth="12"
                      strokeDasharray={`${((stats?.completion_rate ?? 0) / 100) * C} ${C}`}
                      strokeLinecap="round"
                    />
                    <circle
                      cx="50" cy="50" r="45" fill="transparent" stroke="#f5c400" strokeWidth="12"
                      strokeDasharray={`${(diprosesPct / 100) * C} ${C}`}
                      strokeDashoffset={`${-((stats?.completion_rate ?? 0) / 100) * C}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-3xl font-extrabold text-text">{stats?.selesai ?? 0}</p>
                    <p className="text-xs text-muted font-medium">Selesai</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2.5 mt-6 self-start w-full">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="text-muted">Selesai</span>
                    </div>
                    <span className="font-semibold text-text">{stats?.completion_rate ?? 0}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gold" />
                      <span className="text-muted">Diproses</span>
                    </div>
                    <span className="font-semibold text-text">{diprosesPct}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-200" />
                      <span className="text-muted">Lainnya</span>
                    </div>
                    <span className="font-semibold text-text">{100 - (stats?.completion_rate ?? 0) - diprosesPct}%</span>
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