'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { resourcesService } from '@/services/resources.service'
import type { BusinessScale, OpportunityStatus } from '@/types/resource'

const CATEGORIES = [
  { id: 1, name: 'UMKM & Industri Kreatif', icon: '🏭', color: '#F59E0B' },
  { id: 2, name: 'Pertanian & Pangan', icon: '🌾', color: '#10B981' },
  { id: 3, name: 'Perikanan & Peternakan', icon: '🐟', color: '#3B82F6' },
  { id: 4, name: 'Pariwisata & Ekonomi Lokal', icon: '🏝️', color: '#8B5CF6' },
]

const BUSINESS_SCALES: { value: BusinessScale; label: string }[] = [
  { value: 'mikro', label: 'Mikro (< 300jt/tahun)' },
  { value: 'kecil', label: 'Kecil (300jt - 2.5M/tahun)' },
  { value: 'menengah', label: 'Menengah (2.5M - 50M/tahun)' },
  { value: 'besar', label: 'Besar (> 50M/tahun)' },
]

const OPP_STATUSES: { value: OpportunityStatus; label: string; icon: string }[] = [
  { value: 'aktif', label: 'Aktif (tidak mencari)', icon: '✅' },
  { value: 'mencari_investor', label: 'Mencari Investor', icon: '💰' },
  { value: 'mencari_distributor', label: 'Mencari Distributor', icon: '🚚' },
  { value: 'mencari_supplier', label: 'Mencari Supplier', icon: '📦' },
  { value: 'mencari_mitra', label: 'Mencari Mitra Bisnis', icon: '🤝' },
  { value: 'ekspansi', label: 'Ekspansi Usaha', icon: '🚀' },
]

