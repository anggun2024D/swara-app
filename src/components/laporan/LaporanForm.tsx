'use client'

import { useState, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { MapPin, Loader2, LocateFixed, ChevronDown, Search } from 'lucide-react'
import ImageUpload from './ImageUpload'
import { useKategori } from '@/hooks/useKategori'

const MiniMap = dynamic(() => import('./MiniMap'), {
  ssr: false,
  loading: () => (
    <div className="h-48 bg-gray-100 rounded-xl animate-pulse flex items-center justify-center">
      <p className="text-xs text-muted">Memuat peta...</p>
    </div>
  ),
})

export interface LaporanFormData {
  judul:        string
  deskripsi:    string
  category_id:  string
  priority:     string 
  address:      string
  latitude:     string
  longitude:    string
  is_confirmed: boolean
}

interface LaporanFormProps {
  formData:      LaporanFormData
  setFormData:   (data: LaporanFormData) => void
  imageFiles:    File[]
  setImageFiles: (files: File[]) => void
  onSubmit:      (e: React.FormEvent) => Promise<void>
  isSubmitting:  boolean
}

export default function LaporanForm({
  formData, setFormData,
  imageFiles, setImageFiles,
  onSubmit, isSubmitting,
}: LaporanFormProps) {
  const { kategori, isLoading: loadingKategori } = useKategori()
  const [locating, setLocating]     = useState(false)
  const [geocoding, setGeocoding]   = useState(false)
  const [geocodeError, setGeocodeError] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Geocode via Nominatim (OpenStreetMap) — gratis, no API key
  const geocodeAddress = useCallback(async (query: string) => {
    if (!query || query.length < 5) return
    setGeocoding(true)
    setGeocodeError('')
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=id`,
        { headers: { 'Accept-Language': 'id' } }
      )
      const data = await res.json()
      if (data.length > 0) {
        setFormData({
          ...formData,
          address:   formData.address || data[0].display_name,
          latitude:  data[0].lat,
          longitude: data[0].lon,
        })
      } else {
        setGeocodeError('Alamat tidak ditemukan di peta')
      }
    } catch {
      setGeocodeError('Gagal mencari koordinat alamat')
    } finally {
      setGeocoding(false)
    }
  }, [formData, setFormData])

  // Debounce geocode saat user ketik di field address
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setFormData({ ...formData, address: val })
    setGeocodeError('')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (val.length >= 8) geocodeAddress(val + ', Lamongan')
    }, 1000) // tunggu 1 detik setelah user berhenti mengetik
  }

  const handleAutoLocate = () => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setFormData({
          ...formData,
          latitude:  String(pos.coords.latitude),
          longitude: String(pos.coords.longitude),
          address:   formData.address ||
            `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`,
        })
        setLocating(false)
      },
      () => setLocating(false)
    )
  }

  // Reverse geocode: koordinat → nama alamat
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?` +
        `lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'Accept-Language': 'id' } }
      )
      const data = await res.json()
      if (data?.display_name) {
        setFormData({ ...formData, latitude: String(lat), longitude: String(lng), address: data.display_name })
      }
    } catch {
      // Gagal reverse geocode — koordinat tetap tersimpan, alamat tidak diupdate
      setFormData({ ...formData, latitude: String(lat), longitude: String(lng) })
    }
  }, [formData, setFormData])

  // Update handleMapClick untuk pakai reverse geocode
  const handleMapClick = (lat: number, lng: number) => {
    reverseGeocode(lat, lng)
  }

  const hasCoords = formData.latitude && formData.longitude

  return (
    <form onSubmit={onSubmit} className="card p-6 space-y-5">

      {/* Upload foto */}
      <div>
        <label className="block text-sm font-semibold text-text mb-2">
          Foto Pendukung <span className="text-red-500">*</span>
        </label>
        <ImageUpload files={imageFiles} setFiles={setImageFiles} />
        <p className="text-xs text-muted mt-1">Minimal 1 foto, maks 5 foto (JPG/PNG, maks 5MB)</p>
      </div>

      {/* Judul */}
      <div>
        <label className="block text-sm font-semibold text-text mb-1">
          Judul Laporan <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="judul"
          value={formData.judul}
          onChange={handleChange}
          placeholder="Contoh: Jalan Berlubang di Jl. Sudirman"
          className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          required
        />
      </div>

      {/* Deskripsi */}
      <div>
        <label className="block text-sm font-semibold text-text mb-1">
          Deskripsi Laporan <span className="text-red-500">*</span>
        </label>
        <textarea
          name="deskripsi"
          value={formData.deskripsi}
          onChange={handleChange}
          rows={4}
          placeholder="Ceritakan detail kondisi yang dilaporkan..."
          className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
          required
        />
      </div>

      {/* Kategori */}
      <div>
        <label className="block text-sm font-semibold text-text mb-1">
          Kategori Laporan <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none bg-white pr-10"
            required
            disabled={loadingKategori}
          >
            <option value="">
              {loadingKategori ? 'Memuat kategori...' : 'Pilih kategori'}
            </option>
            {kategori.map(k => (
              <option key={k.id} value={k.id}>{k.nama}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        </div>
      </div>

      {/* Prioritas */}
      <div>
        <label className="block text-sm font-semibold text-text mb-2">
          Prioritas Laporan
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { value: 'rendah',  label: 'Rendah',  color: 'text-green-700  bg-green-50  border-green-200  peer-checked:bg-green-500  peer-checked:border-green-500' },
            { value: 'sedang',  label: 'Sedang',  color: 'text-blue-700   bg-blue-50   border-blue-200   peer-checked:bg-blue-500   peer-checked:border-blue-500' },
            { value: 'tinggi',  label: 'Tinggi',  color: 'text-amber-700  bg-amber-50  border-amber-200  peer-checked:bg-amber-500  peer-checked:border-amber-500' },
            { value: 'urgent',  label: 'Urgent',  color: 'text-red-700    bg-red-50    border-red-200    peer-checked:bg-red-500    peer-checked:border-red-500' },
          ].map(opt => (
            <label key={opt.value} className="cursor-pointer">
              <input
                type="radio"
                name="priority"
                value={opt.value}
                checked={formData.priority === opt.value}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className={`
                text-center text-xs font-bold py-2 px-1 rounded-xl border-2
                transition-all duration-200 select-none
                ${opt.color}
                peer-checked:text-white peer-checked:shadow-md
              `}>
                {opt.label}
              </div>
            </label>
          ))}
        </div>
        {formData.priority && (
          <button
            type="button"
            onClick={() => setFormData({ ...formData, priority: '' })}
            className="mt-1 text-xs text-muted hover:text-red-500 transition-colors"
          >
            × Hapus pilihan prioritas
          </button>
        )}
      </div>

      {/* Lokasi */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-text">
          Lokasi Kejadian <span className="text-red-500">*</span>
        </label>

        {/* Alamat + tombol cari + GPS */}
        <div className="relative">
          <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleAddressChange}
            placeholder="Ketik alamat — peta akan otomatis bergerak..."
            className="w-full pl-10 pr-20 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            required
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            {/* Tombol cari manual */}
            <button
              type="button"
              onClick={() => geocodeAddress(formData.address + ', Lamongan')}
              disabled={geocoding || !formData.address}
              title="Cari lokasi di peta"
              className="p-1.5 rounded-lg hover:bg-primary/10 text-muted hover:text-primary transition disabled:opacity-50"
            >
              {geocoding
                ? <Loader2 size={15} className="animate-spin" />
                : <Search size={15} />
              }
            </button>
            {/* Tombol GPS */}
            <button
              type="button"
              onClick={handleAutoLocate}
              disabled={locating}
              title="Gunakan lokasi GPS saat ini"
              className="p-1.5 rounded-lg hover:bg-primary/10 text-muted hover:text-primary transition disabled:opacity-50"
            >
              {locating
                ? <Loader2 size={15} className="animate-spin" />
                : <LocateFixed size={15} />
              }
            </button>
          </div>
        </div>

        {/* Error geocode */}
        {geocodeError && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <span>⚠</span> {geocodeError}
          </p>
        )}

        {/* Badge koordinat */}
        {hasCoords && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 text-xs text-primary bg-primary/5 border border-primary/20 rounded-lg px-3 py-1.5"
          >
            <MapPin size={11} />
            <span>
              GPS: {parseFloat(formData.latitude).toFixed(6)}, {parseFloat(formData.longitude).toFixed(6)}
            </span>
          </motion.div>
        )}

        {/* Mini Map */}
        <div className="rounded-xl overflow-hidden border border-border">
          <div className="px-3 py-2 bg-gray-50 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <MapPin size={12} className="text-muted" />
              <span className="text-xs text-muted">
                Klik pada peta untuk pin lokasi yang tepat
              </span>
            </div>
            {geocoding && (
              <span className="text-xs text-primary flex items-center gap-1">
                <Loader2 size={11} className="animate-spin" /> Mencari...
              </span>
            )}
          </div>
          <MiniMap
            lat={hasCoords ? parseFloat(formData.latitude) : -7.1195}
            lng={hasCoords ? parseFloat(formData.longitude) : 112.4153}
            hasMarker={!!hasCoords}
            onMapClick={handleMapClick}
          />
        </div>

        {/* Koordinat manual */}
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            placeholder="Latitude (-7.xxxx)"
            step="any"
            className="px-3 py-2 text-xs border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <input
            type="number"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            placeholder="Longitude (112.xxxx)"
            step="any"
            className="px-3 py-2 text-xs border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Checkbox konfirmasi — WAJIB sesuai backend is_confirmed:accepted */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={formData.is_confirmed}
              onChange={e => setFormData({ ...formData, is_confirmed: e.target.checked })}
              className="sr-only peer"
              required
            />
            <div className="w-5 h-5 rounded border-2 border-amber-400 peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
              {formData.is_confirmed && (
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-3 h-3 text-white"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-text">
              Konfirmasi Kebenaran Laporan <span className="text-red-500">*</span>
            </p>
            <p className="text-xs text-muted mt-0.5 leading-relaxed">
              Saya menyatakan bahwa informasi yang saya laporkan adalah benar dan dapat dipertanggungjawabkan.
              Laporan palsu dapat dikenakan sanksi sesuai ketentuan yang berlaku.
            </p>
          </div>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-border">
        <button
          type="submit"
          disabled={isSubmitting || !formData.is_confirmed}
          className="flex-1 h-12 rounded-2xl bg-primary hover:bg-primary-hover text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          {isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
        </button>
        <button
          type="button"
          onClick={() => {
            setFormData({
              judul: '', deskripsi: '', category_id: '', priority: '',
              address: '', latitude: '', longitude: '', is_confirmed: false,
            })
            setImageFiles([])
          }}
          className="h-12 px-6 rounded-2xl border border-border bg-white hover:bg-gray-50 text-text font-semibold text-sm transition-all duration-300"
        >
          Reset
        </button>
      </div>
    </form>
  )
}