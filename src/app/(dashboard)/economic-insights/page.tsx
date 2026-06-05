'use client'

import React, { useEffect, useState } from 'react'
import { analyticsService } from '@/services/analytics.service'
import type { EconomicInsights, GrowthData, CategoryStat, RegionStat } from '@/types/analytics'

export default function EconomicInsightsPage() {
  const [insights, setInsights] = useState<EconomicInsights | null>(null)
  const [growth, setGrowth] = useState<GrowthData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [insightRes, growthRes] = await Promise.all([
          analyticsService.getDashboard(),
          analyticsService.getGrowthChart(),
        ])
        setInsights(insightRes.data?.data || null)
        setGrowth(growthRes.data?.data || null)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (!insights) return <p className="text-gray-400 text-center py-20">Gagal memuat data</p>

  const mainStats = [
    { label: 'Total Potensi',     value: insights.total_resources,           icon: '📊', color: '#6366F1' },
    { label: 'Kontributor',       value: insights.total_contributors,        icon: '👤', color: '#10B981' },
    { label: 'Investor',          value: insights.total_investors,           icon: '💰', color: '#F59E0B' },
    { label: 'Komunitas',         value: insights.total_community,           icon: '👥', color: '#8B5CF6' },
    { label: 'Verifikasi',        value: insights.total_verifications,       icon: '✅', color: '#3B82F6' },
    { label: 'Kolaborasi',        value: insights.total_collaborations,      icon: '🤝', color: '#EC4899' },
    { label: 'Kolaborasi Sukses', value: insights.total_accepted_collabs,    icon: '🎉', color: '#10B981' },
    { label: 'Peluang Aktif',     value: insights.total_active_opportunities, icon: '🎯', color: '#EF4444' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">📈 Economic Intelligence</h1>
        <p className="text-gray-400 text-sm mt-1">Analisis dan visualisasi potensi ekonomi nasional</p>
      </div>

      {/* Investment Banner */}
      <div className="bg-gradient-to-r from-emerald-600/20 via-emerald-500/10 to-teal-600/20 border border-emerald-500/20 rounded-2xl p-6">
        <p className="text-emerald-400 text-sm font-medium">Total Potensi Investasi Nasional</p>
        <p className="text-3xl font-bold text-white mt-1">
          Rp {(insights.total_investment_potential || 0).toLocaleString('id-ID')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {mainStats.map((stat) => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</p>
            <p className="text-gray-500 text-xs mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">📊 Distribusi Kategori</h2>
          <div className="space-y-3">
            {insights.by_category.map((cat: CategoryStat) => (
              <div key={cat.category_id} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300 flex items-center gap-1.5">
                      <span>{cat.icon}</span> {cat.category_name}
                    </span>
                    <span className="text-sm text-gray-400">{cat.count} ({cat.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Regions */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">🗺️ Top Wilayah</h2>
          {insights.by_province.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Belum ada data wilayah</p>
          ) : (
            <div className="space-y-2">
              {insights.by_province.slice(0, 10).map((region: RegionStat, i: number) => (
                <div key={region.province} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    i < 3 ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-400'
                  }`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{region.province}</p>
                    <p className="text-gray-500 text-xs">Skor rata-rata: {region.avg_score}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-semibold">{region.total}</p>
                    <p className="text-gray-500 text-xs">potensi</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Growth Chart (simplified bar representation) */}
      {growth && growth.resources.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">📈 Pertumbuhan Potensi (12 Bulan)</h2>
          <div className="flex items-end gap-1 h-40">
            {growth.resources.map((point, i) => {
              const maxVal = Math.max(...growth.resources.map((p) => p.total), 1)
              const height = (point.total / maxVal) * 100
              return (
                <div key={point.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-400">{point.total}</span>
                  <div
                    className="w-full rounded-t-md bg-indigo-500 hover:bg-indigo-400 transition-all cursor-pointer"
                    style={{ height: `${Math.max(height, 4)}%` }}
                    title={`${point.month}: ${point.total} potensi`}
                  />
                  <span className="text-[10px] text-gray-600">{point.month.slice(5)}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
