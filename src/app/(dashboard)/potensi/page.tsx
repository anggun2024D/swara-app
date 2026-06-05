'use client'

import React from 'react'
import Link from 'next/link'
import { useMyResources } from '@/hooks/useEconomicResources'

const STATUS_BADGE: Record<string, { label: string; class: string }> = {
  active:   { label: 'Aktif',   class: 'bg-emerald-500/20 text-emerald-400' },
  pending:  { label: 'Pending', class: 'bg-amber-500/20 text-amber-400' },
  rejected: { label: 'Ditolak', class: 'bg-red-500/20 text-red-400' },
}

export default function PotensiPage() {
  const { resources, pagination, loading, error, refetch } = useMyResources()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">📊 Potensi Saya</h1>
          <p className="text-gray-400 text-sm mt-1">Kelola semua potensi ekonomi yang Anda daftarkan</p>
        </div>
        <Link
          href="/potensi/baru"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-600/20"
        >
          + Tambah Potensi
        </Link>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-400">{error}</div>
      ) : resources.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 rounded-2xl border border-gray-800">
          <p className="text-6xl mb-4">📝</p>
          <p className="text-gray-400 text-lg mb-2">Belum ada potensi ekonomi</p>
          <p className="text-gray-500 text-sm mb-4">Mulai daftarkan potensi ekonomi di wilayah Anda</p>
          <Link href="/potensi/baru" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium">
            + Tambah Potensi Pertama
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {resources.map((r) => {
            const badge = STATUS_BADGE[r.status] || STATUS_BADGE.pending
            return (
              <div key={r.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition-all">
                <div className="flex items-start gap-4">
                  {r.images?.[0] ? (
                    <img src={r.images[0].url} alt="" className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-20 h-20 rounded-lg flex items-center justify-center text-3xl" style={{ backgroundColor: `${r.category?.color || '#6366F1'}15` }}>
                      {r.category?.icon || '📋'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-full text-xs text-white" style={{ backgroundColor: r.category?.color || '#6366F1' }}>
                        {r.category?.name}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${badge.class}`}>{badge.label}</span>
                      {r.verification_level >= 2 && (
                        <span className="text-emerald-400 text-xs">
                          {r.verification_icon} Lv.{r.verification_level}
                        </span>
                      )}
                    </div>
                    <h3 className="text-white font-semibold truncate">{r.resource_name}</h3>
                    <p className="text-gray-500 text-sm mt-0.5 line-clamp-1">{r.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>👀 {r.view_count}</span>
                      <span>⭐ {r.verification_score}</span>
                      <span className="capitalize">📏 {r.business_scale}</span>
                      <span>📍 {r.lokasi?.city || r.lokasi?.province || '-'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link href={`/resources/${r.id}`} className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-xs hover:bg-gray-700 transition-colors">
                      Detail
                    </Link>
                    <Link href={`/potensi/${r.id}/edit`} className="px-3 py-1.5 bg-indigo-600/20 text-indigo-400 rounded-lg text-xs hover:bg-indigo-600/30 transition-colors">
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.total_halaman > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: pagination.total_halaman }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`w-9 h-9 rounded-lg text-sm font-medium ${
                page === pagination.halaman_ini ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
