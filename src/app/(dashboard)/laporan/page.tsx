'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import LaporanForm, { type LaporanFormData } from '@/components/laporan/LaporanForm'
import PreviewPanel from '@/components/laporan/PreviewPanel'
import api from '@/services/api'

export default function LaporanPage() {
  const router = useRouter()

  const [formData, setFormData] = useState<LaporanFormData>({
    judul:        '',
    deskripsi:    '',
    category_id:  '',
    priority:     '',
    address:      '',
    latitude:     '',
    longitude:    '',
    is_confirmed: false,
  })
  const [imageFiles, setImageFiles]   = useState<File[]>([])
  const [isSubmitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = new globalThis.FormData()   // ← pakai globalThis supaya tidak konflik
      payload.append('judul',        formData.judul)
      payload.append('deskripsi',    formData.deskripsi)
      payload.append('category_id',  formData.category_id)
      payload.append('priority',     formData.priority)
      payload.append('address',      formData.address)
      payload.append('latitude',     formData.latitude)
      payload.append('longitude',    formData.longitude)
      payload.append('is_confirmed', '1')   // backend: accepted = "1" / "true" / "yes"

      imageFiles.forEach(file => payload.append('images[]', file))

      const res = await api.post('/laporan', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const laporan = res.data.data
      toast.success('Laporan berhasil dikirim!')
      router.push(
        `/success?id=${laporan.id}` +
        `&judul=${encodeURIComponent(laporan.judul)}` +
        `&kategori=${encodeURIComponent(laporan.category?.nama ?? '')}`
      )
    } catch (err: any) {

      console.log('Status:', err?.response?.status)
      console.log('Response:', JSON.stringify(err?.response?.data, null, 2))
  
      const errors = err?.response?.data?.errors
      if (errors) {
        // Tampilkan error validasi pertama yang ada
        const firstError = Object.values(errors)[0] as string[]
        toast.error(firstError[0])
      } else {
        toast.error(err?.response?.data?.message ?? 'Gagal mengirim laporan')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-extrabold text-text mb-1">Buat Laporan</h1>
        <p className="text-sm text-muted mb-6">Isi form di bawah untuk menyampaikan laporan Anda</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LaporanForm
              formData={formData}
              setFormData={setFormData}
              imageFiles={imageFiles}
              setImageFiles={setImageFiles}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
          <div>
            <PreviewPanel formData={formData} imageFiles={imageFiles} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}