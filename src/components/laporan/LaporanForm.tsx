'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Loader2, LocateFixed, ChevronDown, Search, X } from 'lucide-react'
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

interface NominatimResult {
  place_id:     number
  display_name: string
  lat:          string
  lon:          string
  address?: {
    road?:            string
    village?:         string
    suburb?:          string
    city_district?:   string
    county?:          string
    city?:            string
    town?:            string
    state?:           string
  }
}

interface LaporanFormProps {
  formData:      LaporanFormData
  setFormData:   (data: LaporanFormData) => void
  imageFiles:    File[]
  setImageFiles: (files: File[]) => void
  onSubmit:      (e: React.FormEvent) => Promise<void>
  isSubmitting:  boolean
}

// ─── Helper: highlight matched keyword in text ───────────────────────────────
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-primary/20 text-primary font-semibold rounded px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  )
}

// ─── Helper: parse short label from Nominatim result ─────────────────────────
function parseLabel(item: NominatimResult): { main: string; sub: string } {
  const a = item.address ?? {}
  const main =
    a.road ??
    a.village ??
    a.suburb ??
    a.city_district ??
    item.display_name.split(',')[0].trim()

  const sub = [
    a.village ?? a.suburb ?? a.city_district ?? '',
    a.city ?? a.town ?? a.county ?? 'Lamongan',
  ]
    .filter(Boolean)
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .join(', ')

  return { main: main.trim(), sub: sub.trim() }
}

// ─── Filter: only keep results that mention Lamongan ─────────────────────────
function isInLamongan(item: NominatimResult): boolean {
  const text = item.display_name.toLowerCase()
  return text.includes('lamongan')
}

