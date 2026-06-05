'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import api from '@/services/api'
import { useKategori } from '@/hooks/useKategori'
import EmptyState from '@/components/ui/EmptyState'
import type { EconomicResource } from '@/types/resource'

export default function KategoriDetailPage() {
  const { id } = useParams()
  const router = useRouter()

  const { kategori, isLoading: loadingKat } = useKategori()
  const category = kategori.find(c => c.id === Number(id))

  const [resources, setResources] = useState<EconomicResource[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    api
      .get('/resources', { params: { category_id: id, per_halaman: 'all' } })
      .then(res => {
        const data = res.data?.data?.resources ?? []
        setResources(data)
      })
      .catch(() => setResources([]))
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
          <div className="bg-primary border rounded-2xl p-8 shadow-sm">
            <h1 className="text-2xl font-extrabold text-white">
              Potensi: {category?.nama ?? '...'}
            </h1>
            <p className="text-gold text-sm mt-1">
              {isLoading ? 'Memuat...' : `Total ${resources.length} potensi ekonomi`}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : resources.length === 0 ? (
          <EmptyState
            title="Belum ada potensi"
            description="Belum ada potensi ekonomi untuk kategori ini"
          />
        ) : (
          <div className="space-y-3">
            {resources.map(r => (
              <Link key={r.id} href={`/resources/${r.id}`}>
                <div className="bg-white border border-border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-start gap-4">
                    {r.images?.[0] ? (
                      <img src={r.images[0].url} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl bg-gray-100">
                        {r.category?.icon || '📋'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-text truncate">{r.resource_name}</h3>
                      <p className="text-muted text-sm mt-0.5 line-clamp-1">{r.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                        <span className="capitalize">📏 {r.business_scale}</span>
                        <span>⭐ {r.verification_score}</span>
                        <span>📍 {r.lokasi?.city || r.lokasi?.province || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}