'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User, Mail, Shield, Eye, Search,
  ChevronLeft, ChevronRight, RefreshCw,
} from 'lucide-react'
import { useUsers } from '@/hooks/useUsers'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: 'user' | 'admin' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
        ${role === 'admin'
          ? 'bg-purple-100 text-purple-700'
          : 'bg-blue-100 text-blue-700'}`}
    >
      <Shield size={10} />
      {role}
    </span>
  )
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium
        ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
    >
      {isActive ? 'Aktif' : 'Nonaktif'}
    </span>
  )
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100 animate-pulse">
      {[...Array(7)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-100 rounded w-3/4" />
        </td>
      ))}
    </tr>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [searchInput, setSearchInput] = useState('')

  const { users, pagination, isLoading, error, filters, setFilters, setPage, refetch } =
    useUsers({ per_halaman: 15 })

  // Submit search on Enter atau tombol Search
  const handleSearch = () => {
    setFilters({ search: searchInput.trim() })
  }

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Manajemen Pengguna</h1>
          {pagination && (
            <p className="text-sm text-gray-500 mt-0.5">
              Total {pagination.total} pengguna terdaftar
            </p>
          )}
        </div>
        <button
          onClick={refetch}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          title="Refresh"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-border p-4 flex flex-wrap gap-3">
        {/* Search */}
        <div className="flex-1 min-w-[200px] flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau email…"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Cari
          </button>
        </div>

        {/* Filter Role */}
        <select
          value={filters.role ?? ''}
          onChange={e => setFilters({ role: e.target.value as 'user' | 'admin' | '' })}
          className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none
            focus:ring-2 focus:ring-primary/30 bg-white"
        >
          <option value="">Semua Role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        {/* Filter Status */}
        <select
          value={filters.status ?? ''}
          onChange={e => setFilters({ status: e.target.value as 'aktif' | 'nonaktif' | '' })}
          className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none
            focus:ring-2 focus:ring-primary/30 bg-white"
        >
          <option value="">Semua Status</option>
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
        </select>
      </div>

      {/* ── Tabel ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        {/* Error state */}
        {error && (
          <div className="p-6 text-center">
            <p className="text-sm text-red-500 mb-3">{error}</p>
            <button
              onClick={refetch}
              className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg
                hover:bg-red-100 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Nama</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Role</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Laporan</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Bergabung</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {/* Loading skeleton */}
                {isLoading &&
                  [...Array(8)].map((_, i) => <SkeletonRow key={i} />)}

                {/* Empty state */}
                {!isLoading && users.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">
                      {filters.search || filters.role || filters.status
                        ? 'Tidak ada pengguna yang sesuai filter.'
                        : 'Belum ada pengguna terdaftar.'}
                    </td>
                  </tr>
                )}

                {/* Data rows */}
                {!isLoading &&
                  users.map((user, i) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      {/* Nama + avatar */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {user.foto ? (
                            <img
                              src={user.foto}
                              alt={user.nama}
                              className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center
                              justify-center flex-shrink-0">
                              <User size={13} className="text-gray-400" />
                            </div>
                          )}
                          <span className="font-medium text-gray-800">{user.nama}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3 text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Mail size={12} className="text-gray-400 flex-shrink-0" />
                          {user.email}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3">
                        <RoleBadge role={user.role} />
                      </td>

                      {/* Total laporan */}
                      <td className="px-4 py-3 text-gray-700 font-medium">
                        {user.total_laporan}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusBadge isActive={user.is_active} />
                      </td>

                      {/* Bergabung */}
                      <td className="px-4 py-3 text-gray-500">{user.bergabung_pada}</td>

                      {/* Aksi */}
                      <td className="px-4 py-3">
                        <button
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400
                            hover:text-gray-600 transition-colors"
                          title="Lihat detail"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination ── */}
        {pagination && pagination.total_halaman > 1 && (
          <div className="px-4 py-3 border-t border-border flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Halaman {pagination.halaman_ini} dari {pagination.total_halaman}
              {' '}({pagination.total} pengguna)
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(pagination.halaman_ini - 1)}
                disabled={pagination.halaman_ini <= 1 || isLoading}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40
                  disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Nomor halaman */}
              {Array.from({ length: Math.min(pagination.total_halaman, 5) }, (_, i) => {
                // Tampilkan 5 halaman di sekitar halaman aktif
                const half = 2
                let start = Math.max(1, pagination.halaman_ini - half)
                const end   = Math.min(pagination.total_halaman, start + 4)
                start       = Math.max(1, end - 4)
                return start + i
              }).map(page => (
                <button
                  key={page}
                  onClick={() => setPage(page)}
                  disabled={isLoading}
                  className={`w-7 h-7 text-xs rounded-lg transition-colors
                    ${page === pagination.halaman_ini
                      ? 'bg-primary text-white font-medium'
                      : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setPage(pagination.halaman_ini + 1)}
                disabled={pagination.halaman_ini >= pagination.total_halaman || isLoading}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40
                  disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}