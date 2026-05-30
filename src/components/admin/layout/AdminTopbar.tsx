'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Bell, Zap, FileText, Users, MapPin, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

// Kategori pencarian — menentukan ke halaman mana query diarahkan
const SEARCH_CATEGORIES = [
  {
    label: 'Laporan',
    icon: FileText,
    description: 'Cari berdasarkan judul atau alamat laporan',
    href: (q: string) => `/admin/reports?search=${encodeURIComponent(q)}`,
    keywords: ['laporan', 'jalan', 'jembatan', 'fasilitas', 'rusak', 'kerusakan'],
  },
  {
    label: 'Pengguna',
    icon: Users,
    description: 'Cari berdasarkan nama atau email pengguna',
    href: (q: string) => `/admin/users?search=${encodeURIComponent(q)}`,
    keywords: ['user', 'pengguna', 'warga', 'email', 'akun'],
  },
  {
    label: 'Kecamatan',
    icon: MapPin,
    description: 'Lihat laporan berdasarkan wilayah',
    href: (q: string) => `/admin/reports?daerah=${encodeURIComponent(q)}`,
    keywords: ['kecamatan', 'daerah', 'wilayah', 'lamongan', 'lokasi'],
  },
]

// Deteksi kategori dari kata kunci yang diketik
function detectCategory(query: string) {
  const lower = query.toLowerCase()
  for (const cat of SEARCH_CATEGORIES) {
    if (cat.keywords.some((kw) => lower.includes(kw))) return cat
  }
  return SEARCH_CATEGORIES[0] // default: laporan
}

export default function AdminTopbar() {
  const router = useRouter()
  const { user } = useAuth()

  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)   // mobile
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const detected = query.trim() ? detectCategory(query) : null

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setDropdownOpen(true)
      }
      if (e.key === 'Escape') {
        setDropdownOpen(false)
        inputRef.current?.blur()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    const cat = detectCategory(query)
    router.push(cat.href(query.trim()))
    setDropdownOpen(false)
    setQuery('')
  }

  function handleCategorySearch(cat: typeof SEARCH_CATEGORIES[0]) {
    if (!query.trim()) return
    router.push(cat.href(query.trim()))
    setDropdownOpen(false)
    setQuery('')
  }

  return (
    <header className="sticky top-4 z-40 h-16 flex items-center justify-between px-6 bg-white/90 backdrop-blur-xl border border-border rounded-2xl shadow-sm">

      {/* Search Bar — Desktop */}
      <div ref={wrapperRef} className="relative hidden md:block">
        <form onSubmit={handleSearch}>
          <div className="flex items-center gap-2 bg-bg border border-border rounded-full px-4 py-2 w-96 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Search size={16} className="text-muted flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setDropdownOpen(e.target.value.length > 0)
              }}
              onFocus={() => query.length > 0 && setDropdownOpen(true)}
              placeholder="Cari laporan, pengguna, atau kecamatan..."
              className="bg-transparent outline-none text-sm flex-1 min-w-0"
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); setDropdownOpen(false) }}
                className="text-muted hover:text-text transition-colors"
              >
                <X size={14} />
              </button>
            )}
            {!query && <kbd className="text-xs text-muted hidden lg:inline">⌘K</kbd>}
          </div>
        </form>

        {/* Search Dropdown */}
        <AnimatePresence>
          {dropdownOpen && query.trim() && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute top-12 left-0 w-96 bg-white rounded-2xl shadow-xl border border-border overflow-hidden z-50"
            >
              {/* Detected category hint */}
              {detected && (
                <div className="px-4 py-2.5 bg-primary/5 border-b border-border flex items-center gap-2">
                  <detected.icon size={14} className="text-primary" />
                  <span className="text-xs text-primary font-medium">
                    Mencari di <strong>{detected.label}</strong> — tekan Enter untuk melanjutkan
                  </span>
                </div>
              )}

              {/* All category options */}
              <div className="py-2">
                <p className="px-4 py-1.5 text-xs font-semibold text-muted uppercase tracking-wide">
                  Cari di
                </p>
                {SEARCH_CATEGORIES.map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => handleCategorySearch(cat)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-bg transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <cat.icon size={15} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text">{cat.label}</p>
                      <p className="text-xs text-muted truncate">{cat.description}</p>
                    </div>
                    <span className="text-xs text-muted bg-bg px-2 py-0.5 rounded-full truncate max-w-[100px]">
                      "{query}"
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Real-time indicator */}
        <div className="hidden sm:flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
          <Zap size={12} className="text-green-600" />
          <span className="text-xs font-semibold text-green-700">Live</span>
        </div>

        {/* Notifikasi */}
        <button className="relative p-2 rounded-lg hover:bg-bg transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        {/* Admin Info */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-text">{user?.name ?? 'Admin SWARA'}</p>
            <p className="text-xs text-muted">Super Administrator</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.[0]?.toUpperCase() ?? 'A'}
          </div>
        </div>

        {/* Mobile Search Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-bg"
          onClick={() => setSearchOpen(true)}
        >
          <Search size={18} />
        </button>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-4 right-4 bg-white rounded-2xl border border-border shadow-xl p-4 md:hidden z-50"
          >
            <form onSubmit={(e) => { handleSearch(e); setSearchOpen(false) }}>
              <div className="flex items-center gap-2 bg-bg border border-border rounded-full px-4 py-2">
                <Search size={16} className="text-muted" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari laporan, pengguna..."
                  className="bg-transparent outline-none text-sm flex-1"
                  autoFocus
                />
                <button type="button" onClick={() => { setSearchOpen(false); setQuery('') }}>
                  <X size={16} className="text-muted" />
                </button>
              </div>
            </form>

            {/* Mobile category shortcuts */}
            {query.trim() && (
              <div className="mt-3 space-y-1">
                {SEARCH_CATEGORIES.map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => { handleCategorySearch(cat); setSearchOpen(false) }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-bg transition-colors text-left"
                  >
                    <cat.icon size={16} className="text-primary" />
                    <span className="text-sm text-text">
                      Cari <strong>"{query}"</strong> di {cat.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}