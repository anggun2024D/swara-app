'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronDown, MessageCircle, Mail, Phone, FileText, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const faqs = [
  {
    q: 'Bagaimana cara mendaftarkan potensi ekonomi?',
    a: 'Klik menu "Tambah Potensi" di sidebar, isi nama usaha, deskripsi, pilih kategori sektor, lokasi, dan upload foto. Potensi Anda akan langsung aktif di peta ekonomi.',
  },
  {
    q: 'Apa saja kategori sektor yang tersedia?',
    a: 'SWARA memiliki 4 sektor utama: UMKM & Industri Kreatif, Pertanian & Pangan, Perikanan & Peternakan, dan Pariwisata & Ekonomi Lokal.',
  },
  {
    q: 'Bisakah saya mengedit potensi yang sudah didaftarkan?',
    a: 'Ya, Anda bisa mengedit potensi kapan saja melalui menu "Potensi Saya". Perubahan langsung berlaku tanpa perlu review ulang.',
  },
  {
    q: 'Bagaimana sistem verifikasi komunitas bekerja?',
    a: 'Level 1: Terdaftar (baru didaftarkan). Level 2: Terverifikasi Komunitas (mendapat dukungan dan review dari pengguna lain). Level 3: Mitra Terverifikasi (skor tinggi). Level 4: Resmi (verifikasi lengkap).',
  },
  {
    q: 'Bagaimana cara mengirim permintaan kolaborasi?',
    a: 'Buka detail potensi yang menarik, lalu klik tombol "Ajukan Kolaborasi". Pilih jenis kolaborasi (Investasi, Distribusi, Supply, Kemitraan, atau Ekspansi) dan tulis pesan Anda.',
  },
  {
    q: 'Bagaimana cara menyimpan peluang yang menarik?',
    a: 'Di halaman Papan Peluang atau detail potensi, klik ikon bookmark. Peluang tersimpan bisa dilihat di menu "Peluang Tersimpan".',
  },
  {
    q: 'Apakah data saya aman?',
    a: 'Ya. Data pribadi Anda hanya digunakan untuk keperluan platform dan tidak dibagikan kepada pihak ketiga. Foto disimpan secara terenkripsi di cloud.',
  },
  {
    q: 'Bagaimana cara mengubah password?',
    a: 'Buka menu Profil → Edit Profil → tab "Ubah Password". Masukkan password lama dan password baru minimal 8 karakter.',
  },
]

const contacts = [
  {
    icon: Phone,
    label: 'Telepon',
    value: '(0322)321170',
    sub: 'Senin–Jumat, 08.00–16.00',
    color: 'text-green-600 bg-green-50',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'swara@lamongan.go.id',
    sub: 'Balas dalam 1×24 jam',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '0812-3456-7890',
    sub: 'Chat langsung dengan admin',
    color: 'text-emerald-600 bg-emerald-50',
  },
]

export default function BantuanPage() {
  const router = useRouter()
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const [search, setSearch]   = useState('')

  const filtered = faqs.filter(
    f =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-primary font-semibold mb-6 hover:underline"
      >
        <ArrowLeft size={18} /> Kembali
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

        {/* Hero */}
        <div className="bg-primary to-primary-mid rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle size={24} />
            <h1 className="text-2xl font-extrabold">Pusat Bantuan</h1>
          </div>
          <p className="text-white/70 text-sm max-w-md">
            Temukan jawaban atas pertanyaan umum, atau hubungi tim kami secara langsung.
          </p>

          {/* Search */}
          <div className="mt-5 relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari pertanyaan..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/20 placeholder-white/50 text-white text-sm focus:outline-none focus:bg-white/30 transition-all"
            />
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
            <FileText size={18} className="text-primary" />
            Pertanyaan yang Sering Diajukan
          </h2>

          {filtered.length === 0 ? (
            <p className="text-center text-muted text-sm py-8">
              Tidak ada pertanyaan yang cocok dengan pencarian Anda.
            </p>
          ) : (
            <div className="space-y-2">
              {filtered.map((faq, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="card overflow-hidden"
                >
                  <button
                    onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-bg transition-all"
                  >
                    <span className="font-semibold text-text text-sm pr-4">{faq.q}</span>
                    <motion.div
                      animate={{ rotate: openIdx === idx ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown size={16} className="text-muted" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {openIdx === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 text-sm text-muted leading-relaxed border-t border-border pt-3">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
            <MessageCircle size={18} className="text-primary" />
            Hubungi Kami
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {contacts.map(c => (
              <div key={c.label} className="card p-4 flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.color}`}>
                  <c.icon size={18} />
                </div>
                <div>
                  <p className="text-xs text-muted">{c.label}</p>
                  <p className="font-bold text-text text-sm">{c.value}</p>
                  <p className="text-xs text-muted mt-0.5">{c.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        

      </motion.div>
    </div>
  )
}