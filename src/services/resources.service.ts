// services/resources.service.ts
// SWARA — Economic Resource API Service

import api from './api'
import type {
  EconomicResource,
  ResourceFilters,
  ResourcesIndexResponse,
  CreateResourceRequest,
  MapMarker,
} from '@/types/resource'

export const resourcesService = {
  // ── CRUD ──────────────────────────────────────────────────

  getAll: (filters?: ResourceFilters) =>
    api.get<ResourcesIndexResponse>('/resources', { params: filters }),

  getMine: (filters?: ResourceFilters) =>
    api.get('/resources/mine', { params: filters }),

  getById: (id: string) =>
    api.get<{ success: boolean; data: EconomicResource }>(`/resources/${id}`),

  create: (data: FormData) =>
    api.post('/resources', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: string, data: FormData) =>
    api.post(`/resources/${id}?_method=PUT`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  delete: (id: string) => api.delete(`/resources/${id}`),

  // ── Map ───────────────────────────────────────────────────

  getEconomicMap: (filters?: { category_id?: number; province?: string }) =>
    api.get<{ success: boolean; data: MapMarker[] }>('/publik/economic-map', {
      params: filters,
    }),

  // ── Recommendations ───────────────────────────────────────

  getRecommendations: (id: string) =>
    api.get(`/resources/${id}/recommendations`),
}

export default resourcesService
