'use client'

import { motion } from 'framer-motion'
import { MapPin, Users, BarChart3, Globe, Share2, Shield } from 'lucide-react'

const features = [
  {
    title: 'Pemetaan GIS',
    description: 'Setiap potensi ekonomi dicatat dengan koordinat GPS presisi. Visualisasi peta interaktif menampilkan distribusi UMKM, pertanian, perikanan, dan pariwisata di seluruh Indonesia.',
    icon: MapPin,
    badge: '01 — Peta',
    side: 'left',
  },
  {
    title: 'Verifikasi Komunitas',
    description: 'Validasi data dilakukan oleh masyarakat — bukan birokrasi. Sistem 4 level verifikasi membangun kepercayaan melalui dukungan, ulasan, dan rating dari pengguna lain.',
    icon: Users,
    badge: '02 — Trust',
    side: 'right',
  },
  {
    title: 'Economic Intelligence',
    description: 'Dashboard analitik menampilkan tren pertumbuhan ekonomi, distribusi potensi per wilayah, heatmap aktivitas, dan rekomendasi berbasis data.',
    icon: BarChart3,
    badge: '03 — Analitik',
    side: 'left',
  },
  {
    title: 'Peluang Terbuka',
    description: 'Papan peluang menampilkan usaha yang membutuhkan investor, distributor, supplier, atau mitra bisnis. Filter berdasarkan sektor, wilayah, dan skala usaha.',
    icon: Globe,
    badge: '04 — Peluang',
    side: 'right',
  },
  {
    title: 'Kolaborasi Langsung',
    description: 'Hubungkan pelaku usaha dengan investor dan mitra potensial secara langsung. Ajukan kolaborasi, negosiasi, dan bangun kemitraan strategis.',
    icon: Share2,
    badge: '05 — Koneksi',
    side: 'left',
  },
  {
    title: 'Platform Aman',
    description: 'Sistem reputasi berbasis aktivitas, badge Community Contributor, dan moderasi aktif menjaga kualitas data dan kepercayaan ekosistem.',
    icon: Shield,
    badge: '06 — Keamanan',
    side: 'right',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-[#f5f7f9] overflow-hidden">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">Fitur Platform</p>
          <h2 className="section-title">Teknologi untuk<br />Ekonomi Lebih Baik</h2>
          <p className="section-subtitle mt-4">Fitur-fitur canggih yang menghubungkan potensi dengan peluang</p>
        </motion.div>

        <div className="space-y-16 md:space-y-24">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className={`flex flex-col ${feature.side === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-16`}
            >
              {/* Illustration side */}
              <div className="flex-shrink-0 w-full md:w-80">
                <div className={`relative rounded-3xl p-10 flex items-center justify-center ${
                  idx % 3 === 0 ? 'bg-emerald-50' : idx % 3 === 1 ? 'bg-amber-50' : 'bg-blue-50'
                }`}>
                  <div className="absolute inset-4 rounded-2xl border-2 border-dashed border-current opacity-10" />
                  <feature.icon className={`w-20 h-20 ${
                    idx % 3 === 0 ? 'text-emerald-600' : idx % 3 === 1 ? 'text-amber-500' : 'text-blue-500'
                  }`} strokeWidth={1.2} />
                  <div className="absolute -top-3 -right-3 bg-white rounded-full px-3 py-1 shadow-md border border-gray-100 text-xs font-bold text-gray-500">
                    {feature.badge}
                  </div>
                </div>
              </div>

              {/* Text side */}
              <div className="flex-1">
                <div className="max-w-lg">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4" style={{fontFamily:'Plus Jakarta Sans,sans-serif'}}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-primary font-semibold text-sm">
                    <div className="w-6 h-0.5 bg-primary rounded" />
                    Pelajari lebih lanjut
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}