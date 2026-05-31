'use client'

import { useState, useRef } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '@/services/api'
import type { AuthUser } from '@/types'
import { useAuth } from '@/hooks/useAuth'  // ✅ fix import

export default function ProfilAvatar({ user }: { user: AuthUser | null }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview]     = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const { refreshUser } = useAuth()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
    setUploading(true)

    try {
      const fd = new globalThis.FormData()
      fd.append('foto', file)
      await api.post('/profil/foto', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      await refreshUser()
      setPreview(null)  // ✅ biarkan avatar dari context yang tampil
      toast.success('Foto profil berhasil diperbarui')
    } catch {
      toast.error('Gagal mengupload foto')
      setPreview(null)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''  // ✅ reset input
    }
  }

  // Setelah upload sukses, preview null → pakai user.avatar dari context (sudah refresh)
  const avatarSrc = preview ?? user?.avatar ?? null
  const initials  = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <div className="card p-6 text-center bg-primary text-white rounded-2xl">
      <div className="relative inline-block">
        <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/30 mx-auto overflow-hidden flex items-center justify-center">
          {avatarSrc ? (
            <img src={avatarSrc} alt={user?.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-bold">{initials}</span>
          )}
        </div>

        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gold flex items-center justify-center text-amber-900 border-2 border-white disabled:opacity-60"
        >
          {uploading
            ? <Loader2 size={13} className="animate-spin" />
            : <Camera size={14} />
          }
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpg,image/jpeg,image/png"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <h2 className="text-xl font-bold mt-3">{user?.name ?? '-'}</h2>
      <p className="text-white/70 text-sm">{user?.email ?? '-'}</p>
      {user?.phone && (
        <p className="text-white/50 text-xs mt-0.5">{user.phone}</p>
      )}
    </div>
  )
}