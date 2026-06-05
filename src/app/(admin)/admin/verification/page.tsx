'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle, XCircle, MapPin, Camera,
  FileCheck, RefreshCw, AlertCircle,
  ChevronLeft, ChevronRight, MessageSquare,
  AlertTriangle,
} from 'lucide-react'
import { useVerification } from '@/hooks/useVerification'

// ── Quick-pick templates ──────────────────────────────────────────────────────
const REJECTION_TEMPLATES = [
  'Foto tidak memperlihatkan kerusakan dengan jelas.',
  'Lokasi laporan tidak valid atau tidak dapat diverifikasi.',
  'Laporan duplikat dengan laporan yang sudah ada.',
  'Informasi yang diberikan kurang lengkap.',
  'Laporan tidak sesuai dengan kategori yang dipilih.',
]

export default function VerificationPage() {
  const {
    queue, current, setCurrent, report,
    isLoading, isSubmitting, error,
    refetch, handleVerify, total,
  } = useVerification()

  const [adminNotes, setAdminNotes] = useState('')
  const [activePhoto, setActivePhoto] = useState(0)
  // Track apakah user mencoba submit tanpa mengisi alasan
  const [touched, setTouched] = useState(false)

  const goTo = (idx: number) => {
    setCurrent(idx)
    setAdminNotes('')
    setActivePhoto(0)
    setTouched(false)
  }

  const onTolak = () => {
    setTouched(true)
    if (!adminNotes.trim() || adminNotes.trim().length < 10) return
    handleVerify('ditolak', adminNotes)
  }

  const onProses = () => {
    handleVerify('diproses', adminNotes || undefined)
  }

  const notesInvalid = touched && (!adminNotes.trim() || adminNotes.trim().length < 10)

  // ── Loading ──
  if (isLoading) return (
    <div className="flex items-center justify-center h-96 bg-white rounded-2xl">
      <div className="flex items-center gap-2 text-muted">
        <RefreshCw size={20} className="animate-spin" />
        <span>Memuat laporan pending...</span>
      </div>
    </div>
  )

  // ── Empty ──
  if (!isLoading && total === 0) return (
    <div className="flex items-center justify-center h-96 bg-white rounded-2xl shadow-sm">
      <div className="text-center">
        <FileCheck size={48} className="text-green-500 mx-auto mb-3" />
        <h2 className="text-xl font-semibold">Semua laporan terverifikasi</h2>
        <p className="text-muted text-sm mt-1">Tidak ada laporan yang menunggu verifikasi</p>
        <button onClick={refetch} className="mt-4 text-primary text-sm underline">Refresh</button>
      </div>
    </div>
  )

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Verifikasi Laporan</h1>
          <p className="text-sm text-muted">{total} laporan menunggu verifikasi</p>
        </div>
        <button
          onClick={refetch}
          className="p-2 bg-white rounded-xl shadow-sm border hover:bg-gray-50 transition"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 rounded-xl px-4 py-3 text-sm">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{error}</span>
          <button onClick={refetch} className="ml-auto underline text-xs">Coba lagi</button>
        </div>
      )}

      {report && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Panel kiri ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">Detail Laporan</h2>
              <span className="text-xs font-mono text-muted bg-gray-100 px-2 py-1 rounded-lg">
                {report.id.slice(0, 8).toUpperCase()}
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted text-xs mb-0.5">Judul</p>
                <p className="font-semibold">{report.judul}</p>
              </div>
              <div>
                <p className="text-muted text-xs mb-0.5">Deskripsi</p>
                <p className="text-gray-700 leading-relaxed">{report.deskripsi}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-muted text-xs mb-0.5">Pelapor</p>
                  <p className="font-medium">{report.pelapor.nama}</p>
                </div>
                <div>
                  <p className="text-muted text-xs mb-0.5">Kategori</p>
                  <p className="font-medium">{report.kategori.nama}</p>
                </div>
              </div>
              <div>
                <p className="text-muted text-xs mb-0.5">Lokasi GPS</p>
                <p className="flex items-center gap-1 text-gray-700">
                  <MapPin size={14} className="text-primary flex-shrink-0" />
                  {report.lokasi.address || `${report.lokasi.latitude}, ${report.lokasi.longitude}`}
                </p>
              </div>
              <div>
                <p className="text-muted text-xs mb-0.5">Waktu Laporan</p>
                <p className="text-gray-700">{report.dibuat_pada}</p>
              </div>
            </div>

            {/* ── Catatan / Alasan Penolakan ── */}
            <div>
              <label className="text-xs text-muted mb-1.5 flex items-center gap-1">
                <MessageSquare size={12} />
                Alasan Penolakan
                <span className="text-red-500 font-bold ml-0.5">*</span>
                <span className="ml-auto text-gray-400 font-normal">wajib diisi jika menolak</span>
              </label>

              {/* Quick templates */}
              <div className="mb-3">
                <select
                  onChange={(e) => {
                    if (!e.target.value) return
                    setAdminNotes(e.target.value)
                    setTouched(false)
                  }}
                  className="
                    w-full
                    text-sm
                    border
                    border-border
                    rounded-xl
                    px-3
                    py-2.5
                    bg-white
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary/30
                    transition-all
                  "
                  defaultValue=""
                >
                  <option value="" disabled>
                    Pilih template alasan penolakan
                  </option>

                  {REJECTION_TEMPLATES.map((tpl) => (
                    <option key={tpl} value={tpl}>
                      {tpl}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                value={adminNotes}
                onChange={e => { setAdminNotes(e.target.value); setTouched(false) }}
                placeholder="Tuliskan alasan laporan ditolak secara spesifik..."
                rows={3}
                className={`w-full text-sm border rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 transition ${
                  notesInvalid
                    ? 'border-red-400 focus:ring-red-300 bg-red-50'
                    : 'border-border focus:ring-primary/30'
                }`}
              />

              <div className="flex items-center justify-between mt-1">
                {notesInvalid ? (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertTriangle size={11} /> Alasan penolakan wajib diisi (min. 10 karakter)
                  </p>
                ) : (
                  <p className="text-xs text-muted">
                    Berikan alasan yang jelas agar pengguna memahami penyebab laporan ditolak.
                  </p>
                )}
                <span className={`text-xs ml-2 flex-shrink-0 ${adminNotes.length > 450 ? 'text-red-500' : 'text-muted'}`}>
                  {adminNotes.length}/500
                </span>
              </div>
            </div>

            {/* Tombol aksi */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={onProses}
                disabled={isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 transition font-medium"
              >
                {isSubmitting
                  ? <RefreshCw size={16} className="animate-spin" />
                  : <CheckCircle size={16} />
                }
                Valid — Proses
              </button>
              <button
                onClick={onTolak}
                disabled={isSubmitting}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 transition font-medium"
              >
                <XCircle size={16} />
                Tolak
              </button>
            </div>

            {/* Navigasi queue */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <button
                onClick={() => goTo(current - 1)}
                disabled={current === 0}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm text-muted">
                {current + 1} <span className="text-gray-300">dari</span> {total} laporan
              </span>
              <button
                onClick={() => goTo(current + 1)}
                disabled={current >= total - 1}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* ── Panel kanan: Foto ── */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            {report.foto.length > 0 ? (
              <div className="flex flex-col h-full">
                <div className="relative flex-1 min-h-[360px] bg-gray-100">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={report.foto[activePhoto]?.url}
                      src={report.foto[activePhoto]?.url}
                      alt={`Foto laporan ${activePhoto + 1}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>
                  <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                    {activePhoto + 1} / {report.foto.length}
                  </div>
                </div>
                {report.foto.length > 1 && (
                  <div className="flex gap-2 p-3 border-t border-border overflow-x-auto">
                    {report.foto.map((f, idx) => (
                      <button
                        key={f.id}
                        onClick={() => setActivePhoto(idx)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                          activePhoto === idx ? 'border-primary' : 'border-transparent'
                        }`}
                      >
                        <img src={f.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center text-muted">
                  <Camera size={48} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Tidak ada foto laporan</p>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}