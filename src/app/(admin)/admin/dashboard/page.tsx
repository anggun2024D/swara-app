'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { analyticsService } from '@/services/analytics.service'
import type { AdminStats } from '@/types/analytics'

const VERIFICATION_LEVELS: Record<number, { label: string; icon: string; color: string }> = {
  1: { label: 'Terdaftar', icon: '📋', color: '#6B7280' },
  2: { label: 'Komunitas', icon: '✅', color: '#10B981' },
  3: { label: 'Mitra', icon: '🏛️', color: '#3B82F6' },
  4: { label: 'Resmi', icon: '🏆', color: '#F59E0B' },
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await analyticsService.getAdminStats()
        setStats(res.data?.data || null)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (!stats) return <p className="text-gray-400 text-center py-20">Gagal memuat statistik</p>

  const mainStats = [
    { label: 'Total Potensi', value: stats.total_potensi_nasional, icon: '📊', color: '#6366F1' },
    { label: 'Total User', value: stats.total_user, icon: '👤', color: '#10B981' },
    { label: 'Business Owner', value: stats.total_business_owner, icon: '🏭', color: '#F59E0B' },
    { label: 'Investor', value: stats.total_investor, icon: '💰', color: '#EC4899' },
    { label: 'Community Contrib.', value: stats.total_community_contributor, icon: '🏅', color: '#8B5CF6' },
    { label: 'Verifikasi', value: stats.total_verifikasi, icon: '✅', color: '#3B82F6' },
    { label: 'Kolaborasi', value: stats.total_kolaborasi, icon: '🤝', color: '#10B981' },
    { label: 'Kolaborasi Sukses', value: stats.total_kolaborasi_sukses, icon: '🎉', color: '#F59E0B' },
    { label: 'Peluang Aktif', value: stats.total_peluang_aktif, icon: '🎯', color: '#EF4444' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">🛡️ Admin Dashboard — SWARA</h1>
        <p className="text-white/70 mt-1">Moderator Platform — Kelola, Pantau, Bersihkan Spam</p>
        <p className="text-white/50 text-xs mt-2">⚠️ Admin bukan verifikator usaha. Verifikasi dilakukan oleh komunitas.</p>
      </div>

      {/* Investment Value */}
      <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/10 border border-emerald-500/20 rounded-2xl p-6">
        <p className="text-emerald-400 text-sm font-medium">💰 Total Nilai Investasi Potensial</p>
        <p className="text-3xl font-bold text-white mt-1">Rp {(stats.total_investment_value || 0).toLocaleString('id-ID')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 lg:grid-cols-9 gap-3">
        {mainStats.map((stat) => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <span className="text-2xl block mb-1">{stat.icon}</span>
            <p className="text-xl font-bold text-white">{stat.value.toLocaleString()}</p>
            <p className="text-gray-500 text-[10px] mt-0.5 leading-tight">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">📊 Distribusi Kategori</h2>
          <div className="space-y-3">
            {stats.by_category.map((cat) => (
              <div key={cat.name} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                <span className="text-xl">{cat.icon}</span>
                <div className="flex-1"><p className="text-white text-sm font-medium">{cat.name}</p></div>
                <span className="text-white font-bold" style={{ color: cat.color }}>{cat.total}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Resources */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">📋 Potensi Terbaru</h2>
            <Link href="/admin/potensi" className="text-indigo-400 text-sm hover:text-indigo-300">Kelola →</Link>
          </div>
          <div className="space-y-2">
            {stats.recent_resources.map((r) => {
              const lvl = VERIFICATION_LEVELS[r.verification_level] || VERIFICATION_LEVELS[1]
              return (
                <div key={r.id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{r.resource_name}</p>
                    <p className="text-gray-500 text-xs">{r.contributor} • {r.category}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: `${lvl.color}20`, color: lvl.color }}>
                    {lvl.icon} {lvl.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}