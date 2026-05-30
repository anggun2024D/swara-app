// types/report.ts

export interface Report {
  id: string                    // UUID
  judul: string
  deskripsi: string
  status: ReportStatus
  priority: ReportPriority | null
  lokasi: {
    latitude: number
    longitude: number
    address: string
  }
  category: {
    id: number
    nama: string
  }
  pelapor: {
    id: string
    nama: string
  }
  foto: Array<{
    id: number
    url: string
  }>
  dibuat_pada: string
  diupdate_pada: string
  admin_notes?: string | null
  is_urgent: boolean
}

export type ReportStatus =
  | 'tersubmit'
  | 'diverifikasi'
  | 'diproses'
  | 'selesai'
  | 'ditolak'

export type ReportPriority = 'rendah' | 'sedang' | 'tinggi' | 'urgent'

export interface ReportFilters {
  status?: string
  category_id?: number
  search?: string
  daerah?: string
  per_halaman?: number | 'all'
}

export interface VerifyReportRequest {
  status: 'diverifikasi' | 'diproses' | 'selesai' | 'ditolak'
  admin_notes?: string
}

// Shape response dari GET /api/laporan
export interface ReportsIndexResponse {
  success: boolean
  message: string
  data: {
    laporan: Report[]
    pagination: {
      total: number
      per_halaman: number
      halaman_ini: number
      total_halaman: number
    }
  }
}