'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, Save, User, Phone, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '@/services/api'
import { useAuth } from '@/hooks/useAuth'

interface ProfileForm {
  nama:    string
  email:   string
  no_telp: string
}

interface PasswordForm {
  password_lama:              string
  password_baru:              string
  password_baru_confirmation: string
}

export default function EditProfilPage() {
  const router     = useRouter()
  const { user, refreshUser } = useAuth()

  const [tab, setTab] = useState<'profil' | 'password'>('profil')

  // ── Profil form ──
  const [profile, setProfile]         = useState<ProfileForm>({ nama: '', email: '', no_telp: '' })
  const [savingProfile, setSaving]    = useState(false)

  // ── Password form ──
  const [passwords, setPasswords]     = useState<PasswordForm>({
    password_lama: '', password_baru: '', password_baru_confirmation: '',
  })
  const [showPw, setShowPw]           = useState({ current: false, new: false, confirm: false })
  const [savingPw, setSavingPw]       = useState(false)

  useEffect(() => {
    if (user) {
      setProfile({
        nama:    user.name    ?? '',
        email:   user.email   ?? '',
        no_telp: user.phone   ?? '',
      })
    }
  }, [user])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/profil', profile)
      await refreshUser()   // refresh user di context
      toast.success('Profil berhasil diperbarui')
    } catch (err: any) {
      const errors = err?.response?.data?.errors
      if (errors) {
        const first = Object.values(errors)[0] as string[]
        toast.error(first[0])
      } else {
        toast.error(err?.response?.data?.message ?? 'Gagal memperbarui profil')
      }
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.password_baru !== passwords.password_baru_confirmation) {
      toast.error('Konfirmasi password tidak cocok')
      return
    }
    setSavingPw(true)
    try {
      await api.put('/profil/password', passwords)
      toast.success('Password berhasil diubah')
      setPasswords({ password_lama: '', password_baru: '', password_baru_confirmation: '' })
    } catch (err: any) {
      const errors = err?.response?.data?.errors
      if (errors) {
        const first = Object.values(errors)[0] as string[]
        toast.error(first[0])
      } else {
        toast.error(err?.response?.data?.message ?? 'Gagal mengubah password')
      }
    } finally {
      setSavingPw(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-primary font-semibold mb-6 hover:underline"
      >
        <ArrowLeft size={18} /> Kembali
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-text mb-1">Edit Profil</h1>
        <p className="text-sm text-muted mb-6">Perbarui informasi akun Anda</p>

        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          {(['profil', 'password'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-sm font-semibold capitalize transition-all ${
                tab === t
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted hover:text-text'
              }`}
            >
              {t === 'profil' ? 'Data Diri' : 'Ubah Password'}
            </button>
          ))}
        </div>

        {/* ── Tab: Profil ── */}
        {tab === 'profil' && (
          <form onSubmit={handleProfileSubmit} className="card p-6 space-y-5">
            <InputField
              icon={User}
              label="Nama Lengkap"
              name="nama"
              value={profile.nama}
              onChange={e => setProfile({ ...profile, nama: e.target.value })}
              placeholder="Nama lengkap Anda"
              required
            />
            <InputField
              icon={Mail}
              label="Email"
              name="email"
              type="email"
              value={profile.email}
              onChange={e => setProfile({ ...profile, email: e.target.value })}
              placeholder="email@contoh.com"
              required
            />
            <InputField
              icon={Phone}
              label="Nomor Telepon"
              name="no_telp"
              type="tel"
              value={profile.no_telp}
              onChange={e => setProfile({ ...profile, no_telp: e.target.value })}
              placeholder="08xxxxxxxxxx"
            />

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full h-12 rounded-2xl bg-primary text-white font-semibold flex items-center justify-center gap-2 hover:bg-primary-hover transition-all disabled:opacity-60"
            >
              {savingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {savingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        )}

        {/* ── Tab: Password ── */}
        {tab === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="card p-6 space-y-5">
            <PasswordField
              label="Password Saat Ini"
              value={passwords.password_lama}
              show={showPw.current}
              onToggle={() => setShowPw(s => ({ ...s, current: !s.current }))}
              onChange={e => setPasswords({ ...passwords, password_lama: e.target.value })}
              placeholder="Masukkan password lama"
              required
            />
            <PasswordField
              label="Password Baru"
              value={passwords.password_baru}
              show={showPw.new}
              onToggle={() => setShowPw(s => ({ ...s, new: !s.new }))}
              onChange={e => setPasswords({ ...passwords, password_baru: e.target.value })}
              placeholder="Minimal 8 karakter"
              required
            />
            <PasswordField
              label="Konfirmasi Password Baru"
              value={passwords.password_baru_confirmation}
              show={showPw.confirm}
              onToggle={() => setShowPw(s => ({ ...s, confirm: !s.confirm }))}
              onChange={e => setPasswords({ ...passwords, password_baru_confirmation: e.target.value })}
              placeholder="Ulangi password baru"
              required
            />

            {/* Strength indicator */}
            {passwords.password_baru && (
              <PasswordStrength password={passwords.password_baru} />
            )}

            <button
              type="submit"
              disabled={savingPw}
              className="w-full h-12 rounded-2xl bg-primary text-white font-semibold flex items-center justify-center gap-2 hover:bg-primary-hover transition-all disabled:opacity-60"
            >
              {savingPw ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
              {savingPw ? 'Menyimpan...' : 'Ubah Password'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function InputField({
  icon: Icon, label, ...props
}: {
  icon: React.ElementType
  label: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-sm font-semibold text-text mb-1">{label}</label>
      <div className="relative">
        <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          {...props}
          className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
        />
      </div>
    </div>
  )
}

function PasswordField({
  label, value, show, onToggle, onChange, placeholder, required,
}: {
  label: string
  value: string
  show: boolean
  onToggle: () => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-text mb-1">{label}</label>
      <div className="relative">
        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full pl-10 pr-10 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  )
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'Minimal 8 karakter', pass: password.length >= 8 },
    { label: 'Mengandung angka',   pass: /\d/.test(password) },
    { label: 'Huruf besar',        pass: /[A-Z]/.test(password) },
    { label: 'Karakter spesial',   pass: /[^a-zA-Z0-9]/.test(password) },
  ]
  const score = checks.filter(c => c.pass).length
  const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500']
  const labels = ['Lemah', 'Cukup', 'Baik', 'Kuat']

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[0,1,2,3].map(i => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              i < score ? colors[score - 1] : 'bg-gray-100'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-muted">
        Kekuatan: <span className="font-semibold">{labels[score - 1] ?? 'Lemah'}</span>
      </p>
      <div className="grid grid-cols-2 gap-1">
        {checks.map(c => (
          <p key={c.label} className={`text-xs flex items-center gap-1 ${c.pass ? 'text-green-600' : 'text-muted'}`}>
            <span>{c.pass ? '✓' : '○'}</span> {c.label}
          </p>
        ))}
      </div>
    </div>
  )
}