// components/riwayat/RiwayatSidebar.tsx
'use client'

import { PlusCircle, HelpCircle, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import type { Report } from '@/types'

interface Props {
  reports: Report[]
  isLoading: boolean
}

export default function RiwayatSidebar({ reports, isLoading }: Props) {
  const total       = reports.length
  const diproses    = reports.filter(r => r.status === 'diproses').length
  const selesai     = reports.filter(r => r.status === 'selesai').length
  const ditolak     = reports.filter(r => r.status === 'ditolak').length
  const pending     = reports.filter(r => r.status === 'tersubmit' || r.status === 'diverifikasi').length

  // Ambil 3 laporan terbaru sebagai "aktivitas terakhir"
  const recent = [...reports]
    .sort((a, b) => b.dibuat_pada.localeCompare(a.dibuat_pada))
    .slice(0, 3)

  return (
    <div className="space-y-5">
      {/* CTA */}
      <Link href="/laporan">
        <button className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 rounded-xl shadow-md hover:bg-primary-mid transition-all">
          <PlusCircle size={18} />
          Buat Laporan Baru
        </button>
      </Link>

      {/* Progress */}
      <div className="card p-5">
        <h3 className="font-bold text-text mb-3">Progres Laporan</h3>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-6 rounded bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <ProgressItem label="Pending"   count={pending}  total={total} color="bg-blue-500" />
            <ProgressItem label="Diproses"  count={diproses} total={total} color="bg-yellow-500" />
            <ProgressItem label="Selesai"   count={selesai}  total={total} color="bg-green-500" />
            <ProgressItem label="Ditolak"   count={ditolak}  total={total} color="bg-red-500" />
          </div>
        )}
      </div>

      {/* Aktivitas dari data real */}
      {!isLoading && recent.length > 0 && (
        <div className="card p-5">
          <h3 className="font-bold text-text mb-3">Laporan Terbaru</h3>
          <div className="space-y-3">
            {recent.map(r => (
              <ActivityItem
                key={r.id}
                title={r.judul}
                description={r.lokasi?.address ?? '-'}
                time={r.dibuat_pada}
                status={r.status}
              />
            ))}
          </div>
        </div>
      )}

      {/* Help */}
      <div className="card p-5 border border-primary/20 bg-primary-light">
        <div className="flex items-center gap-2 text-primary font-bold text-sm mb-2">
          <HelpCircle size={16} />
          Butuh Bantuan?
        </div>
        <p className="text-xs text-text/70 mb-3">
          Hubungi pusat bantuan kami untuk kendala teknis.
        </p>
        <Link href="/bantuan">
          <button className="w-full py-2 text-sm font-semibold border border-primary/30 rounded-lg hover:bg-white transition-all">
            Pusat Bantuan
          </button>
        </Link>
      </div>
    </div>
  )
}

function ProgressItem({
  label, count, total, color,
}: {
  label: string; count: number; total: number; color: string
}) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div>
      <div className="flex justify-between text-xs font-semibold mb-1">
        <span>{label}</span>
        <span>{count} laporan</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

const statusLabel: Record<string, string> = {
  tersubmit: 'Tersubmit', diverifikasi: 'Diverifikasi',
  diproses: 'Diproses', selesai: 'Selesai', ditolak: 'Ditolak',
}

function ActivityItem({
  title, description, time, status,
}: {
  title: string; description: string; time: string; status: string
}) {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
        <TrendingUp size={14} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold truncate">{title}</p>
        <p className="text-xs text-muted truncate">{description}</p>
        <p className="text-[10px] text-muted mt-0.5">
          {statusLabel[status] ?? status} · {time}
        </p>
      </div>
    </div>
  )
}