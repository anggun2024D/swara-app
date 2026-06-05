'use client'

import { motion } from 'framer-motion'
import { FileText, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { UserDashboardData } from '@/hooks/useUserDashboard'

interface Props {
  data: UserDashboardData | null
  isLoading: boolean
}

function Skeleton() {
  return (
    <div className="card p-6 flex flex-col items-center gap-3 animate-pulse">
      <div className="w-16 h-16 rounded-2xl bg-gray-100" />
      <div className="h-4 w-20 bg-gray-100 rounded" />
      <div className="h-3 w-16 bg-gray-100 rounded" />
    </div>
  )
}

export default function StatsCards({ data, isLoading }: Props) {
  const stats = [
    // Sesudah
    {
      label: 'Laporan Saya',
      value: data?.totalLaporan ?? 0,
      icon: FileText,
      color: 'blue',
      href: '/riwayat',  // ← ganti ke riwayat
    },
    // Sesudah
    {
      label: 'Selesai',
      value: data?.selesai ?? 0,
      icon: CheckCircle,
      color: 'green',
      href: '/riwayat?status=selesai',  // ← ganti ke riwayat dengan filter selesai
    },
    {
      label: 'Diproses',
      value: data?.diproses ?? 0,
      icon: Clock,
      color: 'orange',
      href: '/riwayat?status=Diproses',
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[0, 1, 2].map(i => <Skeleton key={i} />)}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, idx) => (
        // Sesudah — seluruh card jadi tombol putih yang bisa diklik
<motion.div
  key={stat.label}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: idx * 0.1 }}
>
  <Link href={stat.href}>
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.97 }}
      className="bg-white rounded-2xl p-6 flex flex-col items-center text-center gap-2 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Ikon kotak rounded */}
      <div className="relative mb-1">
        <div className="absolute inset-0 bg-white rounded-2xl border border-gray-100 shadow-sm translate-x-1.5 translate-y-1.5" />
        <div
          className={`relative w-16 h-16 rounded-2xl flex items-center justify-center ${
            stat.color === 'blue'   ? 'bg-blue-500   text-white' :
            stat.color === 'green'  ? 'bg-primary    text-white' :
                                      'bg-orange-500 text-white'
          }`}
        >
          <stat.icon size={28} strokeWidth={1.8} />
        </div>
      </div>

      <p className="text-base font-bold text-text">{stat.label}</p>
      <p className="text-2xl font-extrabold text-text -mt-1">
        {stat.value.toLocaleString('id-ID')}
      </p>
      <span className="text-sm text-muted mt-1">Lihat Detail ›</span>
    </motion.div>
  </Link>
</motion.div>
      ))}
    </div>
  )
}