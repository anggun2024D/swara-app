'use client'

import { motion } from 'framer-motion'
import { ArrowRight, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-hover"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&h=400&fit=crop')] bg-cover bg-center opacity-10"></div>
      
      <div className="relative z-10 container-premium text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-extrabold max-w-3xl mx-auto">
            Bersama Wujudkan Infrastruktur Lamongan yang Lebih Baik
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mt-4">
            Setiap laporan Anda adalah langkah menuju perubahan nyata.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/laporan">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gold text-amber-900 font-bold rounded-full shadow-lg hover:bg-amber-500 transition-all flex items-center gap-2 mx-auto"
              >
                Mulai Lapor <ArrowRight size={18} />
              </motion.button>
            </Link>
            <Link href="#map">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white/30 transition-all flex items-center gap-2 mx-auto"
              >
                Jelajahi Peta <MapPin size={18} />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Floating particles */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
    </section>
  )
}