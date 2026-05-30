// components/riwayat/RiwayatTabs.tsx
'use client'

import { Search, RefreshCw } from 'lucide-react'
import RiwayatCard from './RiwayatCard'
import EmptyState from '@/components/ui/EmptyState'
import type { Report } from '@/types'

type TabKey = 'semua' | 'tersubmit' | 'diverifikasi' | 'diproses' | 'selesai' | 'ditolak'

interface Props {
  activeTab: TabKey
  setActiveTab: (tab: TabKey) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  reports: Report[]
  isLoading: boolean
  error: string | null
  onRetry: () => void
}

const tabs: { key: TabKey; label: string }[] = [
  { key: 'semua',       label: 'Semua' },
  { key: 'tersubmit',   label: 'Tersubmit' },
  { key: 'diverifikasi',label: 'Diverifikasi' },
  { key: 'diproses',    label: 'Diproses' },
  { key: 'selesai',     label: 'Selesai' },
  { key: 'ditolak',     label: 'Ditolak' },
]

export default function RiwayatTabs({
  activeTab, setActiveTab,
  searchQuery, setSearchQuery,
  reports, isLoading, error, onRetry,
}: Props) {
  return (
    <div>
      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Cari laporan..."
          className="w-full pl-9 pr-4 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-4 overflow-x-auto gap-0 scrollbar-none">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted hover:text-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500 text-sm mb-3">{error}</p>
          <button
            onClick={onRetry}
            className="flex items-center gap-2 mx-auto text-primary text-sm font-semibold hover:underline"
          >
            <RefreshCw size={14} /> Coba lagi
          </button>
        </div>
      ) : reports.length === 0 ? (
        <EmptyState
          title="Tidak ada laporan"
          description="Belum ada laporan pada kategori ini"
        />
      ) : (
        <div className="space-y-3">
          {reports.map(report => (
            <RiwayatCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  )
}