'use client'

import { motion } from 'framer-motion'
import { MapPin, CheckCircle, Clock, Users } from 'lucide-react'
import Link from 'next/link'

const floatingCards = [
  { icon: CheckCircle, text: 'Laporan Selesai', subtext: 'Jalan Rusak Diperbaiki', color: 'text-green-500' },
  { icon: Clock, text: 'Diproses', subtext: 'Lampu Jalan Mati', color: 'text-yellow-500' },
  { icon: Users, text: 'Warga Aktif', subtext: '1,284 laporan', color: 'text-primary' },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Section - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary via-primary-mid to-primary-dark overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <MapPin className="w-5 h-5 text-gold" />
            </div>
            <span className="text-2xl font-extrabold text-white tracking-wide">SWARA</span>
          </Link>

          {/* Main Content */}
          <div className="max-w-md">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-extrabold text-white leading-tight"
            >
              Saatnya Suarakan <span className="text-gold">Perubahan</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/70 mt-4"
            >
              Sampaikan aspirasi dan keluhan Anda langsung ke pemerintah daerah melalui platform digital yang transparan.
            </motion.p>
          </div>

          {/* Floating Cards */}
          <div className="space-y-3">
            {floatingCards.map((card, idx) => (
              <motion.div
                key={card.text}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                whileHover={{ x: 5 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-3 flex items-center gap-3 w-64"
              >
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{card.text}</p>
                  <p className="text-white/60 text-xs">{card.subtext}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-white/40 text-xs">
            <p>Platform Smart Governance • Kabupaten Lamongan</p>
          </div>
        </div>
      </div>

      {/* Right Section - Auth Card */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}