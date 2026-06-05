'use client'

import React from 'react'
import { useCollaborations } from '@/hooks/useCollaboration'
import type { CollaborationStatus } from '@/types/resource'

const STATUS_TABS: { value: CollaborationStatus | 'all'; label: string; icon: string }[] = [
  { value: 'all',      label: 'Semua',    icon: '📋' },
  { value: 'pending',  label: 'Pending',  icon: '⏳' },
  { value: 'accepted', label: 'Diterima', icon: '✅' },
  { value: 'rejected', label: 'Ditolak',  icon: '❌' },
]

const TYPE_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  investasi:  { label: 'Investasi',  icon: '💰', color: '#F59E0B' },
  distribusi: { label: 'Distribusi', icon: '🚚', color: '#10B981' },
  supply:     { label: 'Supply',     icon: '📦', color: '#3B82F6' },
  kemitraan:  { label: 'Kemitraan',  icon: '🤝', color: '#8B5CF6' },
  ekspansi:   { label: 'Ekspansi',   icon: '🚀', color: '#EC4899' },
}

export default function KolaborasiPage() {
  const {
    collaborations, loading, error, statusFilter,
    setStatusFilter, respondCollaboration,
  } = useCollaborations()

  const [activeTab, setActiveTab] = React.useState<string>('all')
  const [respondLoading, setRespondLoading] = React.useState<string | null>(null)

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setStatusFilter(tab === 'all' ? undefined : tab as CollaborationStatus)
  }

  const handleRespond = async (id: string, status: 'accepted' | 'rejected') => {
    setRespondLoading(id)
    try {
      await respondCollaboration(id, status)
    } catch (err) {
      console.error(err)
    } finally {
      setRespondLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">🤝 Kolaborasi</h1>
        <p className="text-gray-400 text-sm mt-1">Kelola permintaan kolaborasi bisnis Anda</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900 p-1 rounded-xl border border-gray-800">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === tab.value ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-400">{error}</div>
      ) : collaborations.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 rounded-2xl border border-gray-800">
          <p className="text-6xl mb-4">🤝</p>
          <p className="text-gray-400 text-lg">Belum ada kolaborasi</p>
          <p className="text-gray-500 text-sm mt-1">Mulai kolaborasi dari halaman detail potensi atau papan peluang</p>
        </div>
      ) : (
        <div className="space-y-3">
          {collaborations.map((c) => {
            const typeConfig = TYPE_LABELS[c.type] || { label: c.type, icon: '📋', color: '#6366F1' }
            return (
              <div key={c.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: typeConfig.color }}>
                        {typeConfig.icon} {typeConfig.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        c.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' :
                        c.status === 'pending'  ? 'bg-amber-500/20 text-amber-400' :
                        c.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-700 text-gray-400'
                      }`}>
                        {c.status === 'accepted' ? '✅ Diterima' : c.status === 'pending' ? '⏳ Pending' : c.status === 'rejected' ? '❌ Ditolak' : '🚫 Dibatalkan'}
                      </span>
                    </div>

                    <h3 className="text-white font-semibold">{c.resource?.resource_name || 'Resource'}</h3>
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">{c.message}</p>

                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span>Dari: <span className="text-gray-300">{c.initiator?.nama}</span></span>
                      <span>Kepada: <span className="text-gray-300">{c.target?.nama}</span></span>
                      <span>{new Date(c.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>

                  {/* Respond Buttons (only for target, only pending) */}
                  {c.status === 'pending' && (
                    <div className="flex gap-2 ml-4 flex-shrink-0">
                      <button
                        onClick={() => handleRespond(c.id, 'accepted')}
                        disabled={respondLoading === c.id}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-all disabled:opacity-50"
                      >
                        ✅ Terima
                      </button>
                      <button
                        onClick={() => handleRespond(c.id, 'rejected')}
                        disabled={respondLoading === c.id}
                        className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
                      >
                        ❌ Tolak
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
