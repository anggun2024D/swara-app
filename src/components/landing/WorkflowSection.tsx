'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    step: '01',
    name: 'Daftarkan Potensi',
    desc: 'Tambahkan usaha atau potensi ekonomi dengan foto, lokasi GPS, dan deskripsi',
    icon: '📝',
    color: 'bg-blue-500',
    textColor: 'text-blue-600',
  },
  {
    step: '02',
    name: 'Langsung Aktif',
    desc: 'Potensi langsung tampil di peta ekonomi tanpa menunggu review admin',
    icon: '🗺️',
    color: 'bg-emerald-500',
    textColor: 'text-emerald-600',
  },
  {
    step: '03',
    name: 'Verifikasi Komunitas',
    desc: 'Pengguna lain memverifikasi, memberi rating, dan mengulas potensi Anda',
    icon: '✅',
    color: 'bg-purple-500',
    textColor: 'text-purple-600',
  },
  {
    step: '04',
    name: 'Naik Level',
    desc: 'Dari Terdaftar → Terverifikasi Komunitas → Terverifikasi Mitra',
    icon: '📈',
    color: 'bg-amber-500',
    textColor: 'text-amber-600',
  },
  {
    step: '05',
    name: 'Kolaborasi',
    desc: 'Dapatkan investor, distributor, supplier, atau mitra bisnis',
    icon: '🤝',
    color: 'bg-pink-500',
    textColor: 'text-pink-600',
  },
  {
    step: '06',
    name: 'Berkembang!',
    desc: 'Usaha tumbuh melalui jejaring ekonomi SWARA',
    icon: '🚀',
    color: 'bg-primary',
    textColor: 'text-primary',
  },
]

export default function WorkflowSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">Cara Kerja</p>
          <h2 className="section-title">Alur Platform<br />6 Langkah Mudah</h2>
          <p className="section-subtitle mt-4">Dari pendaftaran potensi hingga kolaborasi bisnis, semua transparan</p>
        </motion.div>

        {/* Desktop timeline */}
        <div className="relative hidden md:block">
          <div className="absolute top-10 left-[8%] right-[8%] h-0.5 bg-gradient-to-r from-blue-200 via-emerald-200 via-purple-200 via-amber-200 via-pink-200 to-primary/30 z-0" />

          <div className="grid grid-cols-6 gap-4 relative z-10">
            {steps.map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center shadow-lg mb-5 relative`}
                >
                  <span className="text-3xl">{step.icon}</span>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full border-2 border-gray-100 flex items-center justify-center">
                    <span className="text-[9px] font-black text-gray-500">{step.step}</span>
                  </div>
                </motion.div>
                <p className="font-bold text-gray-900 text-sm leading-snug mb-1">{step.name}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="md:hidden space-y-0">
          {steps.map((step, idx) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              viewport={{ once: true }}
              className="flex gap-5"
            >
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                  <span className="text-xl">{step.icon}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className="w-0.5 flex-1 bg-gradient-to-b from-gray-200 to-transparent my-2 min-h-[2rem]" />
                )}
              </div>
              <div className="pb-8 pt-1.5">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-xs font-black ${step.textColor}`}>{step.step}</span>
                  <p className="font-bold text-gray-900 text-base">{step.name}</p>
                </div>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}