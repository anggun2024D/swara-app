'use client'

import { motion } from 'framer-motion'
import { Calendar, Shield } from 'lucide-react'

export default function WelcomeBanner() {
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-gradient-to-r from-primary to-primary-hover rounded-[32px] p-8 min-h-[220px] text-white shadow-xl"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Selamat datang, Admin</h1>
          <p className="text-white/80 mt-1">Platform Monitoring Infrastruktur Kabupaten Lamongan</p>
          <div className="flex items-center gap-3 mt-3 text-sm">
            <div className="flex items-center gap-1"><Calendar size={14} /> {today}</div>
            <div className="flex items-center gap-1"><Shield size={14} /> Sistem Real-time Aktif</div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-1.5 text-xs font-semibold flex items-center gap-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          Live Data
        </div>
      </div>
    </motion.div>
  )
}