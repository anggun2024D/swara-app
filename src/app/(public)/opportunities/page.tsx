'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useOpportunities } from '@/hooks/useOpportunities'
import type { OpportunityStatus } from '@/types/resource'

const OPPORTUNITY_STATUSES = [
  { value: 'mencari_investor',    label: 'Mencari Investor',    icon: '💰', color: '#F59E0B' },
  { value: 'mencari_distributor', label: 'Mencari Distributor', icon: '🚚', color: '#10B981' },
  { value: 'mencari_supplier',    label: 'Mencari Supplier',    icon: '📦', color: '#3B82F6' },
  { value: 'mencari_mitra',       label: 'Mencari Mitra',       icon: '🤝', color: '#8B5CF6' },
  { value: 'ekspansi',            label: 'Ekspansi Usaha',      icon: '🚀', color: '#EC4899' },
]

const CATEGORIES = [
  { id: 1, name: 'UMKM & Industri Kreatif', icon: '🏭', color: '#F59E0B' },
  { id: 2, name: 'Pertanian & Pangan', icon: '🌾', color: '#10B981' },
  { id: 3, name: 'Perikanan & Peternakan', icon: '🐟', color: '#3B82F6' },
  { id: 4, name: 'Pariwisata & Ekonomi Lokal', icon: '🏝️', color: '#8B5CF6' },
]

export default function OpportunitiesPage() {
  const [activeStatus, setActiveStatus] = useState<string | undefined>()
  const [activeCategory, setActiveCategory] = useState<number | undefined>()
  const [searchQuery, setSearchQuery] = useState('')

  const { opportunities, pagination, loading, error, setFilters } = useOpportunities()

  const handleFilter = (status?: string, category?: number) => {
    const newFilters: Record<string, any> = {}
    if (status) newFilters.opportunity_status = status
    if (category) newFilters.category_id = category
    if (searchQuery) newFilters.search = searchQuery
    setFilters(newFilters)
  }

  const handleStatusFilter = (status: string) => {
    const newStatus = activeStatus === status ? undefined : status
    setActiveStatus(newStatus)
    handleFilter(newStatus, activeCategory)
  }

  const handleCategoryFilter = (catId: number) => {
    const newCat = activeCategory === catId ? undefined : catId
    setActiveCategory(newCat)
    handleFilter(activeStatus, newCat)
  }

  const handleSearch = () => {
    handleFilter(activeStatus, activeCategory)
  }

  const getStatusConfig = (status: string) => {
    return OPPORTUNITY_STATUSES.find((s) => s.value === status) || { label: status, icon: '📋', color: '#6366F1' }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            🌟 Papan Peluang
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Temukan peluang investasi, kolaborasi, dan kemitraan bisnis di seluruh Indonesia
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Opportunity Status Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
          {OPPORTUNITY_STATUSES.map((status) => (
            <button
              key={status.value}
              onClick={() => handleStatusFilter(status.value)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeStatus === status.value
                  ? 'text-white shadow-lg scale-105'
                  : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-800'
              }`}
              style={activeStatus === status.value ? { backgroundColor: status.color, boxShadow: `0 8px 25px ${status.color}40` } : {}}
            >
              <span className="text-lg">{status.icon}</span>
              {status.label}
            </button>
          ))}
        </div>

        {/* Search + Category Filter */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Cari peluang berdasarkan nama atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryFilter(cat.id)}
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  activeCategory === cat.id
                    ? 'text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
                style={activeCategory === cat.id ? { backgroundColor: cat.color } : {}}
                title={cat.name}
              >
                {cat.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-400">{error}</div>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-gray-400 text-lg">Belum ada peluang yang sesuai filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {opportunities.map((opp) => {
              const statusConfig = getStatusConfig(opp.opportunity_status)
              return (
                <Link
                  key={opp.id}
                  href={`/resources/${opp.id}`}
                  className="group bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl p-5 hover:border-gray-600 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
                >
                  {/* Image */}
                  {opp.images?.[0] && (
                    <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                      <img
                        src={opp.images[0].url}
                        alt={opp.resource_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2">
                        <span
                          className="px-2.5 py-1 rounded-lg text-xs font-medium text-white backdrop-blur-sm"
                          style={{ backgroundColor: `${statusConfig.color}CC` }}
                        >
                          {statusConfig.icon} {statusConfig.label}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs text-white"
                      style={{ backgroundColor: opp.category?.color || '#6366F1' }}
                    >
                      {opp.category?.icon} {opp.category?.name}
                    </span>
                    {(opp as any).verification_level >= 2 && (
                      <span className="text-emerald-400 text-xs">
                        {(opp as any).verification_level >= 3 ? '🏛️' : '✅'} Lv.{(opp as any).verification_level}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {opp.resource_name}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{opp.description}</p>

                  {/* Stats */}
                  <div className="flex items-center gap-3 mt-3 text-sm">
                    <span className="text-gray-400 capitalize">📏 {opp.business_scale}</span>
                    <span className="text-indigo-400">⭐ {opp.verification_score}</span>
                    <span className="text-gray-400">👀 {opp.view_count}</span>
                  </div>

                  {/* Investment */}
                  {opp.investment_needed && (
                    <div className="mt-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                      <p className="text-emerald-400 text-sm font-medium">
                        💰 Rp {Number(opp.investment_needed).toLocaleString('id-ID')}
                      </p>
                      <p className="text-emerald-400/60 text-xs">Kebutuhan investasi</p>
                    </div>
                  )}

                  {/* Location */}
                  <p className="text-gray-600 text-xs mt-3">
                    📍 {opp.lokasi?.city || opp.lokasi?.province || opp.lokasi?.address || 'Indonesia'}
                  </p>
                </Link>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.total_halaman > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: pagination.total_halaman }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                  page === pagination.halaman_ini
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
