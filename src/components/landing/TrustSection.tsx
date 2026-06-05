'use client'

import { motion } from 'framer-motion'
import { Shield, Users, TrendingUp, MapPin, CheckCircle2, Sparkles } from 'lucide-react'

const trustItems = [
  { label: 'Potensi Terverifikasi', value: '4 Level', icon: Shield },
  { label: 'Verifikasi Komunitas', value: 'Aktif', icon: Users },
  { label: 'Kolaborasi Terjalin', value: 'Real-time', icon: TrendingUp },
  { label: 'Cakupan Wilayah', value: 'Nasional', icon: MapPin },
]

export default function TrustSection() {
  return (
    <section className="py-20 bg-primary text-white">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm font-semibold">Community Trust System</span>
          </div>
          <h2 className="section-title text-white">Kepercayaan & Transparansi</h2>
          <p className="text-white/80 mt-4 max-w-2xl mx-auto">
            Data diverifikasi oleh komunitas, bukan birokrasi — membangun kepercayaan dari bawah ke atas
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {trustItems.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-3">
                <item.icon className="w-8 h-8 text-gold" />
              </div>
              <p className="text-2xl font-extrabold">{item.value}</p>
              <p className="text-white/70 text-sm">{item.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
            <CheckCircle2 className="w-4 h-4 text-gold" />
            <span className="text-sm">4 Level Verifikasi: Terdaftar → Komunitas → Mitra → Resmi</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
            <CheckCircle2 className="w-4 h-4 text-gold" />
            <span className="text-sm">Badge Reputasi untuk Kontributor Aktif</span>
          </div>
        </div>
      </div>
    </section>
  )
}