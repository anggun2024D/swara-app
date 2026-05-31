'use client'

import { motion } from 'framer-motion'
import { Bell, CheckCircle, Clock, Send, Loader2 } from 'lucide-react'
import { useNotifications } from '@/hooks/useNotifications'
import { timeAgo } from '@/utils/date'
import { useState } from 'react'

export default function NotifikasiPage() {
  const {
    notifikasi,
    belumDibaca,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
  } = useNotifications()

  const [filter, setFilter] = useState<'semua' | 'belum' | 'laporan'>('semua')

  const filtered = notifikasi.filter(n => {
    if (filter === 'belum')   return !n.is_read
    if (filter === 'laporan') return n.tipe === 'status_update' || n.tipe === 'laporan_dibuat'
    return true
  })

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  )

  if (error) return (
    <div className="max-w-3xl mx-auto p-6 text-center text-red-500">
      Gagal memuat notifikasi
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="text-primary" size={24} />
          <h1 className="text-2xl font-extrabold text-text">Notifikasi</h1>
          {belumDibaca > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {belumDibaca}
            </span>
          )}
        </div>
        {belumDibaca > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs font-semibold text-primary bg-primary-light px-3 py-1 rounded-full hover:bg-primary/10 transition"
          >
            Tandai semua dibaca
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 border-b border-border mb-5">
        {(['semua', 'belum', 'laporan'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-semibold transition-all ${
              filter === f ? 'text-primary border-b-2 border-primary' : 'text-muted'
            }`}
          >
            {f === 'semua' ? 'Semua' : f === 'belum' ? 'Belum Dibaca' : 'Update Laporan'}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted">Tidak ada notifikasi</div>
        ) : (
          filtered.map(notif => (
            <NotificationCard
              key={notif.id}
              notif={notif}
              onMarkAsRead={markAsRead}
            />
          ))
        )}
      </div>
    </div>
  )
}

function NotificationCard({
  notif,
  onMarkAsRead,
}: {
  notif: any
  onMarkAsRead: (id: string) => void
}) {
  const isLaporan = notif.tipe === 'status_update' || notif.tipe === 'laporan_dibuat'

  const Icon = isLaporan
    ? (notif.is_read ? CheckCircle : Send)
    : Bell

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`card p-4 cursor-pointer transition-all hover:shadow-md ${
        !notif.is_read ? 'border-l-4 border-l-primary' : ''
      }`}
      onClick={() => !notif.is_read && onMarkAsRead(notif.id)}
    >
      <div className="flex gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isLaporan ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-primary'
        }`}>
          <Icon size={18} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-semibold text-text">{notif.judul}</h4>
            {!notif.is_read && (
              <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-1" />
            )}
          </div>
          <p className="text-sm text-muted mt-1">{notif.pesan}</p>
          <p className="text-xs text-muted mt-2">{timeAgo(notif.dibuat_pada)}</p>
        </div>
      </div>
    </motion.div>
  )
}