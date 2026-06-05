'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useResourceById } from '@/hooks/useEconomicResources'
import { useRecommendations } from '@/hooks/useRecommendations'
import { verificationService } from '@/services/verification.service'
import type { VerificationType } from '@/types/resource'

const STATUS_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  aktif:               { label: 'Aktif',              icon: '✅', color: '#10B981' },
  mencari_investor:    { label: 'Mencari Investor',   icon: '💰', color: '#F59E0B' },
  mencari_distributor: { label: 'Mencari Distributor', icon: '🚚', color: '#3B82F6' },
  mencari_supplier:    { label: 'Mencari Supplier',   icon: '📦', color: '#8B5CF6' },
  mencari_mitra:       { label: 'Mencari Mitra',      icon: '🤝', color: '#EC4899' },
  ekspansi:            { label: 'Ekspansi',           icon: '🚀', color: '#EF4444' },
}

const VERIFICATION_LEVELS: Record<number, { label: string; icon: string; color: string }> = {
  1: { label: 'Terdaftar',              icon: '📋', color: '#6B7280' },
  2: { label: 'Terverifikasi Komunitas', icon: '✅', color: '#10B981' },
  3: { label: 'Terverifikasi Mitra',     icon: '🏛️', color: '#3B82F6' },
  4: { label: 'Terverifikasi Resmi',     icon: '🏆', color: '#F59E0B' },
}

