'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, CheckCircle, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { usePublicStats } from '@/hooks/usePublicStats'

function formatNumber(value: number): string {
  return value.toLocaleString('id-ID')
}

export default function HeroSection() {
  const { stats, isLoading } = usePublicStats()

  const statCards = [
    {
      label: 'Total Laporan',
      // Dari field: total
      value: formatNumber(stats?.total ?? 0),
      icon: MapPin,
      trend: `+${stats?.tersubmit ?? 0} baru`,
    },
    {
      label: 'Selesai Ditangani',
      // Dari field: selesai
      value: formatNumber(stats?.selesai ?? 0),
      icon: CheckCircle,
      trend: `${stats?.completion_rate ?? 0}% rate`,
    },
    {
      label: 'Sedang Diproses',
      // Dari field: diproses
      value: formatNumber(stats?.diproses ?? 0),
      icon: Clock,
      trend: 'aktif',
    },
    {
      label: 'Completion Rate',
      // Dari field: completion_rate
      value: `${stats?.completion_rate ?? 0}%`,
      icon: TrendingUp,
      trend: 'laporan selesai',
    },
  ]

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-10" />
        <img
          src="https://www.nativeindonesia.com/foto/2024/07/masjid-namira-lamongan-jawa-timur.jpg"
          alt="Aerial city infrastructure"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Floating Analytics Cards */}
      <div className="absolute top-32 right-8 z-20 hidden lg:flex flex-col gap-3">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/90 backdrop-blur-md rounded-xl p-3 w-48 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <stat.icon className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-green-600">{stat.trend}</span>
            </div>

            {isLoading ? (
              <div className="mt-1 h-8 w-20 bg-gray-200 rounded animate-pulse" />
            ) : (
              <p className="text-2xl font-extrabold text-text mt-1">{stat.value}</p>
            )}

            <p className="text-xs text-muted">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-20 container-premium text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight max-w-4xl mx-auto">
            Laporkan Infrastruktur Rusak{' '}
            <span className="text-gold">Secara Real-Time</span>
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto mt-6">
            SWARA menghubungkan masyarakat Kabupaten Lamongan dengan pemerintah melalui sistem pelaporan berbasis GPS dan peta interaktif.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/laporan">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gold text-amber-900 font-bold rounded-full shadow-lg hover:bg-amber-500 transition-all"
              >
                Laporkan Sekarang
              </motion.button>
            </Link>
            <Link href="#map">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white/30 transition-all"
              >
                Jelajahi Peta
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-white/70 rounded-full mt-2 animate-pulse" />
        </div>
      </motion.div>
    </section>
  )
}