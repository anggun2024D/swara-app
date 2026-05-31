'use client'

import { motion } from 'framer-motion'
import { Smartphone, MapPin, Bell, CheckCircle } from 'lucide-react'

export default function MobilePreviewSection() {
  return (
    <section className="py-20 bg-bg">
      <div className="container-premium">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-light rounded-full px-4 py-1.5 mb-4">
              <Smartphone className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Mobile Experience</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-text">
              Laporkan dari <span className="text-primary">Manapun</span>
            </h2>
            <p className="text-muted text-lg mt-4">
              Aplikasi mobile SWARA memudahkan Anda melaporkan infrastruktur rusak langsung dari lokasi kejadian.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span>GPS otomatis mendeteksi lokasi</span>
              </div>
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-primary" />
                <span>Notifikasi real-time status laporan</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>Tracking progress hingga selesai</span>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <div className="bg-black rounded-xl px-4 py-2 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-white" />
                <span className="text-white text-xs font-semibold">App Store</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative flex justify-center"
          >
            <div className="relative w-64 h-[500px] bg-black rounded-3xl shadow-2xl overflow-hidden border-4 border-gray-800">
              <div className="absolute top-0 left-0 right-0 h-8 bg-black rounded-t-3xl"></div>
              <div className="pt-8 px-3 bg-white h-full">
                <div className="bg-primary rounded-xl p-3 text-white mb-3">
                  <p className="text-xs font-semibold">Laporan Terbaru</p>
                  <p className="text-sm font-bold">Jalan Rusak</p>
                  <p className="text-[10px] opacity-80">Jl. Sudirman • 2 menit lalu</p>
                </div>
                <div className="bg-gray-100 rounded-xl p-3 mb-3">
                  <div className="flex justify-between text-xs">
                    <span>Status</span>
                    <span className="text-yellow-500 font-semibold">Diproses</span>
                  </div>
                  <div className="h-1 bg-gray-300 rounded-full mt-2 overflow-hidden">
                    <div className="w-2/3 h-full bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
                <div className="bg-primary-light rounded-xl p-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-xs">Lokasi terdeteksi</span>
                </div>
              </div>
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gold/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}