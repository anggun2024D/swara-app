'use client'
 
import { motion } from 'framer-motion'
import { Satellite, GitMerge, Camera, Map, LayoutDashboard, Bell } from 'lucide-react'
 
const features = [
  {
    title: 'GPS Otomatis',
    description: 'Lokasi terdeteksi secara presisi melalui GPS perangkat Anda. Tidak perlu input manual — sistem langsung mencatat koordinat laporan.',
    icon: Satellite,
    badge: '01 — Lokasi',
    side: 'left',
  },
  {
    title: 'Real-time Monitoring',
    description: 'Pantau seluruh laporan dari berbagai kecamatan dalam satu tampilan peta interaktif yang diperbarui secara langsung.',
    icon: GitMerge,
    badge: '02 — Monitoring',
    side: 'right',
  },
  {
    title: 'Validasi Foto Bukti',
    description: 'Setiap laporan didukung foto yang terverifikasi dengan metadata lokasi dan waktu untuk memastikan keabsahan.',
    icon: Camera,
    badge: '03 — Validasi',
    side: 'left',
  },
  {
    title: 'Peta Persebaran',
    description: 'Visualisasi titik-titik kerusakan infrastruktur di seluruh wilayah Lamongan dalam format peta yang mudah dibaca.',
    icon: Map,
    badge: '04 — Visualisasi',
    side: 'right',
  },
  {
    title: 'Dashboard Analitik',
    description: 'Panel kontrol lengkap untuk pemerintah dengan grafik kinerja, tren laporan, dan metrik penanganan.',
    icon: LayoutDashboard,
    badge: '05 — Analitik',
    side: 'left',
  },
  {
    title: 'Notifikasi Otomatis',
    description: 'Pelapor mendapat update langsung setiap ada perubahan status — dari verifikasi hingga selesai ditangani.',
    icon: Bell,
    badge: '06 — Notifikasi',
    side: 'right',
  },
]
 
export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-bg overflow-hidden">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">Platform Fitur</p>
          <h2 className="section-title">Teknologi untuk<br />Pelaporan Lebih Baik</h2>
          <p className="section-subtitle mt-4">Fitur-fitur canggih yang memastikan setiap laporan ditangani secara efektif</p>
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
                  idx % 3 === 0 ? 'bg-primary-light' : idx % 3 === 1 ? 'bg-amber-50' : 'bg-blue-50'
                }`}>
                  {/* Decorative ring */}
                  <div className="absolute inset-4 rounded-2xl border-2 border-dashed border-current opacity-10" />
                  <feature.icon className={`w-20 h-20 ${
                    idx % 3 === 0 ? 'text-primary' : idx % 3 === 1 ? 'text-amber-500' : 'text-blue-500'
                  }`} strokeWidth={1.2} />
                  {/* Badge */}
                  <div className="absolute -top-3 -right-3 bg-white rounded-full px-3 py-1 shadow-card border border-border text-xs font-bold text-muted">
                    {feature.badge}
                  </div>
                </div>
              </div>
 
              {/* Text side */}
              <div className="flex-1">
                <div className="max-w-lg">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-text mb-4" style={{fontFamily:'Plus Jakarta Sans,sans-serif'}}>
                    {feature.title}
                  </h3>
                  <p className="text-muted text-lg leading-relaxed">
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