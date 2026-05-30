'use client'

import { useState } from 'react'
import { Search, Bell, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

interface TopbarProps {
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
}

export default function Topbar({ sidebarOpen, setSidebarOpen }: TopbarProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border h-16 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-bg transition-colors"
        >
          <Menu size={20} />
        </button>

        <div className="hidden md:flex items-center gap-2 bg-bg border border-border rounded-full px-4 py-2 w-80">
          <Search size={16} className="text-muted" />
          <input
            type="text"
            placeholder="Cari laporan atau informasi..."
            className="bg-transparent outline-none text-sm flex-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Mobile search toggle */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-bg"
        >
          <Search size={18} />
        </button>

        {/* Notifications */}
        <Link href="/notifikasi">
          <button className="relative p-2 rounded-lg hover:bg-bg transition-colors">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>
        </Link>

        {/* User */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-text">{user?.name || 'User'}</p>
            <p className="text-xs text-muted">{user?.email || ''}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm overflow-hidden flex-shrink-0">
            {user?.avatar && user.avatar.startsWith('http') ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{user?.name?.[0]?.toUpperCase() ?? 'U'}</span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 right-0 bg-white p-4 border-b border-border shadow-lg md:hidden"
          >
            <div className="flex items-center gap-2 bg-bg border border-border rounded-full px-4 py-2">
              <Search size={16} className="text-muted" />
              <input
                type="text"
                placeholder="Cari laporan..."
                className="bg-transparent outline-none text-sm flex-1"
                autoFocus
              />
              <button onClick={() => setSearchOpen(false)}>
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}