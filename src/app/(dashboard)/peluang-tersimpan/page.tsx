'use client'

import React from 'react'
import Link from 'next/link'
import { useSavedOpportunities } from '@/hooks/useOpportunities'

export default function PeluangTersimpanPage() {
  const { saved, loading, error, unsaveOpportunity } = useSavedOpportunities()
  const [removing, setRemoving] = React.useState<string | null>(null)

  const handleUnsave = async (id: string) => {
    setRemoving(id)
    try {
      await unsaveOpportunity(id)
    } catch (err) {
      console.error(err)
    } finally {
      setRemoving(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">💾 Peluang Tersimpan</h1>
        <p className="text-gray-400 text-sm mt-1">Daftar peluang investasi dan kolaborasi yang Anda simpan</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-400">{error}</div>
      ) : saved.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 rounded-2xl border border-gray-800">
          <p className="text-6xl mb-4">💾</p>
          <p className="text-gray-400 text-lg mb-2">Belum ada peluang tersimpan</p>
          <p className="text-gray-500 text-sm mb-4">Simpan peluang menarik dari papan peluang atau peta ekonomi</p>
          <Link href="/opportunities" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-500 transition-all">
            🌟 Jelajahi Peluang
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {saved.map((opp) => (
            <div key={opp.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-600 transition-all">
              {opp.images?.[0] && (
                <div className="relative h-36 rounded-xl overflow-hidden mb-4">
                  <img src={opp.images[0].url} alt={opp.resource_name} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full text-xs text-white" style={{ backgroundColor: opp.category?.color || '#6366F1' }}>
                  {opp.category?.icon} {opp.category?.name}
                </span>
                {opp.verification_level >= 2 && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-400">
                    {opp.verification_icon} Lv.{opp.verification_level}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-white">{opp.resource_name}</h3>
              <p className="text-gray-500 text-sm mt-1 line-clamp-2">{opp.description}</p>

              {opp.investment_needed && (
                <div className="mt-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                  <p className="text-emerald-400 text-sm font-medium">💰 Rp {Number(opp.investment_needed).toLocaleString('id-ID')}</p>
                </div>
              )}

              <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                <span className="capitalize">📏 {opp.business_scale}</span>
                <span>⭐ {opp.verification_score}</span>
                <span>📍 {opp.lokasi?.city || opp.lokasi?.province || '-'}</span>
              </div>

              <div className="flex gap-2 mt-4">
                <Link href={`/resources/${opp.id}`} className="flex-1 py-2 text-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all">
                  Lihat Detail
                </Link>
                <button
                  onClick={() => handleUnsave(opp.id)}
                  disabled={removing === opp.id}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm transition-all disabled:opacity-50"
                >
                  {removing === opp.id ? '...' : '🗑️'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
