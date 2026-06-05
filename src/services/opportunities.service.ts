// services/opportunities.service.ts
// SWARA — Opportunity Board API Service

import api from './api'
import type {
  EconomicResource,
  ResourceFilters,
  OpportunitiesResponse,
  PaginationData,
} from '@/types/resource'

export const opportunitiesService = {
  // Daftar peluang (opportunity board)
  getAll: (filters?: ResourceFilters) =>
    api.get<OpportunitiesResponse>('/opportunities', { params: filters }),

  // Publik — tanpa auth
  getPublic: (filters?: ResourceFilters) =>
    api.get<OpportunitiesResponse>('/publik/opportunities', { params: filters }),

  // Simpan peluang (bookmark)
  save: (resourceId: string) =>
    api.post(`/opportunities/${resourceId}/save`),

  // Hapus dari simpanan
  unsave: (resourceId: string) =>
    api.delete(`/opportunities/${resourceId}/save`),

  // Daftar peluang tersimpan
  getSaved: () =>
    api.get<{
      success: boolean
      data: {
        saved: EconomicResource[]
        pagination: PaginationData
      }
    }>('/opportunities/saved'),
}

export default opportunitiesService
