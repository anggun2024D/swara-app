'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  PlusCircle,
  Briefcase,
  Share2,
  Bookmark,
  BarChart3,
  User,
  LogOut,
  ArrowLeft,
} from 'lucide-react'

import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'

interface SidebarProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tambah Potensi', href: '/potensi/baru', icon: PlusCircle },
  { name: 'Potensi Saya', href: '/potensi', icon: Briefcase },
  { name: 'Kolaborasi', href: '/kolaborasi', icon: Share2 },
  { name: 'Peluang Tersimpan', href: '/peluang-tersimpan', icon: Bookmark },
  { name: 'Economic Insights', href: '/economic-insights', icon: BarChart3 },
  { name: 'Profil', href: '/profil', icon: User },
]

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname()
  const { logout, user } = useAuth()

  const sidebarVariants = {
    open: {
      width: 240,
      minWidth: 240,
      transition: { duration: 0.3, type: 'spring', damping: 20 },
    },
    closed: {
      width: 80,
      minWidth: 80,
      transition: { duration: 0.3, type: 'spring', damping: 20 },
    },
  }

  return (
    <motion.aside
      variants={sidebarVariants}
      animate={isOpen ? 'open' : 'closed'}
      className="fixed left-0 top-0 h-screen overflow-hidden bg-white border-r border-border z-50 flex flex-col shadow-sm"
    >
      {/* Logo */}
      <div
        className="flex items-center gap-0 px-10 py-5 border-b border-border cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-12 h-12 flex items-center justify-center">
          <Image
            src="/Mask group.png"
            alt="SWARA Logo"
            width={30}
            height={30}
            className="object-contain"
          />
        </div>
        {isOpen && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-extrabold text-[25px] text-primary tracking-wide flex items-center"
          >
            SWARA
          </motion.span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item, idx) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'text-muted hover:bg-primary-light hover:text-primary'
                }`}
                whileHover={{ x: 4 }}
              >
                <item.icon size={20} />
                {isOpen && <span className="font-medium text-sm">{item.name}</span>}
              </motion.div>
            </Link>
          )
        })}

        {/* Divider */}
        <div className="pt-2 pb-1">
          <div className="border-t border-border" />
        </div>

        {/* Kembali ke Landing Page */}
        <Link href="/">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: navItems.length * 0.05 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer text-muted hover:bg-gray-100 hover:text-text"
            whileHover={{ x: 4 }}
            title={!isOpen ? 'Kembali ke Beranda' : undefined}
          >
            <ArrowLeft size={20} />
            {isOpen && <span className="font-medium text-sm">Kembali ke Beranda</span>}
          </motion.div>
        </Link>
      </nav>

      {/* Bottom: User info & Logout */}
      <div className="p-4 border-t border-border">
        {isOpen && user && (
          <div className="mb-3 px-2 py-1">
            <p className="text-xs text-muted">Logged in as</p>
            <p className="text-sm font-semibold text-primary truncate">{user.name}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center border-red justify-center gap-2 text-red-600 bg-red-50 rounded-lg py-2"
        >
          <LogOut size={18} />
          {isOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </motion.aside>
  )
}