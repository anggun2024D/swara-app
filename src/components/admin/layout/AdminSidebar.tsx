'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  FileText,
  Map,
  BarChart3,
  Users,
  Bell,
  CheckSquare,
  LogOut,
  Activity,
  Compass,
  ArrowLeft,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const menuItems = [
  { name: 'Dashboard',       href: '/admin/dashboard',       icon: LayoutDashboard },
  { name: 'Kelola Potensi',  href: '/admin/potensi',         icon: FileText        },
  { name: 'Peta Monitoring', href: '/admin/map-monitoring',  icon: Map             },
  { name: 'Analytics',       href: '/admin/analytics',       icon: BarChart3       },
  { name: 'Verifikasi',      href: '/admin/verification',    icon: CheckSquare     },
  { name: 'Notifikasi',      href: '/admin/notifications',   icon: Bell            },
  { name: 'Pengguna',        href: '/admin/users',           icon: Users           },
]

export default function AdminSidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
}) {
  const pathname = usePathname()
  const { logout, user } = useAuth()

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, type: 'spring', damping: 20 }}
      className="fixed left-0 top-0 h-screen bg-gradient-to-b from-[#0a2418] to-[#0f2f20] shadow-2xl z-50 flex flex-col"
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-10 py-6 border-b border-white/10">
        <div className="flex items-center gap-0 overflow-hidden">
          <div className="relative w-11 h-11 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="SWARA Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-extrabold text-[25px] text-white tracking-tight whitespace-nowrap leading-none"
            >
              SWARA
            </motion.span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white/50 hover:text-white transition-colors"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Admin Profile Mini */}
      {!collapsed && (
        <div className="mx-4 mt-6 p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
              <p className="text-white/50 text-xs">Administrator</p>
            </div>
            <Activity className="w-4 h-4 text-green-500" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 5 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gold/20 text-gold border-l-4 border-gold'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                {!collapsed && <span className="font-medium text-sm">{item.name}</span>}
              </motion.div>
            </Link>
          )
        })}

        {/* Divider */}
        <div className="py-2">
          <div className="border-t border-white/10" />
        </div>

        {/* Kembali ke Landing Page */}
        <Link href="/">
          <motion.div
            whileHover={{ x: 5 }}
            title={collapsed ? 'Kembali ke Beranda' : undefined}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer text-white/50 hover:bg-white/10 hover:text-white/90"
          >
            <ArrowLeft size={20} />
            {!collapsed && <span className="font-medium text-sm">Kembali ke Beranda</span>}
          </motion.div>
        </Link>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-red-500/20 hover:text-red-400 transition-all"
        >
          <LogOut size={20} />
          {!collapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>

      {/* System Status */}
      {!collapsed && (
        <div className="p-4 border-t border-white/10 text-white/40 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Sistem Real-time Aktif</span>
          </div>
        </div>
      )}
    </motion.aside>
  )
}