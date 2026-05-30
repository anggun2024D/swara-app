'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Trash2, Route, Building2, Leaf, Users, Shield, Folder
} from 'lucide-react'
import type { Kategori } from '@/hooks/useKategori'

// Mapping kata kunci dalam nama kategori → icon Lucide
const ICON_MAP: Record<string, React.ElementType> = {
  'sampah':           Trash2,
  'jalan':            Route,
  'fasilitas umum':   Building2,
  'lingkungan':       Leaf,
  'pelayanan publik': Users,
  'keamanan':         Shield,
}

function getIcon(nama: string): React.ElementType {
  const lower = nama.toLowerCase().trim()
  return ICON_MAP[lower] ?? Folder
}

export default function KategoriCard({ kategori, index }: { kategori: Kategori; index: number }) {
  const Icon = getIcon(kategori.nama)

  return (
    <Link href={`/kategori/${kategori.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ y: -5 }}
        className="group relative flex flex-col items-center justify-center py-10 rounded-3xl transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1"
      >
        <div className="w-20 h-20 rounded-3xl bg-primary/5 border border-primary/10 flex items-center justify-center mb-5 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110">
          <Icon size={32} />
        </div>
        <h3 className="font-bold text-text text-xl tracking-tight text-center px-2">
          {kategori.nama}
        </h3>
        <p className="text-sm text-muted mt-2 flex items-center justify-center gap-1 transition-colors group-hover:text-primary">
          Lihat Detail <span className="text-xs">›</span>
        </p>
      </motion.div>
    </Link>
  )
}