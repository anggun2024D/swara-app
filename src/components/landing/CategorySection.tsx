'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Route, Building2, Leaf, Users, Shield, Folder } from 'lucide-react'

interface Kategori {
  id: number
  nama: string
  icon_url?: string | null
}

interface CategoryStat {
  name: string
  count: number
  percentage: number
}

const ICON_MAP: Record<string, React.ElementType> = {
  'sampah':           Trash2,
  'jalan':            Route,
  'fasilitas umum':   Building2,
  'lingkungan':       Leaf,
  'pelayanan publik': Users,
  'keamanan':         Shield,
}

const COLOR_MAP: Record<string, string> = {
  'sampah':           'text-green-600',
  'jalan':            'text-primary',
  'fasilitas umum':   'text-purple-500',
  'lingkungan':       'text-emerald-500',
  'pelayanan publik': 'text-blue-500',
  'keamanan':         'text-red-500',
}

function getIcon(nama: string): React.ElementType {
  const lower = nama.toLowerCase()
  for (const [key, Icon] of Object.entries(ICON_MAP)) {
    if (lower.includes(key)) return Icon
  }
  return Folder
}

function getColor(nama: string): string {
  const lower = nama.toLowerCase()
  for (const [key, color] of Object.entries(COLOR_MAP)) {
    if (lower.includes(key)) return color
  }
  return 'text-gray-500'
}

export default function CategorySection() {
  const [kategori, setKategori]   = useState<Kategori[]>([])
  const [statMap, setStatMap]     = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const BASE = process.env.NEXT_PUBLIC_API_URL

    // Fetch kategori — tidak bergantung ke stats
    fetch(`${BASE}/kategori`)
      .then(r => r.json())
      .then(json => { if (json.success) setKategori(json.data) })
      .catch(console.error)
      .finally(() => setIsLoading(false))

    // Fetch stats publik — untuk count per kategori (nama-based)
    fetch(`${BASE}/stats`)
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          const map: Record<string, number> = {}
          for (const cat of (json.data.category_breakdown as CategoryStat[])) {
            map[cat.name] = cat.count
          }
          setStatMap(map)
        }
      })
      .catch(() => {}) // silent fail
  }, [])

  const items = isLoading
    ? Array.from({ length: 6 }, (_, i) => ({ id: i, nama: '', icon_url: null }))
    : kategori

  return (
    <section id="categories" className="py-20 bg-white">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Kategori Layanan</h2>
          <p className="section-subtitle mt-4">
            Pilih kategori laporan yang sesuai untuk penanganan cepat
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {items.map((cat, idx) => {
            if (isLoading) {
              return (
                <div key={idx} className="card-premium p-6 text-center animate-pulse">
                  <div className="w-14 h-14 mx-auto rounded-full bg-gray-200 mb-4" />
                  <div className="h-3 bg-gray-200 rounded mx-auto w-3/4 mb-2" />
                  <div className="h-2 bg-gray-100 rounded mx-auto w-1/2" />
                </div>
              )
            }

            const Icon      = getIcon(cat.nama)
            const iconColor = getColor(cat.nama)
            const hasImg    = cat.icon_url?.startsWith('http')
            // Match nama kategori ke stats (case-insensitive)
            const count     = statMap[cat.nama] ?? 0

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="card-premium p-6 text-center cursor-pointer group"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-primary-light flex items-center justify-center mb-4 group-hover:bg-primary transition-colors overflow-hidden">
                  {hasImg ? (
                    <img src={cat.icon_url!} alt={cat.nama} className="w-8 h-8 object-contain" />
                  ) : (
                    <Icon className={`w-7 h-7 ${iconColor} group-hover:text-white transition-colors`} />
                  )}
                </div>
                <h3 className="font-bold text-text text-sm leading-tight">{cat.nama}</h3>
                <p className="text-xs text-muted mt-1">{count} laporan</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}