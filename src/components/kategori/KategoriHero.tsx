'use client'

import { motion } from 'framer-motion'

export default function KategoriHero() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl shadow-lg min-h-[250px]"
      >
        {/* Background Image */}
        <img
          src="/lamongan2.png"
          alt="Lamongan"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary-mid/60" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center h-[250px] p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gold mb-2">
            Kategori Laporan
          </h1>

          <p className="text-white/80 text-sm md:text-base max-w-lg">
            Pilih kategori yang sesuai untuk memastikan laporan Anda
            ditangani oleh tim yang tepat secepat mungkin.
          </p>
        </div>
      </motion.div>
    </div>
  )
}