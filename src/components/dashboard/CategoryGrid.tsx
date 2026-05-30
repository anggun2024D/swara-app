'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Trash2, Route, Building2, Leaf, Users, Shield, Folder
} from 'lucide-react'
import { KategoriItem } from '@/hooks/useUserDashboard'

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

interface Props { kategori: KategoriItem[]; isLoading: boolean }

function Skeleton() {
  return (
    <div className="card p-4 text-center animate-pulse">
      <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-2" />
      <div className="h-3 bg-gray-100 rounded w-3/4 mx-auto mb-1" />
      <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto" />
    </div>
  )
}

export default function CategoryGrid({ kategori, isLoading }: Props) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-text mb-1">Kategori Laporan</h2>
      <p className="text-sm text-muted mb-4">
        Klik pada kategori untuk mulai melaporkan isu spesifik
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {isLoading
          ? [...Array(6)].map((_, i) => <Skeleton key={i} />)
          : kategori.map((cat, idx) => {
              const Icon = getIcon(cat.nama)
              return (
                <Link href={`/kategori/${cat.id}`} key={cat.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="card p-4 text-center cursor-pointer hover:border-primary transition-all"
                  >
                    <div className="w-12 h-12 bg-bg rounded-full flex items-center justify-center mx-auto mb-2 text-primary">
                      <Icon size={24} />
                    </div>
                    <p className="text-sm font-semibold text-text line-clamp-2">{cat.nama}</p>
                    <p className="text-xs text-muted mt-1">{cat.reportCount} laporan</p>
                  </motion.div>
                </Link>
              )
            })}
      </div>
    </div>
  )
}