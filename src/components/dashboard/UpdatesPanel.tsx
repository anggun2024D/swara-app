'use client'

import { motion } from 'framer-motion'
import { Bell, ChevronRight, CheckCircle, Clock, XCircle, FileText } from 'lucide-react'
import Link from 'next/link'
import { NotifItem } from '@/hooks/useUserDashboard'

interface Props {
  notifikasi: NotifItem[]
  isLoading: boolean
  belumDibaca: number
}

// Warna & icon per tipe notifikasi
function tipeConfig(tipe: string) {
  switch (tipe) {
    case 'status_update':
      return { color: 'blue',   Icon: Clock,         label: 'UPDATE' }
    case 'laporan_baru':
    case 'laporan_dibuat':
      return { color: 'green',  Icon: FileText,       label: 'LAPORAN' }
    default:
      return { color: 'yellow', Icon: Bell,           label: 'INFO' }
  }
}

function Skeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="h-2 bg-gray-100 w-full" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  )
}

export default function UpdatesPanel({ notifikasi, isLoading, belumDibaca }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-extrabold text-text">SWARA Updates</h3>
          {belumDibaca > 0 && (
            <span className="text-[10px] font-bold bg-red-500 text-white
              px-1.5 py-0.5 rounded-full leading-none">
              {belumDibaca}
            </span>
          )}
        </div>
        <Link href="/notifikasi" className="text-xs font-bold text-primary hover:underline">
          Lihat Semua
        </Link>
      </div>

      <div className="space-y-3">
        {isLoading && [...Array(3)].map((_, i) => <Skeleton key={i} />)}

        {!isLoading && notifikasi.length === 0 && (
          <div className="card p-6 text-center text-muted text-sm">
            <Bell size={24} className="mx-auto mb-2 opacity-30" />
            Belum ada notifikasi
          </div>
        )}

        {!isLoading &&
          notifikasi.map((notif, idx) => {
            const { color, Icon, label } = tipeConfig(notif.tipe)
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.08 }}
                className={`card overflow-hidden hover:shadow-md transition-shadow
                  ${!notif.is_read ? 'border-l-2 border-l-primary' : ''}`}
              >
                {/* Top accent bar */}
                <div
                  className={`h-1 w-full ${
                    color === 'blue'   ? 'bg-blue-400'   :
                    color === 'green'  ? 'bg-green-400'  :
                                        'bg-amber-400'
                  }`}
                />

                <div className="p-3">
                  {/* Badge tipe */}
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold
                      px-2 py-0.5 rounded mb-1.5 ${
                        color === 'blue'   ? 'bg-blue-50 text-blue-700'   :
                        color === 'green'  ? 'bg-green-50 text-green-700' :
                                            'bg-amber-50 text-amber-700'
                      }`}
                  >
                    <Icon size={10} />
                    {label}
                  </span>

                  <h4 className="font-bold text-sm text-text line-clamp-2 mb-0.5">
                    {notif.judul}
                  </h4>
                  <p className="text-xs text-muted line-clamp-2 mb-1.5">{notif.pesan}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted">{notif.dibuat_pada}</span>
                    {notif.report_id && (
                      <Link
                        href={`/riwayat/${notif.report_id}`}
                        className="text-xs font-semibold text-primary flex items-center gap-0.5
                          hover:gap-1.5 transition-all"
                      >
                        Detail <ChevronRight size={11} />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
      </div>
    </motion.div>
  )
}