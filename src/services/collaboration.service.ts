// services/collaboration.service.ts
// SWARA — Collaboration API Service

import api from './api'
import type {
  Collaboration,
  CreateCollaborationRequest,
  CollaborationStatus,
  PaginationData,
} from '@/types/resource'

export const collaborationService = {
  // Ambil daftar kolaborasi user
  getAll: (filters?: { status?: CollaborationStatus; type?: string }) =>
    api.get<{
      success: boolean
      data: {
        collaborations: Collaboration[]
        pagination: PaginationData
      }
    }>('/collaborations', { params: filters }),

  // Buat permintaan kolaborasi baru
  create: (data: CreateCollaborationRequest) =>
    api.post<{ success: boolean; data: Collaboration }>('/collaborations', data),

  // Lihat detail kolaborasi
  getById: (id: string) =>
    api.get<{ success: boolean; data: Collaboration }>(`/collaborations/${id}`),

  // Respons kolaborasi (accept/reject)
  respond: (id: string, status: 'accepted' | 'rejected') =>
    api.put<{ success: boolean; data: Collaboration }>(`/collaborations/${id}/respond`, { status }),
}

export default collaborationService
