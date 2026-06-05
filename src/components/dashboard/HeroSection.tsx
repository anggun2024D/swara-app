'use client'

import { motion } from 'framer-motion'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function HeroSection() {
  const { user } = useAuth()
  // Fallback rantai: name → "Pengguna" saat loading
  const nama = user?.name ?? 'Pengguna'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-primary-mid mb-8 shadow-lg"
    >
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 p-8 md:p-12">
        <p className="text-white/80 text-sm mb-1">Hai, {nama}!</p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
          Saatnya Suarakan <br className="hidden sm:block" />
          <span className="text-gold">Perubahan</span>
        </h1>
        <p className="text-white/70 max-w-md text-sm mb-6">
          Sampaikan aspirasi dan keluhan di lingkungan sekitarmu secara langsung ke
          pemerintah daerah Lamongan.
        </p>
        <Link href="/laporan">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-gold text-amber-900 font-bold
              px-6 py-2.5 rounded-lg shadow-md hover:bg-amber-500 transition-all"
          >
            <PlusCircle size={18} />
            Buat Laporan Sekarang
          </motion.button>
        </Link>
      </div>

      <img
        src="/lamongan2.png"
        alt="Lamongan"
        className="absolute top-0 right-0 w-63 h-70 opacity-10"
      />
    </motion.div>
  )
}