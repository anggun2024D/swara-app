'use client'

import { useParams, useRouter } from 'next/navigation'
import { useUserDetail } from '@/hooks/useUserDetail'
import {
  ArrowLeft, User, Mail, Phone, Shield,
  FileText, Calendar, RefreshCw
} from 'lucide-react'
import { motion } from 'framer-motion'

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      {children}
    </span>
  )
}

function InfoRow({ icon: Icon, label, value }: {
  icon: React.ElementType
  label: string
  value: string | number | null | undefined
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
        <Icon size={15} className="text-gray-400" />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-800 mt-0.5">{value ?? '-'}</p>
      </div>
    </div>
  )
}

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router  = useRouter()
  const { user, isLoading, error, refetch } = useUserDetail(id)

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">Detail Pengguna</h1>
        </div>
        <button
          onClick={refetch}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          title="Refresh"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-sm text-red-500 mb-3">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Skeleton */}
      {isLoading && (
        <div className="bg-white rounded-2xl shadow-sm border border-border p-6 animate-pulse space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-100" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-100 rounded w-32" />
              <div className="h-3 bg-gray-100 rounded w-20" />
            </div>
          </div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded" />
          ))}
        </div>
      )}

      {/* Content */}
      {!isLoading && user && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-border p-6 space-y-1"
        >
          {/* Avatar + nama */}
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            {user.foto ? (
              <img
                src={user.foto}
                alt={user.nama}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <User size={28} className="text-gray-400" />
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-gray-900">{user.nama}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge color={user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}>
                  <Shield size={10} />
                  {user.role}
                </Badge>
                <Badge color={user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                  {user.is_active ? 'Aktif' : 'Nonaktif'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Info rows */}
          <InfoRow icon={Mail}     label="Email"          value={user.email} />
          <InfoRow icon={Phone}    label="No. Telepon"    value={user.no_telp} />
          <InfoRow icon={FileText} label="Total Laporan"  value={user.total_laporan} />
          <InfoRow icon={Calendar} label="Bergabung Pada" value={user.bergabung_pada} />
        </motion.div>
      )}
    </div>
  )
}