'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, FileText, RefreshCw, Shield } from 'lucide-react'
import Link from 'next/link'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Ambil dari query params yang dikirim LaporanPage
  const id      = searchParams.get('id')      ?? ''
  const judul   = searchParams.get('judul')   ?? '-'
  const kategori = searchParams.get('kategori') ?? '-'

  // Format ID pendek untuk ditampilkan
  const displayId = id ? `#SW-${id.slice(0, 8).toUpperCase()}` : '-'

  // Redirect ke dashboard kalau akses langsung tanpa id
  useEffect(() => {
    if (!id) router.replace('/dashboard')
  }, [id, router])

  if (!id) return null

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-green-50 via-white to-yellow-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
        >
          <CheckCircle className="w-12 h-12 text-primary" />
        </motion.div>

        <h1 className="text-3xl font-extrabold text-primary mb-2">Laporan Berhasil Terkirim!</h1>
        <p className="text-muted text-sm mb-6">
          Terima kasih atas kontribusi Anda. Laporan sedang dalam proses verifikasi oleh tim terkait.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-md p-5 mb-6 text-left divide-y divide-gray-100"
        >
          <div className="flex justify-between items-center pb-3">
            <span className="text-xs text-muted font-semibold">ID LAPORAN</span>
            <span className="text-sm font-bold font-mono text-text">{displayId}</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-xs text-muted font-semibold">JUDUL</span>
            <span className="text-sm font-bold text-text text-right max-w-[180px] truncate">{judul}</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-xs text-muted font-semibold">KATEGORI</span>
            <span className="text-sm font-bold text-text">{kategori}</span>
          </div>
          <div className="flex justify-between items-center pt-3">
            <span className="text-xs text-muted font-semibold">WAKTU KIRIM</span>
            <span className="text-sm font-bold text-text">
              {new Date().toLocaleString('id-ID')}
            </span>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <Link href="/riwayat">
            <button className="btn-primary w-full sm:w-auto flex items-center gap-2">
              <FileText size={16} />
              Lihat Riwayat Laporan
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="btn-outline w-full sm:w-auto flex items-center gap-2">
              <RefreshCw size={16} />
              Kembali ke Dashboard
            </button>
          </Link>
        </div>

        <div className="flex justify-center gap-4 text-xs text-muted">
          <div className="flex items-center gap-1"><Shield size={12} /> Data Aman & Terenkripsi</div>
          <div className="flex items-center gap-1"><RefreshCw size={12} /> Update Real-time</div>
        </div>
      </motion.div>
    </div>
  )
}