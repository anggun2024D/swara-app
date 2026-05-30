'use client'

import { MapPin, RefreshCw } from 'lucide-react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useMapReports } from '@/hooks/useMapReports'

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => <div className="h-80 bg-gray-200 rounded-xl animate-pulse" />,
})

export default function MapSection() {
  const { reports, isLoading, refetch } = useMapReports()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card overflow-hidden"
    >
      <div className="p-4 border-b border-border flex justify-between items-center">
        <div>
          <h3 className="font-bold text-primary">Peta Sebaran Laporan</h3>
          <p className="text-xs text-muted">
            {isLoading
              ? 'Memuat data…'
              : `${reports.length} laporan terpetakan · Surabaya, Jawa Timur`}
          </p>
        </div>
        <button
          onClick={refetch}
          disabled={isLoading}
          className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline disabled:opacity-50"
        >
          {isLoading
            ? <RefreshCw size={12} className="animate-spin" />
            : <MapPin size={12} />
          }
          {isLoading ? 'Memuat...' : 'Refresh'}
        </button>
      </div>

      <MapComponent markers={reports} height="h-80" />

      <div className="p-3 flex gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-gray-500" /> Tersubmit
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-yellow-500" /> Diproses
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-green-500" /> Selesai
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" /> Ditolak
        </div>
      </div>
    </motion.div>
  )
}