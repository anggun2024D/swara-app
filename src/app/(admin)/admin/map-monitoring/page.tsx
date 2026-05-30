'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Layers, Filter, MapPin, Activity, RefreshCw, AlertCircle } from 'lucide-react'
import { useMapReports } from '@/hooks/useMapReports'

const AdminMap = dynamic(
  () => import('@/components/admin/map-monitoring/AdminMap'),
  { ssr: false, loading: () => <div className="h-[600px] bg-gray-200 animate-pulse rounded-2xl" /> }
)

export default function MapMonitoringPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const { reports, isLoading, error, refetch, stats } = useMapReports()

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Peta Monitoring Real-time</h1>
        <div className="flex gap-2">
          <button
            onClick={refetch}
            disabled={isLoading}
            className="p-2 bg-white rounded-xl shadow-sm border hover:bg-gray-50 transition disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button className="p-2 bg-white rounded-xl shadow-sm border"><Filter size={18} /></button>
          <button className="p-2 bg-white rounded-xl shadow-sm border"><Layers size={18} /></button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 rounded-xl px-4 py-3 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button onClick={refetch} className="ml-auto underline text-xs">Coba lagi</button>
        </div>
      )}

      <div className="relative bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        {/* Filter overlay */}
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur rounded-xl shadow-md p-2 flex gap-2">
          {['all', 'tersubmit', 'diproses', 'selesai', 'ditolak'].map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1 rounded-full text-xs transition ${
                activeFilter === f
                  ? f === 'urgent' ? 'bg-red-500 text-white'
                    : f === 'diproses' ? 'bg-yellow-500 text-white'
                    : f === 'selesai' ? 'bg-green-500 text-white'
                    : 'bg-primary text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'Semua' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur rounded-xl shadow-md p-3 text-xs">
          <div className="flex gap-3">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500" />Urgent</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-yellow-500" />Diproses</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500" />Selesai</div>
          </div>
        </div>

        {/* Loading overlay di atas map */}
        {isLoading && reports.length === 0 && (
          <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-sm flex items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <RefreshCw size={16} className="animate-spin" />
              Memuat data laporan...
            </div>
          </div>
        )}

        <AdminMap reports={reports} filter={activeFilter} />
      </div>

      {/* Stats cards — dari real data */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <Activity size={20} className="text-primary mb-2" />
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-muted">Total Laporan Aktif</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <MapPin size={20} className="text-red-500 mb-2" />
          <p className="text-2xl font-bold">{stats.urgent}</p>
          <p className="text-xs text-muted">Laporan Urgent</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <Activity size={20} className="text-yellow-500 mb-2" />
          <p className="text-2xl font-bold">{stats.diproses}</p>
          <p className="text-xs text-muted">Sedang Diproses</p>
        </div>
      </div>
    </div>
  )
}