'use client'

import { motion } from 'framer-motion'
import { MapPin, Sparkles, BarChart3, Share2 } from 'lucide-react'
import Link from 'next/link'

const services = [
  {
    icon: MapPin,
    label: 'Petakan Potensi',
    desc: 'Daftarkan usaha & potensi ekonomi',
    href: '/potensi/baru',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Sparkles,
    label: 'Peta Ekonomi',
    desc: 'Jelajahi potensi di seluruh wilayah',
    href: '/economic-map',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: BarChart3,
    label: 'Insights Ekonomi',
    desc: 'Data & analisis potensi wilayah',
    href: '/economic-insights',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Share2,
    label: 'Peluang & Kolaborasi',
    desc: 'Cari mitra, investor, supplier',
    href: '/opportunities',
    color: 'bg-amber-50 text-amber-600',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function QuickServicesSection() {
  return (
    <section className="relative mt-10 z-20 pb-4">
      <div className="container-premium">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4"
        >
          {services.map((svc) => (
            <motion.div key={svc.label} variants={item} whileHover={{ y: -6 }}>
              <Link href={svc.href}>
                <div className="flex items-center gap-4 bg-white rounded-2xl shadow-card border border-border/50 px-5 py-9 cursor-pointer group hover:shadow-float transition-all duration-300 min-w-[180px]">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${svc.color} group-hover:scale-110`}>
                    <svc.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{svc.label}</p>
                    <p className="text-gray-500 text-xs">{svc.desc}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}