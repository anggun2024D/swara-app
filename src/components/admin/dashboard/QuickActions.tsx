'use client'

import { motion } from 'framer-motion'
import { CheckSquare, FileText, Bell, Settings, Users, Download } from 'lucide-react'

const actions = [
  { label: 'Verifikasi Laporan', icon: CheckSquare, color: 'bg-green-100 text-green-600' },
  { label: 'Export Data', icon: Download, color: 'bg-blue-100 text-blue-600' },
  { label: 'Broadcast', icon: Bell, color: 'bg-yellow-100 text-yellow-600' },
  { label: 'Kelola Kategori', icon: Settings, color: 'bg-gray-100 text-gray-600' },
  { label: 'Tambah Admin', icon: Users, color: 'bg-purple-100 text-purple-600' },
  { label: 'Generate Laporan', icon: FileText, color: 'bg-primary-light text-primary' },
]

export default function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-border"
    >
      <h3 className="font-bold text-text mb-4">Aksi Cepat</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((act) => (
          <button key={act.label} className={`flex items-center gap-2 p-3 rounded-xl ${act.color} hover:opacity-80 transition-all text-sm font-medium`}>
            <act.icon size={16} /> {act.label}
          </button>
        ))}
      </div>
    </motion.div>
  )
}