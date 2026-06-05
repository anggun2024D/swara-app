'use client'

import { motion } from 'framer-motion'
import { ArrowRight, MapPin, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-hover to-emerald-900" />

      {/* Wave top */}
      <div className="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" className="w-full" preserveAspectRatio="none">
          <path d="M0,0 C360,80 1080,80 1440,0 L1440,0 L0,0 Z" fill="#ffffff"/>
        </svg>
      </div>

      {/* Decorations */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full border border-white/10"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full border-2 border-white/5"
      />
      <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-gold/10 blur-2xl" />
      <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-emerald-300/10 blur-2xl" />

      <div className="relative z-10 container-premium text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
            <span className="text-sm font-medium">Bergabunglah dengan pelaku ekonomi Indonesia</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold max-w-3xl mx-auto leading-tight mb-6" style={{fontFamily:'Plus Jakarta Sans, sans-serif'}}>
            Petakan Potensi
            <span className="text-gold"> Ekonomimu</span>
            <br />Sekarang
          </h2>

          <p className="text-white/70 text-lg max-w-xl mx-auto mb-4">
            Setiap potensi yang Anda daftarkan membuka peluang kolaborasi dan investasi dari seluruh Indonesia.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {['Gratis & Mudah', 'Langsung Aktif', 'Verifikasi Komunitas', 'Peluang Investasi'].map((f) => (
              <div key={f} className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 text-sm">
                <CheckCircle size={13} className="text-gold" />
                {f}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-4 bg-gold text-amber-950 font-bold rounded-2xl shadow-xl hover:bg-amber-400 transition-all text-base mx-auto"
              >
                Daftar & Mulai Petakan <ArrowRight size={18} />
              </motion.button>
            </Link>
            <Link href="/economic-map">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-4 bg-white/15 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/25 hover:bg-white/25 transition-all text-base mx-auto"
              >
                <MapPin size={18} /> Jelajahi Peta Ekonomi
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}