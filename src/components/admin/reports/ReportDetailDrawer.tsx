'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Calendar, User, CheckCircle, XCircle, Clock } from 'lucide-react'
import type { Report, ReportStatus } from '@/types'

interface ReportDetailDrawerProps {
  report: Report | null
  open: boolean
  onClose: () => void
  onVerify: (id: string, status: 'diverifikasi' | 'diproses' | 'selesai' | 'ditolak', adminNotes?: string) => Promise<void>
}

const statusLabel: Record<ReportStatus, string> = {
  tersubmit:    'Tersubmit',
  diverifikasi: 'Diverifikasi',
  diproses:     'Sedang Diproses',
  selesai:      'Selesai',
  ditolak:      'Ditolak',
}

const statusColors: Record<ReportStatus, string> = {
  tersubmit:    'bg-gray-100 text-gray-700',
  diverifikasi: 'bg-blue-100 text-blue-700',
  diproses:     'bg-yellow-100 text-yellow-700',
  selesai:      'bg-green-100 text-green-700',
  ditolak:      'bg-red-100 text-red-700',
}

export default function ReportDetailDrawer({ report, open, onClose, onVerify }: ReportDetailDrawerProps) {
  const [adminNotes, setAdminNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!report) return null

  const handleVerify = async (status: 'diverifikasi' | 'diproses' | 'selesai' | 'ditolak') => {
    setIsSubmitting(true)
    try {
      await onVerify(report.id, status, adminNotes || undefined)
      setAdminNotes('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b bg-primary flex justify-between items-center">
              <h2 className="font-bold text-white">Detail Laporan</h2>
              <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Status badge */}
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[report.status]}`}>
                  {statusLabel[report.status]}
                </span>
                {report.priority && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                    {report.priority}
                  </span>
                )}
              </div>

              {/* Judul & Deskripsi */}
              <div>
                <p className="text-xs text-muted mb-1">Judul</p>
                <p className="font-semibold">{report.judul}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Deskripsi</p>
                <p className="text-sm text-gray-700">{report.deskripsi}</p>
              </div>

              {/* Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted mb-1">Pelapor</p>
                  <p className="text-sm flex items-center gap-1">
                    <User size={13} className="text-muted" />
                    {report.pelapor.nama}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">Kategori</p>
                  <p className="text-sm">{report.category.nama}</p>
                </div>
              </div>

              {/* Lokasi */}
              <div>
                <p className="text-xs text-muted mb-1">Lokasi</p>
                <p className="text-sm flex items-start gap-1">
                  <MapPin size={13} className="text-muted mt-0.5 shrink-0" />
                  {report.lokasi.address}
                </p>
              </div>

              {/* Tanggal */}
              <div className="flex items-center gap-1 text-xs text-muted">
                <Calendar size={12} />
                Dilaporkan: {report.dibuat_pada}
              </div>

              {/* Foto */}
              {report.foto.length > 0 && (
                <div>
                  <p className="text-xs text-muted mb-2">Foto Laporan</p>
                  <div className="grid grid-cols-2 gap-2">
                    {report.foto.map(f => (
                      <img
                        key={f.id}
                        src={f.url}
                        alt="foto laporan"
                        className="w-full h-32 object-cover rounded-xl"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Notes */}
              {report.admin_notes && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-muted mb-1">Catatan Admin</p>
                  <p className="text-sm">{report.admin_notes}</p>
                </div>
              )}

              {/* Verify Actions — hanya tampil kalau belum selesai/ditolak */}
              {!['selesai', 'ditolak'].includes(report.status) && (
                <div className="border-t border-border pt-4 space-y-3">
                  <p className="text-xs text-muted font-semibold uppercase tracking-wide">
                    Tindakan Admin
                  </p>
                  <textarea
                    value={adminNotes}
                    onChange={e => setAdminNotes(e.target.value)}
                    placeholder="Catatan admin (opsional)..."
                    rows={2}
                    className="w-full px-3 py-2 border border-border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    {report.status === 'tersubmit' && (
                      <button
                        onClick={() => handleVerify('diverifikasi')}
                        disabled={isSubmitting}
                        className="py-2 bg-blue-50 text-blue-700 rounded-xl text-sm flex items-center justify-center gap-1 hover:bg-blue-100 disabled:opacity-50"
                      >
                        <CheckCircle size={14} /> Verifikasi
                      </button>
                    )}
                    {['tersubmit', 'diverifikasi'].includes(report.status) && (
                      <button
                        onClick={() => handleVerify('diproses')}
                        disabled={isSubmitting}
                        className="py-2 bg-yellow-50 text-yellow-700 rounded-xl text-sm flex items-center justify-center gap-1 hover:bg-yellow-100 disabled:opacity-50"
                      >
                        <Clock size={14} /> Proses
                      </button>
                    )}
                    {report.status === 'diproses' && (
                      <button
                        onClick={() => handleVerify('selesai')}
                        disabled={isSubmitting}
                        className="py-2 bg-green-50 text-green-700 rounded-xl text-sm flex items-center justify-center gap-1 hover:bg-green-100 disabled:opacity-50"
                      >
                        <CheckCircle size={14} /> Selesai
                      </button>
                    )}
                    <button
                      onClick={() => handleVerify('ditolak')}
                      disabled={isSubmitting}
                      className="py-2 bg-red-50 text-red-700 rounded-xl text-sm flex items-center justify-center gap-1 hover:bg-red-100 disabled:opacity-50"
                    >
                      <XCircle size={14} /> Tolak
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}