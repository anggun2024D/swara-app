'use client'

import { useState } from 'react'
import { Suspense } from 'react'
import { Search, Download } from 'lucide-react'
import ReportsTable from '@/components/admin/reports/ReportsTable'
import ReportsFilter from '@/components/admin/reports/ReportsFilter'
import ReportDetailDrawer from '@/components/admin/reports/ReportDetailDrawer'
import { reportsService } from '@/services/reports.service'
import { showSuccess, showError } from '@/lib/toast'
import { useReports } from '@/hooks/useReports'
import type { Report, ReportFilters } from '@/types'

export default function AdminReportsPage() {
  const [filters, setFilters] = useState<ReportFilters>({})
  const [search, setSearch] = useState('')
  const { data, isLoading, refetch } = useReports({ ...filters, search: search || undefined })

  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleViewDetail = (report: Report) => {
    setSelectedReport(report)
    setDrawerOpen(true)
  }

  const handleVerify = async (
    reportId: string,
    status: 'diverifikasi' | 'diproses' | 'selesai' | 'ditolak',
    adminNotes?: string
  ) => {
    await reportsService.verifyReport(reportId, { status, admin_notes: adminNotes })
    showSuccess(
      status === 'ditolak' ? 'Laporan ditolak' :
      status === 'selesai' ? 'Laporan ditandai selesai' :
      'Status laporan diperbarui'
    )
    refetch()
    setDrawerOpen(false)
  }

  const laporan = data?.laporan ?? []
  const total   = data?.pagination?.total ?? 0

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-primary">
          <p className="text-muted text-xs">Total Laporan</p>
          <p className="text-2xl font-bold">{total}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-gray-400">
          <p className="text-muted text-xs">Tersubmit</p>
          <p className="text-2xl font-bold">
            {laporan.filter(r => r.status === 'tersubmit').length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-yellow-500">
          <p className="text-muted text-xs">Diproses</p>
          <p className="text-2xl font-bold">
            {laporan.filter(r => r.status === 'diproses').length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-green-500">
          <p className="text-muted text-xs">Selesai</p>
          <p className="text-2xl font-bold">
            {laporan.filter(r => r.status === 'selesai').length}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-wrap gap-3 items-center justify-between">
        <Suspense fallback={null}>
          <ReportsFilter filters={filters} setFilters={setFilters} />
        </Suspense>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Cari laporan..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-border rounded-xl text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button className="px-4 py-2 border border-border rounded-xl text-sm flex items-center gap-2 hover:bg-gray-50">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <ReportsTable
        reports={laporan}
        isLoading={isLoading}
        onViewDetail={handleViewDetail}
      />

      {/* Drawer */}
      <ReportDetailDrawer
        report={selectedReport}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onVerify={handleVerify}
      />
    </div>
  )
}