'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const testimoni = [
  {
    nama: 'Andi Pratama',
    lokasi: 'Surabaya',
    peran: 'Pemilik UMKM',
    rating: 5,
    komentar: 'Setelah mendaftarkan usaha keripik tempe saya di SWARA, dalam 2 minggu sudah ada 3 investor yang menghubungi. Sekarang usaha saya sudah bisa ekspansi ke 3 kota!',
    avatar: 'AP',
    color: 'bg-emerald-500',
  },
  {
    nama: 'Siti Nurhaliza',
    lokasi: 'Malang',
    peran: 'Petani Organik',
    rating: 5,
    komentar: 'SWARA membantu saya menemukan distributor untuk hasil panen organik. Platform ini sangat memudahkan petani untuk terhubung langsung dengan pasar.',
    avatar: 'SN',
    color: 'bg-blue-500',
  },
  {
    nama: 'Reza Mahendra',
    lokasi: 'Jakarta',
    peran: 'Investor',
    rating: 5,
    komentar: 'Sebagai investor, saya terkesan dengan sistem verifikasi komunitas SWARA. Data potensi ekonomi yang terverifikasi membuat saya lebih percaya diri dalam berinvestasi.',
    avatar: 'RM',
    color: 'bg-purple-500',
  },
  {
    nama: 'Dewi Lestari',
    lokasi: 'Banyuwangi',
    peran: 'Pengelola Wisata',
    rating: 5,
    komentar: 'Desa wisata kami mendapat banyak perhatian setelah terdaftar di SWARA. Kunjungan wisatawan meningkat 40% berkat visibilitas di peta ekonomi!',
    avatar: 'DL',
    color: 'bg-rose-500',
  },
]

export default function TestimoniSection() {
  const [current, setCurrent] = useState(0)
  const total = testimoni.length

  const prev = () => setCurrent((c) => (c - 1 + total) % total)
  const next = () => setCurrent((c) => (c + 1) % total)

  return (
    <section className="py-24 bg-[#f5f7f9] overflow-hidden">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">Suara Pengguna</p>
          <h2 className="section-title">Apa Kata Pelaku Ekonomi?</h2>
          <p className="section-subtitle mt-4">Ribuan pelaku usaha, investor, dan komunitas telah merasakan manfaat SWARA</p>
        </motion.div>

        {/* Main testimonial */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="card-premium p-8 md:p-12 text-center relative"
              >
                <div className="absolute top-8 left-8 opacity-10">
                  <Quote size={48} className="text-primary" />
                </div>

                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={20} className={i < testimoni[current].rating ? 'text-gold fill-gold' : 'text-gray-200'} />
                  ))}
                </div>

                <p className="text-gray-900 text-lg md:text-xl leading-relaxed font-medium mb-8 relative z-10">
                  &quot;{testimoni[current].komentar}&quot;
                </p>

                <div className="flex items-center justify-center gap-4">
                  <div className={`w-12 h-12 ${testimoni[current].color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                    {testimoni[current].avatar}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900">{testimoni[current].nama}</p>
                    <p className="text-gray-500 text-sm">{testimoni[current].peran} • {testimoni[current].lokasi}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-primary hover:bg-primary hover:text-white text-gray-400 flex items-center justify-center transition-all"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-2">
              {testimoni.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current ? 'w-6 h-2.5 bg-primary' : 'w-2.5 h-2.5 bg-gray-200 hover:bg-primary/40'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-primary hover:bg-primary hover:text-white text-gray-400 flex items-center justify-center transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-8 mt-16 pt-12 border-t border-gray-200"
        >
          {[
            { value: '4 Sektor', label: 'Ekonomi Strategis' },
            { value: '4 Level', label: 'Verifikasi Komunitas' },
            { value: '4.9/5', label: 'Rating Pengguna' },
            { value: '90%', label: 'Tingkat Kolaborasi' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-extrabold text-primary">{stat.value}</p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}