'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { RefreshCw } from 'lucide-react'
import { useMapReports } from '@/hooks/useMapReports'

const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false })

const FILTERS = [
  { value: 'all',          label: 'Semua' },
  { value: 'tersubmit',    label: 'Tersubmit' },
  { value: 'diproses',     label: 'Diproses' },
  { value: 'selesai',      label: 'Selesai' },
  { value: 'ditolak',      label: 'Ditolak' },
]

const filterActiveClass: Record<string, string> = {
  all:          'bg-primary text-white',
  tersubmit:    'bg-gray-500 text-white',
  diproses:     'bg-yellow-500 text-white',
  selesai:      'bg-green-500 text-white',
  ditolak:      'bg-red-500 text-white',
}

export function ReportMap() {
  const { reports, isLoading, refetch } = useMapReports()
  const [filter, setFilter] = useState('all')

  if (isLoading && reports.length === 0) return (
    <div className="h-96 bg-gray-100 animate-pulse rounded-xl flex items-center justify-center">
      <p className="text-gray-400">Memuat peta...</p>
    </div>
  )

  return (
    <div className="relative h-96 rounded-xl overflow-hidden">
      <MapComponent markers={reports} filter={filter} height="h-96" />

      {/* Filter overlay */}
      <div className="absolute top-3 left-3 z-[999] bg-white/90 backdrop-blur rounded-xl shadow-md p-1.5 flex gap-1">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
              filter === f.value ? filterActiveClass[f.value] : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Refresh button */}
      <button
        onClick={refetch}
        disabled={isLoading}
        className="absolute top-3 right-3 z-[999] bg-white p-2 rounded-lg shadow text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
      >
        <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
      </button>
    </div>
  )
}