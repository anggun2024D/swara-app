'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, RefreshCw, AlertCircle, MapPin, Clock, CheckCircle } from 'lucide-react'
import { useUserReports, UserReport } from '@/hooks/useUserReports'
import ReportDetailSidebar from '@/components/peta/ReportDetailSidebar'

const PetaMap = dynamic(() => import('@/components/peta/PetaMap'), {
  ssr: false,
  loading: () => <div className="h-full bg-gray-200 animate-pulse" />,
})

const STATUS_FILTERS = [
  { value: 'all',       label: 'Semua' },
  { value: 'tersubmit', label: 'Baru Diterima' },
  { value: 'diproses',  label: 'Diproses' },
  { value: 'selesai',   label: 'Selesai' },
]

export default function PetaPage() {
  const { reports, isLoading, error, refetch, stats } = useUserReports()
  const [selected, setSelected]   = useState<UserReport | null>(null)
  const [filter, setFilter]       = useState('all')
  const [search, setSearch]       = useState('')

  const filtered = reports.filter(r => {
    const matchStatus = filter === 'all' || r.status === filter
    const matchSearch = !search || r.judul.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden">

      {/* Full-screen map */}
      {isLoading ? (
        <div className="h-full bg-gray-100 animate-pulse flex items-center justify-center">
          <p className="text-muted text-sm">Memuat peta...</p>
        </div>
      ) : (
        <PetaMap
          reports={filtered}
          selected={selected}
          onSelect={setSelected}
          onClose={() => setSelected(null)}
        />
      )}

      {/* ── Top bar: Search + Filter ── */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[998] flex gap-2 w-full max-w-lg px-4">
        <div className="flex-1 bg-white rounded-2xl shadow-lg flex items-center gap-2 px-4 py-2.5">
          <Search size={16} className="text-muted flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari lokasi, laporan..."
            className="flex-1 text-sm outline-none bg-transparent placeholder:text-muted"
          />
        </div>
      </div>

      {/* ── Status filter pills ── */}
      <div className="absolute top-[72px] left-1/2 -translate-x-1/2 z-[998] flex gap-2 px-4">
        {STATUS_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow transition whitespace-nowrap ${
              filter === f.value
                ? 'bg-primary text-white'
                : 'bg-white text-text hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Stats card kiri bawah ── */}
      <AnimatePresence>
        {!selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-6 left-6 z-[998] bg-white rounded-2xl shadow-xl p-5 w-64"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-muted font-semibold">LAPORAN AKTIF</p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-3xl font-extrabold text-text">{stats.total}</span>
                  <span className="text-sm text-muted">laporan hari ini</span>
                </div>
              </div>
              <button
                onClick={refetch}
                disabled={isLoading}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
              >
                <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              </button>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="text-text">{stats.diproses} Dalam Proses</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-text">{stats.tersubmit} Baru Diterima</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-text">{stats.selesai} Selesai</span>
              </div>
            </div>

            {/* Error state */}
            {error && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-red-500">
                <AlertCircle size={12} />
                <span>{error}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Detail sidebar kanan ── */}
      <ReportDetailSidebar
        report={selected}
        onClose={() => setSelected(null)}
      />

    </div>
  )
}