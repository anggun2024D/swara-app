'use client'
 
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { MapPin, CheckCircle, Clock, AlertTriangle, RefreshCw, Wifi, WifiOff, Layers } from 'lucide-react'
// ✅ HOOK TIDAK BERUBAH
import { usePublicMapReports } from '@/hooks/usePublicMapReports'
 
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-[520px] bg-gradient-to-br from-primary-light to-emerald-50 rounded-3xl animate-pulse flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-muted text-sm font-medium">Memuat peta interaktif...</p>
    </div>
  ),
})
 
// ✅ CONSTANTS TIDAK BERUBAH
const statusLabel: Record<string, string> = {
  tersubmit: 'Tersubmit', diverifikasi: 'Diverifikasi', diproses: 'Diproses', selesai: 'Selesai', ditolak: 'Ditolak',
}
const statusProgress: Record<string, number> = {
  tersubmit: 20, diverifikasi: 40, diproses: 65, selesai: 100, ditolak: 0,
}
 
export default function GISMapSection() {
  // ✅ STATE & LOGIC TIDAK BERUBAH
  const [activeFilter, setActiveFilter] = useState('all')
  const [isClient, setIsClient] = useState(false)
  const { reports, isLoading, error, refetch, stats } = usePublicMapReports()
 
  useEffect(() => { setIsClient(true) }, [])
 
  const liveReport = reports.length > 0 ? reports[0] : null
  const statusFilters = [
    { label: 'Semua',    value: 'all',      count: stats.total,    icon: MapPin,        color: 'emerald' },
    { label: 'Urgent',   value: 'urgent',   count: stats.urgent,   icon: AlertTriangle, color: 'red' },
    { label: 'Diproses', value: 'diproses', count: stats.diproses, icon: Clock,         color: 'amber' },
    { label: 'Selesai',  value: 'selesai',  count: stats.selesai,  icon: CheckCircle,   color: 'green' },
  ]
  const filteredMarkers = reports.filter(r => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'urgent') return r.is_urgent
    return r.status === activeFilter
  })
  if (!isClient) return null
 
  return (
    <section id="map" className="py-24 bg-white">
      {/* Wave separator top */}
      <div className="-mt-24 mb-12">
        <svg viewBox="0 0 1440 80" fill="none" className="w-full" preserveAspectRatio="none">
          <path d="M0,80 C360,0 1080,0 1440,80 L1440,0 L0,0 Z" fill="#f5f7f9"/>
        </svg>
      </div>
 
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4"
        >
          <div>
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">GIS Monitoring</p>
            <h2 className="section-title">Peta Sebaran<br />Laporan Infrastruktur</h2>
          </div>
          <p className="section-subtitle text-left md:max-w-xs mt-0">
            Visualisasi real-time laporan di seluruh wilayah Kabupaten Lamongan
          </p>
        </motion.div>
 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden shadow-float border border-border/50"
        >
          {/* Filter Bar — redesigned */}
          <div className="absolute top-4 left-4 z-10 flex gap-2 flex-wrap">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-card p-1.5 flex gap-1">
              {statusFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeFilter === filter.value
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-text hover:bg-gray-100'
                  }`}
                >
                  <filter.icon size={13} />
                  <span className="hidden sm:inline">{filter.label}</span>
                  <span className="text-[10px] opacity-70 font-bold">
                    {isLoading ? '…' : filter.count}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={refetch}
              disabled={isLoading}
              className="bg-white/95 backdrop-blur-md rounded-2xl shadow-card px-3 py-2 flex items-center gap-1.5 text-xs font-medium text-text hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
 
          {/* Legend — redesigned */}
          <div className="absolute bottom-4 right-4 z-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-card p-3.5 text-xs min-w-[150px]">
            <div className="flex items-center gap-1.5 mb-2.5 pb-2.5 border-b border-gray-100">
              {error
                ? <><WifiOff size={12} className="text-red-500" /><span className="text-red-500 font-semibold">Gagal memuat</span></>
                : <><Wifi size={12} className="text-emerald-500" /><span className="text-emerald-600 font-semibold">{isLoading ? 'Memuat…' : `${stats.total} titik`}</span></>
              }
            </div>
            <p className="font-bold text-text mb-2">Legenda</p>
            {[
              { label: 'Urgent', color: 'bg-red-500' },
              { label: 'Diproses', color: 'bg-amber-500' },
              { label: 'Selesai', color: 'bg-green-500' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 mb-1">
                <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                <span className="text-muted">{s.label}</span>
              </div>
            ))}
          </div>
 
          {/* Map */}
          {error ? (
            <div className="h-[520px] bg-gray-50 flex flex-col items-center justify-center gap-4 text-gray-500">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <WifiOff size={28} className="text-red-400" />
              </div>
              <div className="text-center">
                <p className="font-bold text-text">Gagal memuat data peta</p>
                <p className="text-sm text-muted mt-1">{error}</p>
              </div>
              <button
                onClick={refetch}
                className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-hover transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            <MapComponent markers={filteredMarkers} />
          )}
 
          {/* Live Activity Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-card p-4 max-w-[240px] hidden lg:block"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Live Activity</span>
            </div>
            {isLoading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-50 rounded w-1/2" />
              </div>
            ) : liveReport ? (
              <>
                <p className="text-sm font-bold text-text line-clamp-2 leading-snug">{liveReport.title}</p>
                <p className="text-xs text-muted mt-1">Status: {statusLabel[liveReport.status] ?? liveReport.status}</p>
                <div className="mt-2.5 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${statusProgress[liveReport.status] ?? 0}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted mt-1.5 truncate">{liveReport.address}</p>
              </>
            ) : (
              <p className="text-sm text-muted">Belum ada laporan</p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}