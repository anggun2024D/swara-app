'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import api from '@/services/api'
import { useKategori } from '@/hooks/useKategori'
import RiwayatCard from '@/components/riwayat/RiwayatCard'
import EmptyState from '@/components/ui/EmptyState'
import type { Report } from '@/types'

export default function KategoriDetailPage() {
  const { id } = useParams()
  const router = useRouter()

  const { kategori, isLoading: loadingKat } = useKategori()
  const category = kategori.find(c => c.id === Number(id))

  const [reports, setReports]     = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    api
      .get('/laporan', { params: { category_id: id, per_halaman: 'all' } })
      .then(res => {
        const laporan = res.data?.data?.laporan ?? []
        setReports(laporan)
      })
      .catch(() => setReports([]))
      .finally(() => setIsLoading(false))
  }, [id])

  if (!loadingKat && !category) {
    return (
      <EmptyState
        title="Kategori tidak ditemukan"
        description="Kategori yang Anda cari tidak ada"
      />
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-primary font-semibold mb-4 hover:underline"
      >
        <ArrowLeft size={18} /> Kembali
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-text">
            Laporan: {category?.nama ?? '...'}
          </h1>
          <p className="text-muted text-sm">
            {isLoading ? 'Memuat...' : `Total ${reports.length} laporan`}
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <EmptyState
            title="Belum ada laporan"
            description="Belum ada laporan untuk kategori ini"
          />
        ) : (
          <div className="space-y-3">
            {reports.map(report => (
              <RiwayatCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}