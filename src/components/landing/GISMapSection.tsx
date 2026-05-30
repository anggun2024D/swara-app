'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { MapPin, CheckCircle, Clock, AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { usePublicMapReports } from '@/hooks/usePublicMapReports' // ✅ ganti ke hook publik

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-gray-200 rounded-2xl animate-pulse flex items-center justify-center">
      Memuat peta...
    </div>
  ),
})

const statusLabel: Record<string, string> = {
  tersubmit:    'Tersubmit',
  diverifikasi: 'Diverifikasi',
  diproses:     'Diproses',
  selesai:      'Selesai',
  ditolak:      'Ditolak',
}

const statusProgress: Record<string, number> = {
  tersubmit:    20,
  diverifikasi: 40,
  diproses:     65,
  selesai:      100,
  ditolak:      0,
}

export default function GISMapSection() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [isClient, setIsClient] = useState(false)

  // ✅ Hook publik — tidak pakai Axios bertoken, langsung fetch ke /publik/peta
  const { reports, isLoading, error, refetch, stats } = usePublicMapReports()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const liveReport = reports.length > 0 ? reports[0] : null

  const statusFilters = [
    { label: 'Semua',    value: 'all',      count: stats.total,    icon: MapPin,        color: 'text-primary'    },
    { label: 'Urgent',   value: 'urgent',   count: stats.urgent,   icon: AlertTriangle, color: 'text-red-500'    },
    { label: 'Diproses', value: 'diproses', count: stats.diproses, icon: Clock,         color: 'text-yellow-500' },
    { label: 'Selesai',  value: 'selesai',  count: stats.selesai,  icon: CheckCircle,   color: 'text-green-500'  },
  ]

  const filteredMarkers = reports.filter(r => {
    if (activeFilter === 'all')    return true
    if (activeFilter === 'urgent') return r.is_urgent
    return r.status === activeFilter
  })

  if (!isClient) return null

  return (
    <section id="map" className="py-20 bg-bg">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="section-title">Peta Sebaran Laporan</h2>
          <p className="section-subtitle mt-4">
            Visualisasi real-time laporan infrastruktur di Kabupaten Lamongan
          </p>
        </motion.div>

        <div className="relative">
          {/* Filter Bar */}
          <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-2 flex gap-2 flex-wrap">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeFilter === filter.value
                    ? 'bg-primary text-white'
                    : 'bg-white text-text hover:bg-gray-100'
                }`}
              >
                <filter.icon size={14} className={activeFilter === filter.value ? 'text-white' : filter.color} />
                <span>{filter.label}</span>
                {isLoading
                  ? <span className="text-xs opacity-50">...</span>
                  : <span className="text-xs opacity-75">{filter.count}</span>
                }
              </button>
            ))}

            <button
              onClick={refetch}
              disabled={isLoading}
              title="Refresh data peta"
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm bg-white text-text hover:bg-gray-100 transition-all disabled:opacity-50"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* Legend + status koneksi */}
          <div className="absolute bottom-4 right-4 z-10 bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-3 text-xs">
            <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-gray-100">
              {error ? (
                <><WifiOff size={12} className="text-red-500" /><span className="text-red-500 font-medium">Gagal memuat data</span></>
              ) : (
                <><Wifi size={12} className="text-green-500" /><span className="text-green-600 font-medium">{isLoading ? 'Memuat...' : `${stats.total} laporan dimuat`}</span></>
              )}
            </div>
            <p className="font-semibold mb-2">Status</p>
            <div className="flex gap-3">
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500" /> Urgent</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-yellow-500" /> Diproses</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500" /> Selesai</div>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden shadow-xl border border-border">
            {error ? (
              <div className="h-[500px] bg-gray-100 flex flex-col items-center justify-center gap-3 text-gray-500">
                <WifiOff size={32} className="text-red-400" />
                <p className="font-medium">Gagal memuat data peta</p>
                <p className="text-sm text-gray-400">Error: {error}</p>
                <button
                  onClick={refetch}
                  className="mt-2 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:opacity-90 transition-opacity"
                >
                  Coba Lagi
                </button>
              </div>
            ) : (
              <MapComponent markers={filteredMarkers} />
            )}
          </div>

          {/* Live Activity Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-4 max-w-xs hidden lg:block"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-primary">LIVE ACTIVITY</span>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
              </div>
            ) : liveReport ? (
              <>
                <p className="text-sm font-bold line-clamp-2">{liveReport.title}</p>
                <p className="text-xs text-muted mt-1">
                  Terbaru • Status: {statusLabel[liveReport.status] ?? liveReport.status}
                </p>
                <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${statusProgress[liveReport.status] ?? 0}%` }}
                  />
                </div>
                <p className="text-xs text-muted mt-1 truncate">{liveReport.address}</p>
              </>
            ) : (
              <p className="text-sm text-muted">Belum ada laporan</p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}