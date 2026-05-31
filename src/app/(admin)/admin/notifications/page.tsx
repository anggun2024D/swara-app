'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Send, AlertCircle, CheckCheck, Trash2, FileText, MapPin, Info } from 'lucide-react'
import { useNotifications } from '@/hooks/useNotifications'
import { useAdminDashboard } from '@/hooks/useAdminDashboard'
import { useBroadcast } from '@/hooks/useBroadcast'

// Icon per tipe notifikasi dari FCMService
const tipeIcon: Record<string, typeof Bell> = {
  laporan_baru:    FileText,
  laporan_dibuat:  Bell,
  status_update:   Info,
  lokasi:          MapPin,
}

const tipeColor: Record<string, string> = {
  laporan_baru:    'text-blue-500 bg-blue-50',
  laporan_dibuat:  'text-green-500 bg-green-50',
  status_update:   'text-yellow-500 bg-yellow-50',
  lokasi:          'text-purple-500 bg-purple-50',
}

type TabFilter = 'all' | 'unread' | 'read'

export default function NotificationsPage() {
  const { notifikasi, belumDibaca, isLoading, markAsRead, markAllAsRead, remove } = useNotifications()
  const { send, isLoading: isBroadcastLoading } = useBroadcast()
  const { metrics } = useAdminDashboard()   // untuk panel urgent reports

  const [activeTab, setActiveTab]       = useState<TabFilter>('all')
  const [broadcastMsg, setBroadcastMsg] = useState('')

  const [broadcastTitle, setBroadcastTitle] = useState('')
  const [targetRole, setTargetRole]         = useState<'user' | 'admin' | ''>('')

  const handleBroadcast = async () => {
    try {
      await send({
        title:       broadcastTitle,
        message:     broadcastMsg,
        target_role: targetRole || null,
      })
      setBroadcastTitle('')
      setBroadcastMsg('')
      setTargetRole('')
    } catch {
      // error sudah ditangani di hook
    }
  }

  const filtered = notifikasi.filter(n => {
    if (activeTab === 'unread') return !n.is_read
    if (activeTab === 'read')   return n.is_read
    return true
  })

  const sendBroadcast = () => {
    if (!broadcastMsg.trim()) return
    send({ title: 'Broadcast', message: broadcastMsg })
    setBroadcastMsg('')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* ── KIRI: Daftar Notifikasi ── */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">

          {/* Header */}
          <div className="p-5 border-b border-border flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg">Notifikasi</h2>
              {belumDibaca > 0 && (
                <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                  {belumDibaca}
                </span>
              )}
            </div>
            <button
              onClick={markAllAsRead}
              disabled={belumDibaca === 0}
              className="text-xs text-primary flex items-center gap-1 hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <CheckCheck size={14} /> Tandai semua dibaca
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-5 pt-3">
            {(['all', 'unread', 'read'] as TabFilter[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-muted hover:bg-gray-200'
                }`}
              >
                {tab === 'all' ? 'Semua' : tab === 'unread' ? 'Belum Dibaca' : 'Sudah Dibaca'}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="p-5 space-y-3">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse bg-gray-100 rounded-xl" />
              ))
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center text-muted text-sm">
                {activeTab === 'unread' ? 'Semua notifikasi sudah dibaca ✓' : 'Belum ada notifikasi'}
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {filtered.map((n, idx) => {
                  const Icon  = tipeIcon[n.tipe]  ?? Bell
                  const color = tipeColor[n.tipe] ?? 'text-gray-500 bg-gray-100'
                  return (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => !n.is_read && markAsRead(n.id)}
                      className={`flex gap-3 p-3 rounded-xl border cursor-pointer group transition-colors ${
                        !n.is_read
                          ? 'bg-primary/5 border-primary/20 hover:bg-primary/10'
                          : 'bg-white border-border hover:bg-gray-50'
                      }`}
                    >
                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                        <Icon size={15} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm ${!n.is_read ? 'font-semibold' : 'font-medium'}`}>
                            {n.judul}
                          </p>
                          {!n.is_read && (
                            <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-muted mt-0.5 line-clamp-2">{n.pesan}</p>
                        <p className="text-xs text-muted mt-1">{n.dibuat_pada}</p>
                      </div>

                      {/* Hapus */}
                      <button
                        onClick={e => { e.stopPropagation(); remove(n.id) }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-muted hover:text-red-500 transition-all shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* ── KANAN: Sidebar ── */}
      <div className="space-y-5">

        {/* Broadcast */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-border">
          <h3 className="font-bold mb-3">Kirim Broadcast</h3>

          <input
            type="text"
            value={broadcastTitle}
            onChange={e => setBroadcastTitle(e.target.value)}
            placeholder="Judul notifikasi..."
            className="w-full p-3 border border-border rounded-xl text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />

          <textarea
            rows={3}
            value={broadcastMsg}
            onChange={e => setBroadcastMsg(e.target.value)}
            placeholder="Tulis pengumuman untuk pengguna..."
            className="w-full p-3 border border-border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
          />

          {/* Target penerima */}
          <div className="flex gap-2 mt-2">
            {(['', 'user', 'admin'] as const).map(role => (
              <button
                key={role}
                onClick={() => setTargetRole(role)}
                className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${
                  targetRole === role
                    ? 'bg-primary text-white border-primary'
                    : 'border-border text-muted hover:border-primary/40'
                }`}
              >
                {role === '' ? 'Semua' : role === 'user' ? 'User' : 'Admin'}
              </button>
            ))}
          </div>

          <button
            onClick={handleBroadcast}
            disabled={!broadcastTitle.trim() || !broadcastMsg.trim() || isBroadcastLoading}
            className="mt-3 w-full bg-primary text-white py-2 rounded-xl flex items-center justify-center gap-2 text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isBroadcastLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={16} />
            )}
            {isBroadcastLoading ? 'Mengirim...' : 'Kirim Broadcast'}
          </button>
        </div>

        {/* Urgent Reports — reuse dari useAdminDashboard */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-red-200">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={16} className="text-red-500" />
            <span className="font-bold">Laporan Urgent</span>
            {metrics?.urgent !== undefined && (
              <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">
                {metrics.urgent}
              </span>
            )}
          </div>
          {(metrics?.urgentReports ?? []).length === 0 ? (
            <p className="text-sm text-muted">Tidak ada laporan urgent saat ini 🎉</p>
          ) : (
            <div className="space-y-2">
              {metrics!.urgentReports.map(r => (
                <div key={r.id} className="text-sm p-2 bg-red-50 rounded-lg border border-red-100">
                  <p className="font-medium">{r.judul}</p>
                  <p className="text-xs text-muted mt-0.5">{r.lokasi.address}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ringkasan */}
        {/* <div className="bg-white rounded-2xl p-5 shadow-sm border border-border">
          <h3 className="font-bold mb-3">Ringkasan</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Total notifikasi</span>
              <span className="font-medium">{notifikasi.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Belum dibaca</span>
              <span className="font-medium text-primary">{belumDibaca}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Sudah dibaca</span>
              <span className="font-medium">{notifikasi.length - belumDibaca}</span>
            </div>
          </div>
        </div> */}

      </div>
    </div>
  )
}