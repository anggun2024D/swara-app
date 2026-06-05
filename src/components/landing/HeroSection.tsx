'use client'

import { motion } from 'framer-motion'
import { MapPin, Users, CheckCircle, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { usePublicStats } from '@/hooks/usePublicStats'

function formatNumber(value: number): string {
  return value.toLocaleString('id-ID')
}

export default function HeroSection() {
  const { stats, isLoading } = usePublicStats()

  const statCards = [
    {
      label: 'Total Potensi',
      value: formatNumber(stats?.total_potensi ?? 0),
      icon: MapPin,
      trend: 'terdata',
      color: 'text-emerald-400',
    },
    {
      label: 'Terverifikasi',
      value: formatNumber(stats?.total_terverifikasi ?? 0),
      icon: CheckCircle,
      trend: 'oleh komunitas',
      color: 'text-blue-400',
    },
    {
      label: 'Pengguna Aktif',
      value: formatNumber(stats?.total_pengguna ?? 0),
      icon: Users,
      trend: 'kontributor',
      color: 'text-amber-400',
    },
    {
      label: 'Kolaborasi',
      value: formatNumber(stats?.total_kolaborasi ?? 0),
      icon: TrendingUp,
      trend: 'terjalin',
      color: 'text-rose-400',
    },
  ]

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 z-0">
        {/* Main image */}
        <img
          src="/lamongan.png"
          alt="Indonesia Economic Landscape"
          className="w-full h-full object-cover scale-105"
          style={{ filter: 'brightness(0.45) saturate(1.2)' }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/50 to-transparent" />
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")'}} />
        {/* Floating blobs */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, -8, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute bottom-0 -left-32 w-[500px] h-[500px] rounded-full bg-gold/10 blur-3xl"
        />
      </div>

      {/* Wave bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16 md:h-24">
          <path d="M0,50 C360,100 1080,0 1440,50 L1440,100 L0,100 Z" fill="#f5f7f9"/>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-20 container-premium w-full pt-32 pb-24">
        <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-center">

          {/* LEFT — Text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-2 mb-6"
            >
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium">Platform Aktif — Peta Ekonomi Indonesia</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-5xl md:text-6xl lg:text-7xl xl:text-6xl font-extrabold text-white leading-[1.1] mb-6"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              Memetakan
              <br />
              <span className="text-gold relative inline-block">
                Potensi
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gold/50 rounded-full" />
              </span>
              <br />
              Menghubungkan
              <br />
              Peluang
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="text-white/75 text-[17px] leading-relaxed max-w-lg mb-8"
            >
              SWARA menghubungkan pelaku usaha, investor, dan komunitas melalui pemetaan potensi ekonomi berbasis GIS — UMKM, Pertanian, Perikanan, dan Pariwisata.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              <Link href="/economic-map">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-9 py-4 bg-gold text-amber-950 font-bold rounded-2xl shadow-lg hover:bg-amber-400 transition-all text-base"
                >
                  🗺️ Jelajahi Peta <ArrowRight size={30} />
                </motion.button>
              </Link>
              <Link href="/opportunities">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-7 py-4 bg-white/15 backdrop-blur-sm border border-white/30 text-white font-bold rounded-2xl hover:bg-white/25 transition-all text-base"
                >
                  🌟 Lihat Peluang
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-6 mt-10 pt-8 border-t border-white/15"
            >
              {[
                { label: '4 Sektor', sub: 'Ekonomi' },
                { label: 'Real-time', sub: 'Verifikasi' },
                { label: 'Kolaborasi', sub: 'Langsung' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <p className="text-white font-bold text-lg leading-none">{item.label}</p>
                  <p className="text-white/60 text-xs mt-0.5">{item.sub}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT — Floating analytics cards */}
          <div className="hidden lg:flex flex-col gap-3 relative ml-auto max-w-[400px]">
            {/* Main large card */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-float"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/80 text-sm font-medium">Statistik Ekonomi</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-emerald-400 text-xs font-medium">LIVE</span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {statCards.map((card, idx) => (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <card.icon className={`w-4 h-4 ${card.color}`} />
                      <span className={`text-[10px] font-semibold ${card.color}`}>{card.trend}</span>
                    </div>
                    {isLoading ? (
                      <div className="h-7 w-16 bg-white/20 rounded-lg animate-pulse" />
                    ) : (
                      <p className="text-white font-extrabold text-xl leading-none">{card.value}</p>
                    )}
                    <p className="text-white/60 text-xs mt-1">{card.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-1"
      >
        <p className="text-white/50 text-xs font-medium tracking-widest uppercase">Scroll</p>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}