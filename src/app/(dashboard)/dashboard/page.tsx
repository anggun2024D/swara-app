'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { resourcesService } from '@/services/resources.service'
import { collaborationService } from '@/services/collaboration.service'

export default function DashboardPage() {
  const { user } = useAuth()
  const [recentResources, setRecentResources] = useState<any[]>([])
  const [recentCollabs, setRecentCollabs] = useState<any[]>([])
  const [myStats, setMyStats] = useState({ resources: 0, verified: 0, views: 0, collabs: 0, score: 0 })
  const [loading, setLoading] = useState(true)

  // Determine dynamic statuses
  const isBusinessOwner = (user as any)?.is_business_owner || recentResources.length > 0
  const isInvestor = (user as any)?.is_investor || false
  const isCommunityContributor = (user as any)?.is_community_contributor || false
  const badges = (user as any)?.badges || []

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resData, collabData] = await Promise.all([
          resourcesService.getMine({ per_halaman: 5 } as any),
          collaborationService.getAll(),
        ])
        const resources = resData.data?.data?.resources || []
        const collabs = collabData.data?.data?.collaborations || []
        setRecentResources(resources.slice(0, 5))
        setRecentCollabs(collabs.slice(0, 5))
        setMyStats({
          resources: resData.data?.data?.pagination?.total || resources.length,
          verified: resources.filter((r: any) => r.community_verified).length,
          views: resources.reduce((s: number, r: any) => s + (r.view_count || 0), 0),
          collabs: collabs.length,
          score: resources.reduce((s: number, r: any) => s + (r.verification_score || 0), 0),
        })
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

  return (
    <div className="space-y-6">
      {/* Welcome Card + Status Badges */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Selamat Datang, {user?.name} 🌟</h1>
            <p className="text-indigo-100 mt-1">SWARA — Memetakan Potensi, Menghubungkan Peluang</p>
          </div>
          {/* Active Status Badges */}
          <div className="flex gap-2">
            {isBusinessOwner && (
              <span className="px-3 py-1.5 bg-amber-500/30 border border-amber-400/40 text-amber-100 rounded-full text-xs font-medium">🏭 Business Owner</span>
            )}
            {isInvestor && (
              <span className="px-3 py-1.5 bg-emerald-500/30 border border-emerald-400/40 text-emerald-100 rounded-full text-xs font-medium">💰 Investor</span>
            )}
            {isCommunityContributor && (
              <span className="px-3 py-1.5 bg-blue-500/30 border border-blue-400/40 text-blue-100 rounded-full text-xs font-medium">🏅 Community Contributor</span>
            )}
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <Link href="/potensi/baru" className="px-4 py-2 bg-white text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors">
            + Tambah Potensi
          </Link>
          <Link href="/economic-map" className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/30 transition-colors">
            🗺️ Lihat Peta
          </Link>
          {!isInvestor && (
            <Link href="/profil" className="px-4 py-2 bg-white/10 text-white/80 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors">
              💰 Aktifkan Profil Investor
            </Link>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Potensi Saya', value: myStats.resources, icon: '📊', color: '#6366F1', href: '/potensi' },
          { label: 'Terverifikasi', value: myStats.verified, icon: '✅', color: '#10B981', href: '/potensi' },
          { label: 'Total Dilihat', value: myStats.views, icon: '👀', color: '#3B82F6', href: '#' },
          { label: 'Kolaborasi', value: myStats.collabs, icon: '🤝', color: '#8B5CF6', href: '/kolaborasi' },
          { label: 'Total Dukungan', value: myStats.score, icon: '💪', color: '#EC4899', href: '#' },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition-all group">
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            <p className="text-gray-500 text-xs">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* ═══ DYNAMIC WIDGETS ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Business Owner Widget ── */}
        {isBusinessOwner && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">🏭 Usaha Saya</h2>
              <Link href="/potensi" className="text-indigo-400 text-sm hover:text-indigo-300">Lihat semua →</Link>
            </div>
            {recentResources.length === 0 ? (
              <p className="text-gray-500 text-center py-6">Belum ada potensi</p>
            ) : (
              <div className="space-y-3">
                {recentResources.map((r: any) => (
                  <Link key={r.id} href={`/resources/${r.id}`} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-all">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: `${r.category?.color || '#6366F1'}20` }}>
                      {r.category?.icon || '📋'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{r.resource_name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs" style={{ color: r.verification_color || '#6B7280' }}>
                          {r.verification_icon || '📋'} {r.verification_label || 'Terdaftar'}
                        </span>
                        <span className="text-gray-500 text-xs">• 👀 {r.view_count}</span>
                      </div>
                    </div>
                    {r.opportunity_status !== 'aktif' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-400">{r.opportunity_status?.replace('mencari_', '🔍 ')}</span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Investor Widget ── */}
        {isInvestor && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">💰 Peluang Investasi</h2>
              <Link href="/opportunities" className="text-indigo-400 text-sm hover:text-indigo-300">Lihat semua →</Link>
            </div>
            <div className="space-y-3">
              <Link href="/opportunities?status=mencari_investor" className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl hover:bg-amber-500/20 transition-all">
                <span className="text-2xl">💰</span>
                <div>
                  <p className="text-white text-sm font-medium">Mencari Investor</p>
                  <p className="text-gray-400 text-xs">Lihat usaha yang membutuhkan pendanaan</p>
                </div>
              </Link>
              <Link href="/peluang-tersimpan" className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-all">
                <span className="text-2xl">💾</span>
                <div>
                  <p className="text-white text-sm font-medium">Potensi Favorit</p>
                  <p className="text-gray-400 text-xs">Peluang yang sudah Anda simpan</p>
                </div>
              </Link>
              <Link href="/economic-insights" className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-all">
                <span className="text-2xl">📈</span>
                <div>
                  <p className="text-white text-sm font-medium">Analisis Investasi</p>
                  <p className="text-gray-400 text-xs">Data ekonomi dan tren wilayah</p>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* ── Kolaborasi Terbaru (always visible) ── */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">🤝 Kolaborasi Terbaru</h2>
            <Link href="/kolaborasi" className="text-indigo-400 text-sm hover:text-indigo-300">Lihat semua →</Link>
          </div>
          {recentCollabs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-2">🤝</p>
              <p className="text-gray-500 text-sm">Belum ada kolaborasi</p>
              <Link href="/opportunities" className="mt-2 inline-block text-indigo-400 text-sm hover:text-indigo-300">Jelajahi peluang →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentCollabs.map((c: any) => (
                <Link key={c.id} href="/kolaborasi" className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-all">
                  <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-lg">🤝</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{c.resource?.resource_name}</p>
                    <p className="text-gray-500 text-xs capitalize">{c.type} • {c.initiator?.nama || c.target?.nama}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    c.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' :
                    c.status === 'pending'  ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>{c.status}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ── Rekomendasi (jika belum punya usaha) ── */}
        {!isBusinessOwner && (
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">✨ Mulai Berkontribusi</h2>
            <p className="text-gray-400 text-sm mb-4">Daftarkan potensi ekonomi di wilayah Anda untuk menjadi Business Owner</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '🏭', label: 'UMKM', desc: 'Industri Kreatif', color: '#F59E0B' },
                { icon: '🌾', label: 'Pertanian', desc: 'Pangan', color: '#10B981' },
                { icon: '🐟', label: 'Perikanan', desc: 'Peternakan', color: '#3B82F6' },
                { icon: '🏝️', label: 'Pariwisata', desc: 'Budaya Lokal', color: '#8B5CF6' },
              ].map((cat) => (
                <Link key={cat.label} href="/potensi/baru" className="p-3 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-gray-600 transition-all text-center">
                  <span className="text-2xl">{cat.icon}</span>
                  <p className="text-white text-sm font-medium mt-1">{cat.label}</p>
                  <p className="text-gray-500 text-xs">{cat.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}