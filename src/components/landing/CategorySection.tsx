'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface Category {
  id: number
  name: string
  slug: string
  icon: string
  color: string
  description?: string
  resources_count?: number
}

export default function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const BASE = process.env.NEXT_PUBLIC_API_URL
    fetch(`${BASE}/kategori`)
      .then(r => r.json())
      .then(json => {
        if (json.success) setCategories(json.data)
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const fallbackCategories: Category[] = [
    { id: 1, name: 'UMKM & Industri Kreatif', slug: 'umkm', icon: '🏭', color: '#F59E0B', description: 'Usaha Mikro, Kecil, Menengah dan industri kreatif lokal' },
    { id: 2, name: 'Pertanian & Pangan', slug: 'pertanian', icon: '🌾', color: '#10B981', description: 'Sektor pertanian, perkebunan, dan ketahanan pangan' },
    { id: 3, name: 'Perikanan & Peternakan', slug: 'perikanan', icon: '🐟', color: '#3B82F6', description: 'Sektor perikanan, budidaya, dan peternakan' },
    { id: 4, name: 'Pariwisata & Ekonomi Lokal', slug: 'pariwisata', icon: '🏝️', color: '#8B5CF6', description: 'Sektor pariwisata, ekonomi kreatif, dan budaya lokal' },
  ]

  const items = categories.length > 0 ? categories : fallbackCategories

  return (
    <section id="categories" className="py-24 bg-primary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-gold blur-3xl" />
      </div>

      {/* Wave top */}
      <div className="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" className="w-full" preserveAspectRatio="none">
          <path d="M0,0 C480,80 960,80 1440,0 L1440,0 L0,0 Z" fill="#f5f7f9"/>
        </svg>
      </div>

      <div className="container-premium relative z-10 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-2">Sektor Ekonomi</p>
          <h2
            className="text-4xl md:text-5xl font-extrabold max-w-3xl mx-auto leading-tight mb-4 text-white"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            4 Sektor Unggulan
          </h2>
          <p className="text-white/60 mt-2 max-w-xl mx-auto">
            Jelajahi potensi ekonomi Indonesia berdasarkan sektor strategis
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-3xl bg-white/10 p-8 text-center animate-pulse">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 mb-4" />
                <div className="h-4 bg-white/20 rounded mx-auto w-3/4 mb-3" />
                <div className="h-3 bg-white/10 rounded mx-auto w-2/3" />
              </div>
            ))
          ) : (
            items.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Link
                  href={`/opportunities?category=${cat.slug}`}
                  className="block rounded-3xl bg-white/10 backdrop-blur-sm border border-white/15 p-7 text-center cursor-pointer group hover:bg-white/20 transition-all duration-300"
                >
                  <div
                    className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: `${cat.color}30` }}
                  >
                    <span className="text-3xl">{cat.icon}</span>
                  </div>
                  <h3 className="font-bold text-white text-base leading-tight">{cat.name}</h3>
                  <p className="text-white/50 text-sm mt-2 line-clamp-2">{cat.description}</p>
                  {cat.resources_count !== undefined && (
                    <p className="mt-3 text-sm">
                      <span className="font-bold text-gold">{cat.resources_count}</span>
                      <span className="text-white/40 ml-1">potensi</span>
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-center gap-1 text-gold text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Jelajahi <ArrowRight size={14} />
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" className="w-full" preserveAspectRatio="none">
          <path d="M0,80 C360,0 1080,0 1440,80 L1440,80 L0,80 Z" fill="white"/>
        </svg>
      </div>
    </section>
  )
}