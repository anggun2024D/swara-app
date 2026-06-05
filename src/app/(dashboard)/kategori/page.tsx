'use client'

import { motion } from 'framer-motion'
import KategoriHero from '@/components/kategori/KategoriHero'
import KategoriCard from '@/components/kategori/KategoriCard'
import { useKategori } from '@/hooks/useKategori'

export default function KategoriPage() {
  const { kategori, isLoading } = useKategori()

  return (
    <div className="min-h-screen">
      <KategoriHero />
      <div className="max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="
            bg-white/90
            backdrop-blur-xl
            rounded-[32px]
            border
            border-border
            shadow-sm
            p-8
          "
        >
          {isLoading ? (
            <div className="grid grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-48 rounded-3xl bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {kategori.map((cat, idx) => (
                <KategoriCard key={cat.id} kategori={cat} index={idx} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}