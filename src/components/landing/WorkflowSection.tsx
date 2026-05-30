'use client'

import { motion } from 'framer-motion'
import { Camera, MapPin, Send, CheckCircle, Wrench, Flag } from 'lucide-react'

const steps = [
  { name: 'Ambil Foto', icon: Camera, color: 'bg-blue-500' },
  { name: 'GPS Terdeteksi', icon: MapPin, color: 'bg-emerald-500' },
  { name: 'Kirim Laporan', icon: Send, color: 'bg-purple-500' },
  { name: 'Diverifikasi Admin', icon: CheckCircle, color: 'bg-amber-500' },
  { name: 'Ditindaklanjuti', icon: Wrench, color: 'bg-orange-500' },
  { name: 'Selesai', icon: Flag, color: 'bg-green-500' },
]

export default function WorkflowSection() {
  return (
    <section className="py-20 bg-bg">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Alur Pelaporan</h2>
          <p className="section-subtitle mt-4">Proses cepat dan transparan dari laporan hingga tindak lanjut</p>
        </motion.div>

        <div className="relative">
          {/* Timeline Connector */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 hidden lg:block"></div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {steps.map((step, idx) => (
              <motion.div
                key={step.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center shadow-lg mb-3`}>
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <p className="font-bold text-text text-sm">{step.name}</p>
                <p className="text-xs text-muted mt-1">Langkah {idx + 1}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}