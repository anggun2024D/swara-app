'use client'

import { Settings, LogOut, Bell, FileText, HelpCircle, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'react-hot-toast'
import api from '@/services/api'

const menuItems = [
  {
    icon: FileText,
    label: 'Riwayat Laporan',
    description: 'Lihat semua laporan yang pernah dibuat',
    href: '/riwayat',
  },
  {
    icon: Bell,
    label: 'Notifikasi',
    description: 'Atur preferensi notifikasi',
    href: '/notifikasi',
  },
  {
    icon: Settings,
    label: 'Edit Profil',
    description: 'Ubah nama, nomor telepon',
    href: '/profil/edit',
  },
  {
    icon: HelpCircle,
    label: 'Pusat Bantuan',
    description: 'FAQ & dukungan',
    href: '/bantuan',
  },
]

export default function ProfilMenu() {
  const router    = useRouter()
  const { logout } = useAuth()

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // Lanjut logout meski API gagal
    }
    logout()           // hapus token + user dari localStorage
    toast.success('Berhasil logout')
    router.push('/login')
  }

  return (
    <div className="card divide-y divide-border overflow-hidden">
      {menuItems.map(item => (
        <Link key={item.label} href={item.href}>
          <div className="flex items-center gap-4 p-5 hover:bg-bg transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
              <item.icon size={18} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-text">{item.label}</p>
              <p className="text-xs text-muted">{item.description}</p>
            </div>
            <ChevronRight size={16} className="text-muted group-hover:text-primary transition-colors" />
          </div>
        </Link>
      ))}

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-4 p-5 hover:bg-red-50 transition-all cursor-pointer group text-left"
      >
        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-100 transition-all">
          <LogOut size={18} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-red-600">Logout</p>
          <p className="text-xs text-muted">Keluar dari aplikasi</p>
        </div>
        <ChevronRight size={16} className="text-muted" />
      </button>
    </div>
  )
}