'use client'

import React, { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useEconomicMap } from '@/hooks/useEconomicMap'
import type { MapMarker } from '@/types/resource'

// Dynamic import untuk Leaflet (SSR incompatible)
const EconomicMapView = dynamic(() => import('@/components/map/EconomicMapView'), { ssr: false })

const CATEGORIES = [
  { id: 1, name: 'UMKM & Industri Kreatif', slug: 'umkm', icon: '🏭', color: '#F59E0B' },
  { id: 2, name: 'Pertanian & Pangan', slug: 'pertanian', icon: '🌾', color: '#10B981' },
  { id: 3, name: 'Perikanan & Peternakan', slug: 'perikanan', icon: '🐟', color: '#3B82F6' },
  { id: 4, name: 'Pariwisata & Ekonomi Lokal', slug: 'pariwisata', icon: '🏝️', color: '#8B5CF6' },
]

export default function EconomicMapPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)

  const { markers, loading, error, categoryStats, totalMarkers, setFilters } = useEconomicMap({
    category_id: selectedCategory,
  })

  // Filter markers by search
  const filteredMarkers = useMemo(() => {
    if (!searchQuery) return markers
    const q = searchQuery.toLowerCase()
    return markers.filter(
      (m) =>
        m.resource_name.toLowerCase().includes(q) ||
        m.lokasi.address?.toLowerCase().includes(q) ||
        m.lokasi.province?.toLowerCase().includes(q) ||
        m.lokasi.city?.toLowerCase().includes(q)
    )
  }, [markers, searchQuery])

  const handleCategoryFilter = (catId: number | undefined) => {
    setSelectedCategory(catId)
    setFilters({ category_id: catId })
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            🗺️ Peta Potensi Ekonomi
          </h1>
          <p className="text-gray-400 text-sm">
            Memetakan potensi ekonomi Indonesia — {totalMarkers} potensi terdata
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Cari nama usaha atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => handleCategoryFilter(undefined)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                !selectedCategory
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Semua
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryFilter(cat.id === selectedCategory ? undefined : cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'text-white shadow-lg'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
                style={selectedCategory === cat.id ? { backgroundColor: cat.color, boxShadow: `0 8px 20px ${cat.color}40` } : {}}
              >
                <span>{cat.icon}</span>
                <span className="hidden sm:inline">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {CATEGORIES.map((cat) => {
            const stat = categoryStats.find((s) => s.id === cat.id)
            return (
              <div
                key={cat.id}
                className="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-xl p-3 flex items-center gap-3 hover:border-gray-600 transition-all cursor-pointer"
                onClick={() => handleCategoryFilter(cat.id === selectedCategory ? undefined : cat.id)}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                  style={{ backgroundColor: `${cat.color}20` }}
                >
                  {cat.icon}
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">{stat?.count || 0}</p>
                  <p className="text-gray-500 text-xs">{cat.name}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Map */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden" style={{ height: 'calc(100vh - 340px)', minHeight: '400px' }}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mx-auto mb-3"></div>
                <p className="text-gray-500">Memuat peta...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-400">{error}</p>
            </div>
          ) : (
            <EconomicMapView
              markers={filteredMarkers}
              selectedMarker={selectedMarker}
              onMarkerClick={setSelectedMarker}
            />
          )}
        </div>

        {/* Selected Marker Detail */}
        {selectedMarker && (
          <div className="mt-4 bg-gray-900/90 backdrop-blur border border-gray-700 rounded-2xl p-5 animate-in slide-in-from-bottom-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: selectedMarker.category.color }}
                  >
                    {selectedMarker.category.icon} {selectedMarker.category.name}
                  </span>
                  {selectedMarker.community_verified && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-400">✓ Terverifikasi</span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white">{selectedMarker.resource_name}</h3>
                <p className="text-gray-400 text-sm mt-1">📍 {selectedMarker.lokasi.address || 'Lokasi tidak tersedia'}</p>
                <div className="flex gap-4 mt-3 text-sm">
                  <span className="text-gray-400">Skala: <span className="text-white font-medium capitalize">{selectedMarker.business_scale}</span></span>
                  <span className="text-gray-400">Skor: <span className="text-indigo-400 font-medium">{selectedMarker.verification_score}/100</span></span>
                  {selectedMarker.investment_needed && (
                    <span className="text-gray-400">Investasi: <span className="text-emerald-400 font-medium">Rp {Number(selectedMarker.investment_needed).toLocaleString('id-ID')}</span></span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedMarker(null)}
                className="text-gray-500 hover:text-white transition-colors p-1"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-4 flex gap-2">
              <a
                href={`/resources/${selectedMarker.id}`}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Lihat Detail
              </a>
              <a
                href={`/opportunities`}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Peluang Terkait
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
