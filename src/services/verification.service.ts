// services/verification.service.ts
// SWARA — Community Verification API Service

import api from './api'
import type { CreateVerificationRequest, VerificationSummary, ResourceVerification } from '@/types/resource'

export const verificationService = {
  // Ambil daftar verifikasi untuk resource
  getByResource: (resourceId: string) =>
    api.get<{
      success: boolean
      data: {
        verifications: ResourceVerification[]
        summary: VerificationSummary
      }
    }>(`/resources/${resourceId}/verifications`),

  // Buat verifikasi baru (support, verify, rate, review)
  create: (resourceId: string, data: CreateVerificationRequest) =>
    api.post<{
      success: boolean
      data: {
        verification: ResourceVerification
        new_score: number
        community_verified: boolean
      }
    }>(`/resources/${resourceId}/verify`, data),

  // Hapus verifikasi
  delete: (id: string) => api.delete(`/verifications/${id}`),
}

export default verificationService
