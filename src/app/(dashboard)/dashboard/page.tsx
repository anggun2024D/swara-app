'use client'

import { motion } from 'framer-motion'
import HeroSection    from '@/components/dashboard/HeroSection'
import StatsCards     from '@/components/dashboard/StatsCards'
import CategoryGrid   from '@/components/dashboard/CategoryGrid'
import MapSection     from '@/components/dashboard/MapSection'
import UpdatesPanel   from '@/components/dashboard/UpdatesPanel'
import { useUserDashboard } from '@/hooks/useUserDashboard'

export default function DashboardPage() {
  // ← Satu fetch terpusat, semua komponen pakai data yang sama
  const { data, isLoading, error, refetch } = useUserDashboard()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Error banner — non-blocking, user masih bisa lihat halaman */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl
          flex items-center justify-between text-sm text-red-600">
          <span>Gagal memuat data: {error}</span>
          <button
            onClick={refetch}
            className="ml-4 font-semibold underline hover:no-underline"
          >
            Coba lagi
          </button>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* HeroSection ambil nama dari useAuth sendiri */}
        <HeroSection />

        {/* Stats — laporan milik user */}
        <StatsCards data={data} isLoading={isLoading} />

        {/* Kategori + jumlah laporan user per kategori */}
        <CategoryGrid
          kategori={data?.kategori ?? []}
          isLoading={isLoading}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2">
            {/* Peta laporan milik user */}
            <MapSection />
          </div>
          <div>
            {/* Notifikasi terbaru */}
            <UpdatesPanel
              notifikasi={data?.notifikasi ?? []}
              isLoading={isLoading}
              belumDibaca={data?.belumDibaca ?? 0}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}