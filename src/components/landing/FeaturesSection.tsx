'use client'

import { motion } from 'framer-motion'
import { Satellite, GitPullRequest, Camera, Map, LayoutDashboard, Bell } from 'lucide-react'

const features = [
  { title: 'GPS Otomatis', description: 'Lokasi terdeteksi otomatis melalui perangkat Anda', icon: Satellite, color: 'text-blue-600' },
  { title: 'Tracking Real-time', description: 'Pantau status laporan Anda kapan saja', icon: GitPullRequest, color: 'text-green-600' },
  { title: 'Validasi Foto', description: 'Foto dilengkapi metadata waktu dan lokasi', icon: Camera, color: 'text-purple-600' },
  { title: 'Peta Interaktif', description: 'Visualisasi sebaran laporan di seluruh wilayah', icon: Map, color: 'text-red-600' },
  { title: 'Dashboard Monitoring', description: 'Analitik lengkap untuk pemerintah', icon: LayoutDashboard, color: 'text-amber-600' },
  { title: 'Notifikasi Otomatis', description: 'Update status laporan via notifikasi', icon: Bell, color: 'text-primary' },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Fitur Unggulan</h2>
          <p className="section-subtitle mt-4">Teknologi canggih untuk pelaporan infrastruktur yang akurat</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="card-premium p-6 group"
            >
              <div className={`w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-4 group-hover:bg-primary transition-colors`}>
                <feature.icon className={`w-6 h-6 ${feature.color} group-hover:text-white transition-colors`} />
              </div>
              <h3 className="font-bold text-text text-lg mb-2">{feature.title}</h3>
              <p className="text-muted text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}