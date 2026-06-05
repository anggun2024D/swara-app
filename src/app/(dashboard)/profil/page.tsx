'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ProfilAvatar from '@/components/profil/ProfilAvatar'
import ProfilMenu   from '@/components/profil/ProfilMenu'
import { useAuth }  from '@/hooks/useAuth'
import api from '@/services/api'

export default function ProfilPage() {
  const { user, refreshUser } = useAuth()
  const [toggleLoading, setToggleLoading] = useState(false)

  const isBusinessOwner = (user as any)?.is_business_owner || false
  const isInvestor = (user as any)?.is_investor || false
  const isCommunityContributor = (user as any)?.is_community_contributor || false
  const badges = (user as any)?.badges || []
  const totalVerifications = (user as any)?.total_verifications_given || 0

  const handleToggleInvestor = async () => {
    setToggleLoading(true)
    try {
      await api.put('/profil/investor')
      if (refreshUser) await refreshUser()
    } catch (err) {
      console.error(err)
    } finally {
      setToggleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-6xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6 max-w-lg mx-auto"
        >
          {/* Avatar */}
          <ProfilAvatar user={user} />

          {/* Dynamic Status Badges */}
          <div className="flex flex-wrap gap-2">
            {isBusinessOwner && (
              <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium border border-amber-200">🏭 Business Owner</span>
            )}
            {isInvestor && (
              <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">💰 Investor</span>
            )}
            {isCommunityContributor && (
              <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium border border-blue-200">🏅 Community Contributor</span>
            )}
            {badges.map((b: any) => (
              <span key={b.key} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium border border-purple-200">
                {b.icon} {b.label}
              </span>
            ))}
          </div>

          {/* Activity Stats */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Verifikasi" value={totalVerifications} icon="✅" />
            <StatCard label="Status" value={isBusinessOwner ? '🏭' : '👤'} isText />
            <StatCard label="Role" value={user?.role === 'admin' ? 'Admin' : 'User'} isText />
          </div>

          {/* Investor Toggle Card */}
          <div className={`p-4 rounded-xl border transition-all ${
            isInvestor
              ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'
              : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isInvestor ? 'bg-emerald-500' : 'bg-gray-300'
                }`}>
                  <span className="text-lg">💰</span>
                </div>
                <div>
                  <p className={`font-bold text-sm ${isInvestor ? 'text-emerald-800' : 'text-gray-700'}`}>
                    Profil Investor
                  </p>
                  <p className={`text-xs ${isInvestor ? 'text-emerald-600' : 'text-gray-500'}`}>
                    {isInvestor ? 'Aktif — Anda terlihat di papan investor' : 'Nonaktif — Aktifkan untuk melihat peluang investasi'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleToggleInvestor}
                disabled={toggleLoading}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-50 ${
                  isInvestor
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'
                }`}
              >
                {toggleLoading ? '...' : isInvestor ? 'Nonaktifkan' : 'Aktifkan'}
              </button>
            </div>
          </div>

          {/* Community Progress */}
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center">
                <span className="text-lg">🏅</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-indigo-800">Community Contributor</p>
                <p className="text-xs text-indigo-600">
                  {isCommunityContributor
                    ? 'Anda sudah menjadi Community Contributor! 🎉'
                    : `${totalVerifications}/10 verifikasi — ${10 - totalVerifications} lagi untuk badge`
                  }
                </p>
                {!isCommunityContributor && (
                  <div className="mt-2 w-full bg-indigo-200 rounded-full h-1.5">
                    <div
                      className="bg-indigo-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${Math.min((totalVerifications / 10) * 100, 100)}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Menu */}
          <ProfilMenu />
        </motion.div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, isText }: { label: string; value: number | string; icon?: string; isText?: boolean }) {
  return (
    <div className="card p-3 text-center">
      {icon && <span className="text-lg">{icon}</span>}
      <p className={`${isText ? 'text-sm' : 'text-xl'} font-extrabold text-gray-900`}>{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  )
}