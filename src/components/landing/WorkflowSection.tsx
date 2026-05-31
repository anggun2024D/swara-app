'use client'
 
import { motion } from 'framer-motion'
import { Camera, MapPin, Send, CheckCircle2, Wrench, PartyPopper } from 'lucide-react'
 
const steps = [
  {
    step: '01',
    name: 'Foto & Dokumentasi',
    desc: 'Ambil foto bukti kerusakan infrastruktur',
    icon: Camera,
    color: 'bg-blue-500',
    light: 'bg-blue-50',
    textColor: 'text-blue-600',
  },
  {
    step: '02',
    name: 'GPS Terdeteksi',
    desc: 'Lokasi otomatis terisi dari GPS perangkat',
    icon: MapPin,
    color: 'bg-emerald-500',
    light: 'bg-emerald-50',
    textColor: 'text-emerald-600',
  },
  {
    step: '03',
    name: 'Kirim Laporan',
    desc: 'Lengkapi deskripsi dan kirim laporan',
    icon: Send,
    color: 'bg-purple-500',
    light: 'bg-purple-50',
    textColor: 'text-purple-600',
  },
  {
    step: '04',
    name: 'Verifikasi Admin',
    desc: 'Tim verifikator memvalidasi laporan',
    icon: CheckCircle2,
    color: 'bg-amber-500',
    light: 'bg-amber-50',
    textColor: 'text-amber-600',
  },
  {
    step: '05',
    name: 'Ditindaklanjuti',
    desc: 'Petugas lapangan menangani kerusakan',
    icon: Wrench,
    color: 'bg-orange-500',
    light: 'bg-orange-50',
    textColor: 'text-orange-600',
  },
  {
    step: '06',
    name: 'Selesai!',
    desc: 'Infrastruktur berhasil diperbaiki',
    icon: PartyPopper,
    color: 'bg-primary',
    light: 'bg-primary-light',
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
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">Proses Transparan</p>
          <h2 className="section-title">Alur Pelaporan<br />6 Langkah Mudah</h2>
          <p className="section-subtitle mt-4">Dari laporan hingga selesai, semua terpantau secara real-time</p>
        </motion.div>
 
        {/* Desktop timeline */}
        <div className="relative hidden md:block">
          {/* Connector line */}
          <div className="absolute top-10 left-[8%] right-[8%] h-0.5 bg-gradient-to-r from-blue-200 via-emerald-200 via-purple-200 via-amber-200 via-orange-200 to-primary/30 z-0" />
 
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
                {/* Icon circle */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center shadow-lg mb-5 relative`}
                >
                  <step.icon className="w-8 h-8 text-white" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full border-2 border-gray-100 flex items-center justify-center">
                    <span className="text-[9px] font-black text-muted">{step.step}</span>
                  </div>
                </motion.div>
                <p className="font-bold text-text text-sm leading-snug mb-1">{step.name}</p>
                <p className="text-xs text-muted leading-relaxed">{step.desc}</p>
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
                  <step.icon className="w-5 h-5 text-white" />
                </div>
                {idx < steps.length - 1 && (
                  <div className="w-0.5 flex-1 bg-gradient-to-b from-gray-200 to-transparent my-2 min-h-[2rem]" />
                )}
              </div>
              <div className="pb-8 pt-1.5">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-xs font-black ${step.textColor}`}>{step.step}</span>
                  <p className="font-bold text-text text-base">{step.name}</p>
                </div>
                <p className="text-sm text-muted">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}