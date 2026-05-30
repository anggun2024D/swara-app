// app/(dashboard)/riwayat/page.tsx
'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import RiwayatHeader from '@/components/riwayat/RiwayatHeader'
import RiwayatTabs from '@/components/riwayat/RiwayatTabs'
import RiwayatSidebar from '@/components/riwayat/RiwayatSidebar'
import { useRiwayat } from '@/hooks/useRiwayat'

// Tab "dibatalkan" di dummy sebenarnya = "ditolak" di API
type TabKey = 'semua' | 'tersubmit' | 'diverifikasi' | 'diproses' | 'selesai' | 'ditolak'

export default function RiwayatPage() {
  const { reports, isLoading, error, refetch } = useRiwayat()
  const [activeTab, setActiveTab]   = useState<TabKey>('semua')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const matchTab    = activeTab === 'semua' || r.status === activeTab
      const matchSearch = !searchQuery ||
        r.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.lokasi?.address ?? '').toLowerCase().includes(searchQuery.toLowerCase())
      return matchTab && matchSearch
    })
  }, [reports, activeTab, searchQuery])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <RiwayatHeader reports={reports} isLoading={isLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <RiwayatTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              reports={filteredReports}
              isLoading={isLoading}
              error={error}
              onRetry={refetch}
            />
          </div>
          <div>
            <RiwayatSidebar reports={reports} isLoading={isLoading} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}