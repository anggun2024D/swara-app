'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { MapPin, RefreshCw, Wifi, WifiOff } from 'lucide-react'

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-[520px] bg-gradient-to-br from-emerald-50 to-blue-50 rounded-3xl animate-pulse flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 text-sm font-medium">Memuat peta ekonomi...</p>
    </div>
  ),
})

const CATEGORY_FILTERS = [
  { value: 'all',        label: 'Semua',       icon: '🗺️', color: 'emerald' },
  { value: 'umkm',       label: 'UMKM',        icon: '🏭', color: 'amber' },
  { value: 'pertanian',  label: 'Pertanian',   icon: '🌾', color: 'green' },
  { value: 'perikanan',  label: 'Perikanan',   icon: '🐟', color: 'blue' },
  { value: 'pariwisata', label: 'Pariwisata',  icon: '🏝️', color: 'purple' },
]

interface MapResource {
  id: string
  title: string
  latitude: number
  longitude: number
  address?: string
  category_slug?: string
  category_name?: string
  category_icon?: string
  verification_level?: number
  status?: string
  [key: string]: any
}

export default function GISMapSection() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [isClient, setIsClient] = useState(false)
  const [resources, setResources] = useState<MapResource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { setIsClient(true) }, [])

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const BASE = process.env.NEXT_PUBLIC_API_URL
      const res = await fetch(`${BASE}/resources/map`)
      const json = await res.json()
      if (json.success) {
        // Map backend nested response to flat MapResource
        const mapped = (json.data || []).map((r: any) => ({
          id: r.id,
          title: r.resource_name,
          resource_name: r.resource_name,
          latitude: r.lokasi?.latitude ?? r.latitude,
          longitude: r.lokasi?.longitude ?? r.longitude,
          address: r.lokasi?.address ?? r.address,
          category_slug: r.category?.slug,
          category_name: r.category?.name,
          category_icon: r.category?.icon,
          verification_level: r.verification_level,
          status: r.status || 'active',
        }))
        setResources(mapped)
      }
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat data peta')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const filteredMarkers = resources.filter(r => {
    if (activeFilter === 'all') return true
    return r.category_slug === activeFilter
  })

  // Transform to MapReport format expected by MapComponent
  const markers = filteredMarkers.map(r => ({
    id: r.id,
    title: r.title || r.resource_name || '',
    lat: r.latitude,
    lng: r.longitude,
    address: r.address || '',
    status: r.status || 'active',
    is_urgent: false,
    pelapor: '-',
    kategori: r.category_name || '-',
  }))

  if (!isClient) return null

  return (
    <section id="map" className="py-24 bg-white">
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
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">GIS Platform</p>
            <h2 className="section-title">Peta Sebaran<br />Potensi Ekonomi</h2>
          </div>
          <p className="section-subtitle text-left md:max-w-xs mt-0">
            Visualisasi real-time potensi ekonomi di seluruh wilayah Indonesia
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden shadow-float border border-gray-200"
        >
          {/* Filter Bar */}
          <div className="absolute top-4 left-4 z-10 flex gap-2 flex-wrap">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-card p-1.5 flex gap-1">
              {CATEGORY_FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeFilter === filter.value
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{filter.icon}</span>
                  <span className="hidden sm:inline">{filter.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="bg-white/95 backdrop-blur-md rounded-2xl shadow-card px-3 py-2 flex items-center gap-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 right-4 z-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-card p-3.5 text-xs min-w-[150px]">
            <div className="flex items-center gap-1.5 mb-2.5 pb-2.5 border-b border-gray-100">
              {error
                ? <><WifiOff size={12} className="text-red-500" /><span className="text-red-500 font-semibold">Gagal memuat</span></>
                : <><Wifi size={12} className="text-emerald-500" /><span className="text-emerald-600 font-semibold">{isLoading ? 'Memuat…' : `${filteredMarkers.length} potensi`}</span></>
              }
            </div>
            <p className="font-bold text-gray-900 mb-2">Legenda</p>
            {[
              { label: '🏭 UMKM',       color: 'bg-amber-500' },
              { label: '🌾 Pertanian',   color: 'bg-emerald-500' },
              { label: '🐟 Perikanan',   color: 'bg-blue-500' },
              { label: '🏝️ Pariwisata', color: 'bg-purple-500' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 mb-1">
                <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                <span className="text-gray-500">{s.label}</span>
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
                <p className="font-bold text-gray-900">Gagal memuat data peta</p>
                <p className="text-sm text-gray-500 mt-1">{error}</p>
              </div>
              <button
                onClick={fetchData}
                className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-hover transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            <MapComponent markers={markers} />
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
            ) : filteredMarkers.length > 0 ? (
              <>
                <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">
                  {filteredMarkers[0].title || filteredMarkers[0].resource_name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {filteredMarkers[0].category_icon} {filteredMarkers[0].category_name}
                </p>
                <p className="text-[10px] text-gray-400 mt-1.5 truncate">
                  📍 {filteredMarkers[0].address || 'Indonesia'}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500">Belum ada potensi terdaftar</p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}