export default function ResourceDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const { resource, loading, error, refetch } = useResourceById(id)
  const { recommendations } = useRecommendations(id)
  const [activeTab, setActiveTab] = useState<'info' | 'verifications' | 'recommendations'>('info')
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  const handleVerify = async (type: VerificationType, rating?: number, review?: string) => {
    setVerifyLoading(true)
    try {
      await verificationService.create(id, { type, rating, review })
      refetch()
    } catch (err) {
      console.error(err)
    } finally {
      setVerifyLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <p className="text-gray-400 text-lg">{error || 'Potensi tidak ditemukan'}</p>
          <Link href="/economic-map" className="mt-4 inline-block text-indigo-400 hover:text-indigo-300">← Kembali ke Peta</Link>
        </div>
      </div>
    )
  }

  const statusConfig = STATUS_LABELS[resource.opportunity_status] || STATUS_LABELS.aktif
  const verLevel = VERIFICATION_LEVELS[(resource as any).verification_level] || VERIFICATION_LEVELS[1]

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Breadcrumb */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/economic-map" className="hover:text-indigo-400 transition-colors">Peta Ekonomi</Link>
            <span>/</span>
            <span className="text-gray-300">{resource.resource_name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            {resource.images.length > 0 && (
              <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
                <div className="relative h-64 md:h-80">
                  <img
                    src={resource.images[activeImage]?.url}
                    alt={resource.resource_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 right-3 flex gap-2 overflow-x-auto">
                    {resource.images.map((img, i) => (
                      <button
                        key={img.id}
                        onClick={() => setActiveImage(i)}
                        className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                          i === activeImage ? 'border-indigo-500 scale-110' : 'border-transparent opacity-70'
                        }`}
                      >
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl p-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs text-white font-medium" style={{ backgroundColor: resource.category?.color || '#6366F1' }}>
                  {resource.category?.icon} {resource.category?.name}
                </span>
                <span className="px-3 py-1 rounded-full text-xs text-white font-medium" style={{ backgroundColor: statusConfig.color }}>
                  {statusConfig.icon} {statusConfig.label}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs bg-gray-700 text-gray-300 capitalize">{resource.business_scale}</span>
                {/* Verification Level Badge */}
                <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${verLevel.color}20`, color: verLevel.color }}>
                  {verLevel.icon} {verLevel.label}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{resource.resource_name}</h1>
              <p className="text-gray-400 mt-1">📍 {resource.lokasi?.address || 'Lokasi tidak tersedia'}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                <span>👀 {resource.view_count} dilihat</span>
                <span>⭐ Skor {resource.verification_score}/100</span>
                {resource.saved_count !== undefined && <span>💾 {resource.saved_count} disimpan</span>}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-900 p-1 rounded-xl border border-gray-800">
              {[
                { key: 'info', label: '📋 Informasi' },
                { key: 'verifications', label: '✅ Verifikasi' },
                { key: 'recommendations', label: '🤖 Rekomendasi' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    activeTab === tab.key ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'info' && (
              <div className="space-y-4">
                <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-white mb-3">Deskripsi</h2>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{resource.description}</p>
                </div>
                {resource.collaboration_needed && (
                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-indigo-300 mb-2">🤝 Kebutuhan Kolaborasi</h2>
                    <p className="text-gray-300">{resource.collaboration_needed}</p>
                  </div>
                )}
                {resource.monthly_capacity && (
                  <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
                    <h2 className="text-sm font-medium text-gray-400 mb-1">Kapasitas Produksi/Bulan</h2>
                    <p className="text-white text-lg font-semibold">{resource.monthly_capacity}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'verifications' && (
              <div className="space-y-4">
                {/* Quick Actions */}
                <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Verifikasi Komunitas</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                      onClick={() => handleVerify('support')}
                      disabled={verifyLoading}
                      className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center hover:bg-blue-500/20 transition-all disabled:opacity-50"
                    >
                      <span className="text-2xl block mb-1">👍</span>
                      <span className="text-blue-400 text-xs font-medium">Dukung</span>
                    </button>
                    <button
                      onClick={() => handleVerify('verify')}
                      disabled={verifyLoading}
                      className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                    >
                      <span className="text-2xl block mb-1">✅</span>
                      <span className="text-emerald-400 text-xs font-medium">Verifikasi</span>
                    </button>
                    <button
                      onClick={() => handleVerify('rate', 5)}
                      disabled={verifyLoading}
                      className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center hover:bg-amber-500/20 transition-all disabled:opacity-50"
                    >
                      <span className="text-2xl block mb-1">⭐</span>
                      <span className="text-amber-400 text-xs font-medium">Rating</span>
                    </button>
                    <button
                      onClick={() => handleVerify('review', undefined, 'Usaha ini benar ada dan aktif beroperasi.')}
                      disabled={verifyLoading}
                      className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-center hover:bg-purple-500/20 transition-all disabled:opacity-50"
                    >
                      <span className="text-2xl block mb-1">💬</span>
                      <span className="text-purple-400 text-xs font-medium">Ulasan</span>
                    </button>
                  </div>
                </div>
                {/* Verification List */}
                {resource.verifications && resource.verifications.length > 0 ? (
                  <div className="space-y-3">
                    {resource.verifications.map((v) => (
                      <div key={v.id} className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-sm">
                          {v.type === 'support' ? '👍' : v.type === 'verify' ? '✅' : v.type === 'rate' ? '⭐' : '💬'}
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{v.user?.nama}</p>
                          {v.review && <p className="text-gray-400 text-sm mt-1">{v.review}</p>}
                          {v.rating && <p className="text-amber-400 text-sm">{'⭐'.repeat(v.rating)}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">Belum ada verifikasi komunitas</p>
                )}
              </div>
            )}

            {activeTab === 'recommendations' && recommendations && (
              <div className="space-y-4">
                <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">🤖 Rekomendasi untuk Usaha Ini</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {recommendations.category_recommendations.map((rec) => (
                      <div key={rec.type} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-indigo-500/30 transition-all">
                        <span className="text-2xl">{rec.icon}</span>
                        <h3 className="text-white font-medium mt-2">{rec.label}</h3>
                        <p className="text-gray-400 text-sm mt-1">{rec.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {recommendations.similar_resources.length > 0 && (
                  <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">🔗 Potensi Serupa di Wilayah Ini</h2>
                    <div className="space-y-3">
                      {recommendations.similar_resources.map((sr) => (
                        <Link key={sr.id} href={`/resources/${sr.id}`} className="block bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800 transition-all">
                          <h3 className="text-white font-medium">{sr.resource_name}</h3>
                          <div className="flex gap-3 mt-1 text-xs text-gray-400">
                            <span className="capitalize">{sr.business_scale}</span>
                            <span>⭐ {sr.verification_score}</span>
                            <span>{sr.city || sr.province}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-4">
            {/* Investment Card */}
            {resource.investment_needed && (
              <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-2xl p-6">
                <h3 className="text-emerald-400 text-sm font-medium mb-1">Kebutuhan Investasi</h3>
                <p className="text-2xl font-bold text-white">Rp {Number(resource.investment_needed).toLocaleString('id-ID')}</p>
              </div>
            )}

            {/* Contributor */}
            {resource.contributor && (
              <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-gray-400 text-sm font-medium mb-3">Kontributor</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    {resource.contributor.nama?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="text-white font-medium">{resource.contributor.nama}</p>
                    {resource.contributor.organization && (
                      <p className="text-gray-400 text-sm">{resource.contributor.organization}</p>
                    )}
                  </div>
                </div>
                {/* Dynamic Status Badges */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {resource.contributor.is_business_owner && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-400">🏭 Business Owner</span>
                  )}
                  {resource.contributor.is_investor && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400">💰 Investor</span>
                  )}
                  {resource.contributor.badges?.map((b) => (
                    <span key={b.key} className="px-2 py-0.5 rounded-full text-[10px] bg-blue-500/20 text-blue-400">{b.icon} {b.label}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact */}
            <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-gray-400 text-sm font-medium mb-3">Kontak</h3>
              {resource.contact_information && <p className="text-white text-sm mb-2">📞 {resource.contact_information}</p>}
              {resource.website && <p className="text-indigo-400 text-sm mb-2">🌐 <a href={resource.website} target="_blank" rel="noopener" className="hover:underline">{resource.website}</a></p>}
              {resource.social_media && Object.entries(resource.social_media).map(([key, val]) => (
                val && <p key={key} className="text-gray-300 text-sm mb-1 capitalize">📱 {key}: {val}</p>
              ))}
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-600/20">
                🤝 Ajukan Kolaborasi
              </button>
              <button className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-all border border-gray-700">
                💾 Simpan Peluang
              </button>
            </div>

            {/* Location */}
            <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-gray-400 text-sm font-medium mb-2">Lokasi</h3>
              <p className="text-white text-sm">{resource.lokasi?.address}</p>
              {resource.lokasi?.city && <p className="text-gray-400 text-sm mt-1">{resource.lokasi.city}, {resource.lokasi.province}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
