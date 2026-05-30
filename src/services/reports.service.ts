// services/reports.service.ts
import api from './api'
import type { Report, ReportFilters, ReportsIndexResponse, VerifyReportRequest } from '@/types'

export const reportsService = {
  // GET /api/laporan
  async getReports(filters: ReportFilters = {}): Promise<ReportsIndexResponse['data']> {
    const { data } = await api.get<ReportsIndexResponse>('/laporan', { params: filters })
    return data.data
  },

  // GET /api/laporan/riwayat
  async getMyReports(filters: ReportFilters = {}): Promise<ReportsIndexResponse['data']> {
    const { data } = await api.get<ReportsIndexResponse>('/laporan/riwayat', { params: filters })
    return data.data
  },

  // GET /api/laporan/{id}
  async getReportById(id: string): Promise<Report> {
    const { data } = await api.get<{ success: boolean; data: Report }>(`/laporan/${id}`)
    return data.data
  },

  // PUT /api/laporan/{id}/verifikasi  (admin only)
  async verifyReport(id: string, payload: VerifyReportRequest): Promise<Report> {
    const { data } = await api.put<{ success: boolean; data: Report }>(
      `/laporan/${id}/verifikasi`,
      payload
    )
    return data.data
  },

  // DELETE /api/laporan/{id}
  async deleteReport(id: string): Promise<void> {
    await api.delete(`/laporan/${id}`)
  },
}

export const getPendingReports = async () => {
  const response = await api.get('/laporan', {
    params: { status: 'tersubmit', per_halaman: 'all' }
  })
  return response.data.data?.laporan ?? []
}

export const verifikasiLaporan = async (
  id: string,
  payload: { status: 'diverifikasi' | 'diproses' | 'selesai' | 'ditolak'; admin_notes?: string }
) => {
  const response = await api.put(`/laporan/${id}/verifikasi`, payload)
  return response.data
}