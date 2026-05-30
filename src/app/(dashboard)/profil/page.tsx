'use client'

import { motion } from 'framer-motion'
import ProfilAvatar from '@/components/profil/ProfilAvatar'
import ProfilMenu   from '@/components/profil/ProfilMenu'
import { useAuth }  from '@/hooks/useAuth'
import { useRiwayat } from '@/hooks/useRiwayat'

export default function ProfilPage() {
  const { user }                    = useAuth()
  const { reports, isLoading }      = useRiwayat()

  const totalLaporan = reports.length
  const selesai      = reports.filter(r => r.status === 'selesai').length
  // Poin sederhana: tiap laporan = 10 poin, selesai bonus 15
  const poin         = totalLaporan * 10 + selesai * 15

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-6xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Left Column */}
          <div className="lg:col-span-1">
            <ProfilAvatar user={user} />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-5">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="card p-3 text-center animate-pulse">
                    <div className="h-6 bg-gray-100 rounded mb-1 mx-auto w-2/3" />
                    <div className="h-3 bg-gray-100 rounded mx-auto w-1/2" />
                  </div>
                ))
              ) : (
                <>
                  <StatCard label="Laporan" value={totalLaporan} />
                  <StatCard label="Selesai"  value={selesai} />
                  <StatCard label="Poin"     value={poin} isGold />
                </>
              )}
            </div>

            {/* Badge */}
            <div className="mt-5 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-gold/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gold flex items-center justify-center">
                  <span className="text-amber-900 font-bold text-lg">★</span>
                </div>
                <div>
                  <p className="font-bold text-amber-800">
                    {poin >= 300 ? 'Warga Peduli' : poin >= 100 ? 'Warga Aktif' : 'Warga Baru'}
                  </p>
                  <p className="text-xs text-amber-700">{poin} poin</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            <ProfilMenu />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function StatCard({ label, value, isGold }: { label: string; value: number; isGold?: boolean }) {
  return (
    <div className={`card p-3 text-center ${isGold ? 'border-gold/50' : ''}`}>
      <p className={`text-xl font-extrabold ${isGold ? 'text-amber-600' : 'text-text'}`}>{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  )
}