export default function LaporanForm({
  formData, setFormData,
  imageFiles, setImageFiles,
  onSubmit, isSubmitting,
}: LaporanFormProps) {
  const { kategori, isLoading: loadingKategori } = useKategori()

  // ── Location state ────────────────────────────────────────────────────────
  const [locating, setLocating]                   = useState(false)
  const [addressQuery, setAddressQuery]           = useState(formData.address)
  const [suggestions, setSuggestions]             = useState<NominatimResult[]>([])
  const [showSuggestions, setShowSuggestions]     = useState(false)
  const [isSearchingAddress, setIsSearchingAddress] = useState(false)
  const [noResults, setNoResults]                 = useState(false)

  const debounceRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapperRef    = useRef<HTMLDivElement>(null)
  const inputRef      = useRef<HTMLInputElement>(null)

  // ── Close dropdown on outside click ──────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ── Fetch suggestions from Nominatim ─────────────────────────────────────
  const searchAddress = useCallback(async (q: string) => {
    if (!q || q.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      setNoResults(false)
      return
    }

    setIsSearchingAddress(true)
    setNoResults(false)

    try {
      const url =
        `https://nominatim.openstreetmap.org/search?format=json` +
        `&q=${encodeURIComponent(q + ', Lamongan, Jawa Timur, Indonesia')}` +
        `&limit=7&addressdetails=1&countrycodes=id`

      const res  = await fetch(url, { headers: { 'Accept-Language': 'id' } })
      const data: NominatimResult[] = await res.json()

      const filtered = data.filter(isInLamongan)

      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0 || true) // always show (empty state included)
      setNoResults(filtered.length === 0)
    } catch {
      setSuggestions([])
      setNoResults(true)
    } finally {
      setIsSearchingAddress(false)
    }
  }, [])

  // ── Debounced input handler ───────────────────────────────────────────────
  const handleAddressInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setAddressQuery(val)
    setFormData({ ...formData, address: val })

    if (!val) {
      setSuggestions([])
      setShowSuggestions(false)
      setNoResults(false)
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => searchAddress(val), 650)
  }

  // ── Select a suggestion ───────────────────────────────────────────────────
  const handleSelect = (item: NominatimResult) => {
    setFormData({
      ...formData,
      address:   item.display_name,
      latitude:  item.lat,
      longitude: item.lon,
    })
    setAddressQuery(item.display_name)
    setShowSuggestions(false)
    setSuggestions([])
    inputRef.current?.blur()
  }

  // ── Clear address ─────────────────────────────────────────────────────────
  const handleClear = () => {
    setAddressQuery('')
    setFormData({ ...formData, address: '', latitude: '', longitude: '' })
    setSuggestions([])
    setShowSuggestions(false)
    setNoResults(false)
    inputRef.current?.focus()
  }

  // ── GPS auto-locate ───────────────────────────────────────────────────────
  const handleAutoLocate = () => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lon } = pos.coords
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
            { headers: { 'Accept-Language': 'id' } }
          )
          const data = await res.json()
          const addr = data?.display_name ?? `${lat.toFixed(5)}, ${lon.toFixed(5)}`
          setFormData({ ...formData, latitude: String(lat), longitude: String(lon), address: addr })
          setAddressQuery(addr)
        } catch {
          const addr = `${lat.toFixed(5)}, ${lon.toFixed(5)}`
          setFormData({ ...formData, latitude: String(lat), longitude: String(lon), address: addr })
          setAddressQuery(addr)
        } finally {
          setLocating(false)
        }
      },
      () => setLocating(false)
    )
  }

  // ── Map click → reverse geocode ───────────────────────────────────────────
  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'Accept-Language': 'id' } }
      )
      const data = await res.json()
      const addr = data?.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`
      setFormData({ ...formData, latitude: String(lat), longitude: String(lng), address: addr })
      setAddressQuery(addr)
    } catch {
      setFormData({ ...formData, latitude: String(lat), longitude: String(lng) })
    }
  }, [formData, setFormData])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
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
            { value: 'rendah', label: 'Rendah', color: 'text-green-700  bg-green-50  border-green-200  peer-checked:bg-green-500  peer-checked:border-green-500' },
            { value: 'sedang', label: 'Sedang', color: 'text-blue-700   bg-blue-50   border-blue-200   peer-checked:bg-blue-500   peer-checked:border-blue-500' },
            { value: 'tinggi', label: 'Tinggi', color: 'text-amber-700  bg-amber-50  border-amber-200  peer-checked:bg-amber-500  peer-checked:border-amber-500' },
            { value: 'urgent', label: 'Urgent', color: 'text-red-700    bg-red-50    border-red-200    peer-checked:bg-red-500    peer-checked:border-red-500' },
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

      {/* ── Lokasi ─────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-text">
          Lokasi Kejadian <span className="text-red-500">*</span>
        </label>

        {/* Autocomplete input wrapper */}
        <div ref={wrapperRef} className="relative">
          {/* Input row */}
          <div className="relative flex items-center">
            <MapPin size={16} className="absolute left-3 text-muted pointer-events-none z-10" />

            <input
              ref={inputRef}
              type="text"
              name="address"
              value={addressQuery}
              onChange={handleAddressInput}
              onFocus={() => {
                if (suggestions.length > 0 || noResults) setShowSuggestions(true)
              }}
              placeholder="Ketik alamat untuk pencarian otomatis..."
              autoComplete="off"
              className="w-full pl-10 pr-20 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              required
            />

            {/* Right buttons */}
            <div className="absolute right-2 flex items-center gap-1">
              {/* Clear */}
              {addressQuery && !isSearchingAddress && (
                <button
                  type="button"
                  onClick={handleClear}
                  title="Hapus"
                  className="p-1.5 rounded-lg hover:bg-red-50 text-muted hover:text-red-400 transition"
                >
                  <X size={14} />
                </button>
              )}

              {/* Loading spinner or search icon */}
              {isSearchingAddress ? (
                <span className="p-1.5 text-primary">
                  <Loader2 size={15} className="animate-spin" />
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => searchAddress(addressQuery)}
                  disabled={!addressQuery}
                  title="Cari lokasi"
                  className="p-1.5 rounded-lg hover:bg-primary/10 text-muted hover:text-primary transition disabled:opacity-40"
                >
                  <Search size={15} />
                </button>
              )}

              {/* GPS */}
              <button
                type="button"
                onClick={handleAutoLocate}
                disabled={locating}
                title="Gunakan lokasi GPS"
                className="p-1.5 rounded-lg hover:bg-primary/10 text-muted hover:text-primary transition disabled:opacity-40"
              >
                {locating
                  ? <Loader2 size={15} className="animate-spin" />
                  : <LocateFixed size={15} />
                }
              </button>
            </div>
          </div>

          {/* ── Dropdown ─────────────────────────────────────────────────── */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                key="suggestions"
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-border rounded-2xl shadow-xl overflow-hidden"
                style={{ maxHeight: '280px', overflowY: 'auto' }}
              >
                {/* Header badge */}
                <div className="flex items-center justify-between px-3 py-2 bg-primary/5 border-b border-border/60">
                  <span className="flex items-center gap-1.5 text-[10px] font-semibold text-primary uppercase tracking-wide">
                    <MapPin size={10} />
                    Hasil Pencarian — Lamongan
                  </span>
                  {isSearchingAddress && (
                    <span className="text-[10px] text-muted flex items-center gap-1">
                      <Loader2 size={9} className="animate-spin" /> Mencari...
                    </span>
                  )}
                </div>

                {/* Empty state */}
                {noResults && !isSearchingAddress && (
                  <div className="px-4 py-6 text-center">
                    <MapPin size={20} className="mx-auto text-muted/40 mb-2" />
                    <p className="text-sm text-muted font-medium">Alamat tidak ditemukan</p>
                    <p className="text-xs text-muted/70 mt-0.5">
                      Coba kata kunci lain atau pindahkan pin di peta
                    </p>
                  </div>
                )}

                {/* Suggestion items */}
                {suggestions.map((item, idx) => {
                  const { main, sub } = parseLabel(item)
                  return (
                    <motion.button
                      key={item.place_id}
                      type="button"
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      onClick={() => handleSelect(item)}
                      className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-primary/5 active:bg-primary/10 transition-colors border-b border-border/40 last:border-0 group"
                    >
                      {/* Pin icon */}
                      <div className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                        <MapPin size={13} className="text-primary" />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text truncate leading-tight">
                          <HighlightText text={main} query={addressQuery} />
                        </p>
                        {sub && (
                          <p className="text-xs text-muted mt-0.5 truncate">
                            {sub}
                          </p>
                        )}
                      </div>
                    </motion.button>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Koordinat badge */}
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

      {/* Konfirmasi */}
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
            setAddressQuery('')
            setSuggestions([])
            setShowSuggestions(false)
            setNoResults(false)
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