'use client'
 
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Route, Building2, Leaf, Users, Shield, Folder, ArrowRight } from 'lucide-react'
 
// ✅ INTERFACE & LOGIC TIDAK BERUBAH
interface Kategori { id: number; nama: string; icon_url?: string | null }
interface CategoryStat { name: string; count: number; percentage: number }
 
const ICON_MAP: Record<string, React.ElementType> = {
  'sampah': Trash2, 'jalan': Route, 'fasilitas umum': Building2,
  'lingkungan': Leaf, 'pelayanan publik': Users, 'keamanan': Shield,
}
const GRADIENT_MAP: Record<string, string> = {
  'sampah': 'from-green-400 to-emerald-600',
  'jalan': 'from-primary to-emerald-700',
  'fasilitas umum': 'from-purple-400 to-purple-600',
  'lingkungan': 'from-emerald-400 to-teal-600',
  'pelayanan publik': 'from-blue-400 to-blue-600',
  'keamanan': 'from-red-400 to-red-600',
}
 
function getIcon(nama: string): React.ElementType {
  const lower = nama.toLowerCase()
  for (const [key, Icon] of Object.entries(ICON_MAP)) {
    if (lower.includes(key)) return Icon
  }
  return Folder
}
function getGradient(nama: string): string {
  const lower = nama.toLowerCase()
  for (const [key, g] of Object.entries(GRADIENT_MAP)) {
    if (lower.includes(key)) return g
  }
  return 'from-gray-400 to-gray-600'
}
 
export default function CategorySection() {
  // ✅ FETCH LOGIC TIDAK BERUBAH
  const [kategori, setKategori] = useState<Kategori[]>([])
  const [statMap, setStatMap] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)
 
  useEffect(() => {
    const BASE = process.env.NEXT_PUBLIC_API_URL
    fetch(`${BASE}/kategori`)
      .then(r => r.json())
      .then(json => { if (json.success) setKategori(json.data) })
      .catch(console.error)
      .finally(() => setIsLoading(false))
 
    fetch(`${BASE}/stats`)
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          const map: Record<string, number> = {}
          for (const cat of (json.data.category_breakdown as CategoryStat[])) map[cat.name] = cat.count
          setStatMap(map)
        }
      })
      .catch(() => {})
  }, [])
 
  const items = isLoading ? Array.from({ length: 6 }, (_, i) => ({ id: i, nama: '', icon_url: null })) : kategori
 
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
          <path d="M0,0 C480,80 960,80 1440,0 L1440,0 L0,0 Z" fill="#ffffff"/>
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
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-2">Layanan Publik</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold max-w-3xl mx-auto leading-tight mb-6" style={{fontFamily:'Plus Jakarta Sans, sans-serif'}}>Kategori Laporan</h2>
          <p className="text-white/60 mt-4 max-w-xl mx-auto">
            Pilih kategori yang tepat untuk penanganan cepat dan tepat sasaran
          </p>
        </motion.div>
 
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {items.map((cat, idx) => {
            if (isLoading) {
              return (
                <div key={idx} className="rounded-3xl bg-white/10 p-6 text-center animate-pulse">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-white/20 mb-4" />
                  <div className="h-3 bg-white/20 rounded mx-auto w-3/4 mb-2" />
                  <div className="h-2 bg-white/10 rounded mx-auto w-1/2" />
                </div>
              )
            }
 
            const Icon = getIcon(cat.nama)
            const gradient = getGradient(cat.nama)
            const hasImg = cat.icon_url?.startsWith('http')
            const count = statMap[cat.nama] ?? 0
 
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="rounded-3xl bg-white/10 backdrop-blur-sm border border-white/15 p-5 text-center cursor-pointer group hover:bg-white/20 transition-all duration-300"
              >
                <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg overflow-hidden group-hover:scale-110 transition-transform duration-300`}>
                  {hasImg ? (
                    <img src={cat.icon_url!} alt={cat.nama} className="w-8 h-8 object-contain" />
                  ) : (
                    <Icon className="w-6 h-6 text-white" />
                  )}
                </div>
                <h3 className="font-bold text-white text-sm leading-tight">{cat.nama}</h3>
                <p className="text-white/50 text-xs mt-1.5">
                  <span className="font-bold text-gold">{count}</span> laporan
                </p>
              </motion.div>
            )
          })}
        </div>
 
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
        </motion.div>
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