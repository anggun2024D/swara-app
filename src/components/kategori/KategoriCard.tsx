'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Trash2, Route, Building2, Leaf, Users, Shield, Folder,
  Headphones
} from 'lucide-react'
import type { Kategori } from '@/hooks/useKategori'

// Mapping kata kunci dalam nama kategori → icon Lucide
const ICON_MAP: Record<string, React.ElementType> = {
  'sampah':           Trash2,
  'jalan':            Route,
  'fasilitas umum':   Building2,
  'lingkungan':       Leaf,
  'pelayanan publik': Headphones,
  'keamanan':         Shield,
}

const IMAGE_MAP: Record<string, string> = {
  'sampah':           '/sampah.jpeg',
  'jalan':            '/jalanrusak.jpg',
  'fasilitas umum':   '/fasilitasumum.webp',
  'lingkungan':       '/lingkungan.jpeg',
  'pelayanan publik': '/pelayananpublik.jpg',
  'keamanan':         '/keamanan.jpeg',
}


function getIcon(nama: string): React.ElementType {
  const lower = nama.toLowerCase().trim()
  return ICON_MAP[lower] ?? Folder
}

function getImage(nama: string): string {
  const lower = nama.toLowerCase().trim()
  return IMAGE_MAP[lower] ?? "/default.png"
}

export default function KategoriCard({ kategori, index }: { kategori: Kategori; index: number }) {
  const Icon  = getIcon(kategori.nama)
  const image = getImage(kategori.nama)

  return (
    <Link href={`/kategori/${kategori.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
        className="group relative flex flex-col items-center rounded-2xl bg-white shadow-md overflow-hidden transition-all duration-300 cursor-pointer"
      >
        {/* Gambar Ilustrasi Atas */}
        <div className="w-full h-44 overflow-hidden">
          <img
            src={image}
            alt={kategori.nama}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Icon Bulat — overlap antara gambar dan teks */}
        <div className="relative w-full flex justify-center" style={{ marginTop: '-28px' }}>
          <div className="w-14 h-14 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-600 z-10">
            <Icon size={24} />
          </div>
        </div>

        {/* Nama Kategori */}
        <div className="px-4 pb-5 pt-3 text-center">
          <h3 className="font-semibold text-gray-800 text-base tracking-tight">
            {kategori.nama}
          </h3>
        </div>
      </motion.div>
    </Link>
  )
}