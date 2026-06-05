'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Users, Share2, TrendingUp, ArrowUpRight } from 'lucide-react'

interface PublicStats {
  total_potensi: number
  total_pengguna: number
  total_terverifikasi: number
  total_kolaborasi: number
  by_category: { id: number; name: string; slug: string; icon: string; color: string; total: number }[]
}

const BAR_COLORS = ['bg-amber-500', 'bg-emerald-500', 'bg-blue-500', 'bg-purple-500']

export default function AnalyticsSection() {
  const [stats, setStats] = useState<PublicStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats`)
      .then(r => r.json())
      .then(json => { if (json.success) setStats(json.data) })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const totalAll = stats?.by_category?.reduce((s, c) => s + c.total, 0) || 1

  const metrics = [
    { label: 'Total Potensi', value: stats?.total_potensi?.toLocaleString('id-ID') ?? '–', icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pengguna Aktif', value: stats?.total_pengguna?.toLocaleString('id-ID') ?? '–', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Terverifikasi', value: stats?.total_terverifikasi?.toLocaleString('id-ID') ?? '–', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Kolaborasi', value: stats?.total_kolaborasi?.toLocaleString('id-ID') ?? '–', icon: Share2, color: 'text-primary', bg: 'bg-emerald-50' },
  ]

  return (
    <section id="analytics" className="py-8 bg-[#f5f7f9]">
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
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">Economic Intelligence</p>
            <h2 className="section-title">Data Ekonomi<br />Real-Time</h2>
          </div>
          <p className="section-subtitle mt-0 text-left md:max-w-sm">
            Statistik potensi ekonomi Indonesia yang diverifikasi oleh komunitas secara transparan
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
                      live
                    </div>
                  </div>
                  <p className="text-3xl font-extrabold text-gray-900 leading-none">{metric.value}</p>
                  <p className="text-sm text-gray-500 mt-1.5">{metric.label}</p>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Bar chart — Potensi per Kategori */}
          <div className="lg:col-span-3 card-premium p-7">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-gray-900">Potensi per Sektor</h3>
              <span className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">4 Sektor</span>
            </div>
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i}>
                    <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
                    <div className="h-2.5 bg-gray-50 rounded-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-5">
                {stats?.by_category?.map((cat, i) => {
                  const pct = Math.round((cat.total / totalAll) * 100)
                  return (
                    <div key={cat.slug || cat.name}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-gray-900 flex items-center gap-2">
                          <span>{cat.icon}</span> {cat.name}
                        </span>
                        <span className="text-gray-500">{cat.total} potensi ({pct}%)</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          transition={{ duration: 1, delay: i * 0.15, ease: 'easeOut' }}
                          viewport={{ once: true }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Donut chart — Verifikasi */}
          <div className="lg:col-span-2 card-premium p-7 flex flex-col items-center justify-center">
            <h3 className="font-bold text-lg text-gray-900 mb-6 self-start">Level Verifikasi</h3>
            {isLoading ? (
              <div className="w-44 h-44 rounded-full bg-gray-100 animate-pulse" />
            ) : (
              <>
                <div className="relative w-44 h-44">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="45" fill="transparent" stroke="#f3f4f6" strokeWidth="12" />
                    <circle
                      cx="50" cy="50" r="45" fill="transparent" stroke="#10B981" strokeWidth="12"
                      strokeDasharray={`${((stats?.total_terverifikasi ?? 0) / (stats?.total_potensi || 1)) * 283} 283`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-3xl font-extrabold text-gray-900">{stats?.total_terverifikasi ?? 0}</p>
                    <p className="text-xs text-gray-500 font-medium">Terverifikasi</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2.5 mt-6 self-start w-full">
                  {[
                    { label: 'Terverifikasi Komunitas', color: 'bg-emerald-500', value: stats?.total_terverifikasi ?? 0 },
                    { label: 'Terdaftar (belum verifikasi)', color: 'bg-gray-200', value: (stats?.total_potensi ?? 0) - (stats?.total_terverifikasi ?? 0) },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="text-gray-500">{item.label}</span>
                      </div>
                      <span className="font-semibold text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}