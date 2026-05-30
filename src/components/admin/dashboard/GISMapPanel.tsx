'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Layers, Filter, RefreshCw } from 'lucide-react'
import { useMapReports } from '@/hooks/useMapReports'

const AdminMap = dynamic(
  () => import('@/components/admin/map-monitoring/AdminMap'),
  { ssr: false, loading: () => <div className="h-96 bg-gray-200 animate-pulse rounded-xl" /> }
)

export default function GISMapPanel() {
  const [filter, setFilter] = useState('all')
  const { reports, isLoading, refetch } = useMapReports()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden"
    >
      <div className="p-4 border-b border-border flex justify-between items-center">
        <div>
          <h3 className="font-bold text-text">Peta Monitoring Real-time</h3>
          <p className="text-xs text-muted">
            {isLoading ? 'Memuat...' : `${reports.length} laporan • 18 kecamatan`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={refetch}
            disabled={isLoading}
            className="p-2 rounded-lg bg-bg hover:bg-primary/10 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button className="p-2 rounded-lg bg-bg hover:bg-primary/10 transition-colors"><Filter size={16} /></button>
          <button className="p-2 rounded-lg bg-bg hover:bg-primary/10 transition-colors"><Layers size={16} /></button>
        </div>
      </div>

      <div className="relative">
        <AdminMap reports={reports} filter={filter} />

        {/* Filter overlay */}
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md rounded-xl shadow-md p-2 flex gap-2 text-xs">
          {['all', 'tersubmit', 'diproses', 'selesai', 'ditolak'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full transition ${
                filter === f
                  ? f === 'tersubmit' ? 'bg-gray-500 text-white'
                    : f === 'diproses' ? 'bg-yellow-500 text-white'
                    : f === 'selesai' ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'Semua' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 z-10 bg-white/90 backdrop-blur-md rounded-xl shadow-md p-2 text-xs space-y-1">
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-gray-500" />Tersubmit</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-yellow-500" />Diproses</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500" />Selesai</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500" />Ditolak</div>
        </div>
      </div>
    </motion.div>
  )
}