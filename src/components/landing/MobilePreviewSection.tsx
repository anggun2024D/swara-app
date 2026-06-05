'use client'

import { motion } from 'framer-motion'
import { Smartphone, MapPin, Users, TrendingUp, CheckCircle } from 'lucide-react'

export default function MobilePreviewSection() {
  return (
    <section className="py-20 bg-[#f5f7f9]">
      <div className="container-premium">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-emerald-100 rounded-full px-4 py-1.5 mb-4">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-600">
                Mobile Experience
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Petakan dari <span className="text-emerald-600">Manapun</span>
            </h2>

            <p className="text-gray-500 text-xl mt-4">
              Aplikasi mobile SWARA memudahkan Anda mendaftarkan potensi ekonomi,
              menjelajahi peta, dan berkolaborasi langsung dari smartphone.
            </p>

            <div className="mt-6 space-y-3 text-gray-700">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald-500" />
                <span>GPS otomatis mendeteksi lokasi usaha</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-emerald-500" />
                <span>Verifikasi komunitas langsung dari aplikasi</span>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <span>Pantau kolaborasi dan peluang real-time</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span>Toggle profil investor kapan saja</span>
              </div>
            </div>

            {/* Download Button */}
            <div className="flex gap-3 mt-8">
              <a
                href="https://drive.google.com/file/d/1RCF_2JlBxnvUjFsOt29yNuj9rQRUStU2/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-gray-800 transition-all duration-300 hover:scale-105"
              >
                <Smartphone className="w-4 h-4 text-white" />
                <span className="text-white text-xs font-semibold">
                  Download APK
                </span>
              </a>
            </div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative flex justify-center"
          >
            <img
              src="/mobile.png"
              alt="SWARA Mobile Preview"
              className="w-64 object-contain drop-shadow-2xl"
            />
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gold/20 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl" />
          </motion.div>

        </div>
      </div>
    </section>
  )
}