export default function TambahPotensiPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(1) // multi-step form
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])

  const [form, setForm] = useState({
    resource_name: '',
    description: '',
    category_id: 0,
    latitude: '',
    longitude: '',
    address: '',
    province: '',
    city: '',
    business_scale: 'mikro' as BusinessScale,
    monthly_capacity: '',
    investment_needed: '',
    collaboration_needed: '',
    opportunity_status: 'aktif' as OpportunityStatus,
    contact_information: '',
    website: '',
    social_media_instagram: '',
    social_media_whatsapp: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + imageFiles.length > 5) {
      setError('Maksimal 5 foto')
      return
    }
    setImageFiles((prev) => [...prev, ...files])
    files.forEach((f) => {
      const reader = new FileReader()
      reader.onload = (ev) => setImagePreviews((prev) => [...prev, ev.target?.result as string])
      reader.readAsDataURL(f)
    })
  }

  const removeImage = (i: number) => {
    setImageFiles((prev) => prev.filter((_, idx) => idx !== i))
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== i))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('resource_name', form.resource_name)
      formData.append('description', form.description)
      formData.append('category_id', String(form.category_id))
      if (form.latitude) formData.append('latitude', form.latitude)
      if (form.longitude) formData.append('longitude', form.longitude)
      if (form.address) formData.append('address', form.address)
      if (form.province) formData.append('province', form.province)
      if (form.city) formData.append('city', form.city)
      formData.append('business_scale', form.business_scale)
      if (form.monthly_capacity) formData.append('monthly_capacity', form.monthly_capacity)
      if (form.investment_needed) formData.append('investment_needed', form.investment_needed)
      if (form.collaboration_needed) formData.append('collaboration_needed', form.collaboration_needed)
      formData.append('opportunity_status', form.opportunity_status)
      if (form.contact_information) formData.append('contact_information', form.contact_information)
      if (form.website) formData.append('website', form.website)

      if (form.social_media_instagram) formData.append('social_media[instagram]', form.social_media_instagram)
      if (form.social_media_whatsapp) formData.append('social_media[whatsapp]', form.social_media_whatsapp)

      imageFiles.forEach((f) => formData.append('images[]', f))

      await resourcesService.create(formData)
      router.push('/potensi')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal menyimpan potensi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">✨ Tambah Potensi Baru</h1>
        <p className="text-gray-400 text-sm mt-1">Daftarkan potensi ekonomi di wilayah Anda</p>
      </div>

      {/* Progress */}
      <div className="flex gap-1">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${step >= s ? 'bg-indigo-500' : 'bg-gray-800'}`} />
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 text-sm">{error}</div>
      )}

      {/* Step 1: Info Dasar */}
      {step === 1 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white">📋 Informasi Dasar</h2>

          {/* Kategori */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Kategori Sektor *</label>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setForm({ ...form, category_id: cat.id })}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    form.category_id === cat.id
                      ? 'border-2 shadow-lg'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                  style={form.category_id === cat.id ? { borderColor: cat.color, boxShadow: `0 4px 15px ${cat.color}30` } : {}}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <p className="text-white text-sm font-medium mt-1">{cat.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Nama Usaha / Potensi *</label>
            <input name="resource_name" value={form.resource_name} onChange={handleChange} placeholder="Contoh: Keripik Tempe Bu Darmi" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Deskripsi Lengkap *</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Deskripsikan potensi ekonomi ini secara detail..." className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Skala Usaha *</label>
              <select name="business_scale" value={form.business_scale} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                {BUSINESS_SCALES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Kapasitas/Bulan</label>
              <input name="monthly_capacity" value={form.monthly_capacity} onChange={handleChange} placeholder="Contoh: 500 kg" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>

          <button onClick={() => setStep(2)} disabled={!form.resource_name || !form.description || !form.category_id} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl font-medium transition-all">
            Lanjut: Lokasi & Peluang →
          </button>
        </div>
      )}

      {/* Step 2: Lokasi & Peluang */}
      {step === 2 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white">📍 Lokasi & Peluang</h2>

          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm text-gray-400 mb-1 block">Provinsi</label><input name="province" value={form.province} onChange={handleChange} placeholder="Contoh: Jawa Timur" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
            <div><label className="text-sm text-gray-400 mb-1 block">Kota/Kabupaten</label><input name="city" value={form.city} onChange={handleChange} placeholder="Contoh: Kota Malang" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
          </div>

          <div><label className="text-sm text-gray-400 mb-1 block">Alamat Lengkap</label><input name="address" value={form.address} onChange={handleChange} placeholder="Jl. Contoh No. 123" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" /></div>

          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm text-gray-400 mb-1 block">Latitude</label><input name="latitude" value={form.latitude} onChange={handleChange} placeholder="-7.978" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
            <div><label className="text-sm text-gray-400 mb-1 block">Longitude</label><input name="longitude" value={form.longitude} onChange={handleChange} placeholder="112.631" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
          </div>

          <div><label className="text-sm text-gray-400 mb-2 block">Status Peluang</label>
            <select name="opportunity_status" value={form.opportunity_status} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none">
              {OPP_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.icon} {s.label}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm text-gray-400 mb-1 block">Kebutuhan Investasi (Rp)</label><input name="investment_needed" value={form.investment_needed} onChange={handleChange} type="number" placeholder="50000000" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
            <div><label className="text-sm text-gray-400 mb-1 block">No. Telepon / WA</label><input name="contact_information" value={form.contact_information} onChange={handleChange} placeholder="08123456789" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
          </div>

          <div><label className="text-sm text-gray-400 mb-1 block">Kebutuhan Kolaborasi</label><textarea name="collaboration_needed" value={form.collaboration_needed} onChange={handleChange} rows={3} placeholder="Jelaskan apa yang Anda butuhkan..." className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none" /></div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-3 bg-gray-800 text-gray-300 rounded-xl font-medium hover:bg-gray-700 transition-all">← Kembali</button>
            <button onClick={() => setStep(3)} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all">Lanjut: Foto →</button>
          </div>
        </div>
      )}

      {/* Step 3: Foto & Submit */}
      {step === 3 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white">📸 Foto & Kirim</h2>

          <div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="w-full py-8 border-2 border-dashed border-gray-700 rounded-xl text-gray-400 hover:border-indigo-500 hover:text-indigo-400 transition-all">
              <p className="text-3xl mb-2">📷</p>
              <p className="text-sm">Klik untuk upload foto (maks 5)</p>
            </button>
          </div>

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative">
                  <img src={src} alt="" className="w-full h-24 object-cover rounded-lg" />
                  <button onClick={() => removeImage(i)} className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">×</button>
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          <div className="bg-gray-800/50 rounded-xl p-4">
            <h3 className="text-white text-sm font-medium mb-2">📋 Ringkasan</h3>
            <div className="text-sm text-gray-400 space-y-1">
              <p><span className="text-gray-500">Nama:</span> {form.resource_name}</p>
              <p><span className="text-gray-500">Kategori:</span> {CATEGORIES.find((c) => c.id === form.category_id)?.name}</p>
              <p><span className="text-gray-500">Skala:</span> <span className="capitalize">{form.business_scale}</span></p>
              <p><span className="text-gray-500">Lokasi:</span> {form.city || form.province || form.address || '-'}</p>
              <p><span className="text-gray-500">Foto:</span> {imageFiles.length} file</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 py-3 bg-gray-800 text-gray-300 rounded-xl font-medium hover:bg-gray-700 transition-all">← Kembali</button>
            <button onClick={handleSubmit} disabled={loading} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-600/20">
              {loading ? 'Menyimpan...' : '✅ Kirim Potensi'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
