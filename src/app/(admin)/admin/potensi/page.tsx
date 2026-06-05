'use client'

import React, { useEffect, useState } from 'react'
import { resourcesService } from '@/services/resources.service'
import api from '@/services/api'
import type { EconomicResource } from '@/types/resource'

const VERIFICATION_LEVELS: Record<number, { label: string; icon: string; color: string }> = {
  1: { label: 'Terdaftar', icon: '📋', color: '#6B7280' },
  2: { label: 'Terverifikasi Komunitas', icon: '✅', color: '#10B981' },
  3: { label: 'Terverifikasi Mitra', icon: '🏛️', color: '#3B82F6' },
  4: { label: 'Terverifikasi Resmi', icon: '🏆', color: '#F59E0B' },
}

export default function AdminPotensiPage() {
  const [resources, setResources] = useState<EconomicResource[]>([])
  const [loading, setLoading] = useState(true)
  const [removeLoading, setRemoveLoading] = useState<string | null>(null)
  const [removeReason, setRemoveReason] = useState('')
  const [showRemoveModal, setShowRemoveModal] = useState<string | null>(null)

  const fetchResources = async () => {
    setLoading(true)
    try {
      const res = await resourcesService.getAll({ per_halaman: 50 } as any)
      setResources(res.data?.data?.resources || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchResources() }, [])

  const handleRemove = async (id: string) => {
    if (!removeReason.trim()) return
    setRemoveLoading(id)
    try {
      await api.delete(`/admin/resources/${id}/remove`, { data: { reason: removeReason } })
      setShowRemoveModal(null)
      setRemoveReason('')
      fetchResources()
    } catch (err) {
      console.error(err)
    } finally {
      setRemoveLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">📋 Monitoring Potensi Ekonomi</h1>
        <p className="text-gray-400 text-sm mt-1">Pantau dan hapus spam/data palsu. Verifikasi dilakukan oleh komunitas.</p>
      </div>

      {/* Info Box */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
        <span className="text-xl">⚠️</span>
        <div>
          <p className="text-amber-400 text-sm font-medium">Admin bukan verifikator</p>
          <p className="text-gray-400 text-xs mt-0.5">Semua potensi langsung aktif saat dibuat. Admin hanya menghapus spam, data palsu, atau konten yang melanggar kebijakan platform.</p>
        </div>
      </div>

      {/* Resources List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 rounded-2xl border border-gray-800">
          <p className="text-gray-400">Belum ada potensi ekonomi</p>
        </div>
      ) : (
        <div className="space-y-3">
          {resources.map((r) => {
            const lvl = VERIFICATION_LEVELS[r.verification_level] || VERIFICATION_LEVELS[1]
            return (
              <div key={r.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-all">
                <div className="flex items-start gap-4">
                  {r.images?.[0] ? (
                    <img src={r.images[0].url} alt="" className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-20 h-20 rounded-lg flex items-center justify-center text-3xl bg-gray-800">
                      {r.category?.icon || '📋'}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full text-xs text-white" style={{ backgroundColor: r.category?.color || '#6366F1' }}>
                        {r.category?.name}
                      </span>
                      {/* Verification Level Badge */}
                      <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: `${lvl.color}20`, color: lvl.color }}>
                        {lvl.icon} {lvl.label}
                      </span>
                      <span className="capitalize text-xs text-gray-500">{r.business_scale}</span>
                      {r.contributor?.is_business_owner && <span className="text-xs text-amber-400">🏭</span>}
                      {r.contributor?.is_investor && <span className="text-xs text-emerald-400">💰</span>}
                    </div>

                    <h3 className="text-white font-semibold">{r.resource_name}</h3>
                    <p className="text-gray-500 text-sm mt-0.5 line-clamp-1">{r.description}</p>

                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>👤 {r.contributor?.nama}</span>
                      <span>📍 {r.lokasi?.city || r.lokasi?.province || '-'}</span>
                      <span>👀 {r.view_count}</span>
                      <span>⭐ {r.verification_score}</span>
                      {r.investment_needed && (
                        <span className="text-emerald-400">💰 Rp {Number(r.investment_needed).toLocaleString('id-ID')}</span>
                      )}
                    </div>
                  </div>

                  {/* Admin: Only Remove (spam/palsu) */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => setShowRemoveModal(r.id)}
                      className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-xs font-medium transition-all"
                    >
                      🗑️ Hapus Spam
                    </button>
                  </div>
                </div>

                {/* Remove Modal */}
                {showRemoveModal === r.id && (
                  <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <p className="text-red-400 text-sm font-medium mb-2">Alasan penghapusan:</p>
                    <input
                      type="text"
                      value={removeReason}
                      onChange={(e) => setRemoveReason(e.target.value)}
                      placeholder="Contoh: Data palsu, spam, konten melanggar..."
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-red-500 outline-none"
                    />
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleRemove(r.id)}
                        disabled={removeLoading === r.id || !removeReason.trim()}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-medium disabled:opacity-50 transition-all"
                      >
                        {removeLoading === r.id ? 'Menghapus...' : 'Konfirmasi Hapus'}
                      </button>
                      <button
                        onClick={() => { setShowRemoveModal(null); setRemoveReason('') }}
                        className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg text-xs hover:bg-gray-700 transition-all"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
