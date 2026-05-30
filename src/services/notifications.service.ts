// services/notifications.service.ts
import api from './api'

export interface Notifikasi {
  id: string
  judul: string
  pesan: string
  tipe: string
  is_read: boolean
  report_id: string | null
  dibuat_pada: string
}

export interface NotifikasiResponse {
  notifikasi: Notifikasi[]
  belum_dibaca: number
}

export const notifikasiService = {
  async getAll(): Promise<NotifikasiResponse> {
    const { data } = await api.get<{ success: boolean; data: NotifikasiResponse }>('/notifikasi')
    return data.data
  },

  async markAsRead(id: string): Promise<void> {
    await api.put(`/notifikasi/${id}/read`)
  },

  async markAllAsRead(): Promise<void> {
    await api.put('/notifikasi/read-all')
  },

  async destroy(id: string): Promise<void> {
    await api.delete(`/notifikasi/${id}`)
  },
}