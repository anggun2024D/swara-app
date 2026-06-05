// services/analytics.service.ts
// SWARA — Economic Intelligence API Service

import api from './api'
import type {
  EconomicInsights,
  HeatmapPoint,
  GrowthData,
  CategoryStat,
  RegionStat,
  CityStat,
  AdminStats,
  PublicStats,
} from '@/types/analytics'

export const analyticsService = {
  // Dashboard insights (authenticated)
  getDashboard: () =>
    api.get<{ success: boolean; data: EconomicInsights }>('/insights/dashboard'),

  // Heatmap data (public)
  getHeatmap: (filters?: { category_id?: number; province?: string }) =>
    api.get<{ success: boolean; data: HeatmapPoint[] }>('/insights/heatmap', { params: filters }),

  // Top regions
  getTopRegions: (province?: string) =>
    api.get<{
      success: boolean
      data: { provinces?: RegionStat[]; province?: string; cities?: CityStat[] }
    }>('/insights/top-regions', { params: province ? { province } : {} }),

  // Growth charts
  getGrowthChart: () =>
    api.get<{ success: boolean; data: GrowthData }>('/insights/growth'),

  // Category distribution
  getCategoryDistribution: () =>
    api.get<{ success: boolean; data: CategoryStat[] }>('/insights/categories'),

  // Public stats (landing page)
  getPublicStats: () =>
    api.get<{ success: boolean; data: PublicStats }>('/stats'),

  // Admin global stats
  getAdminStats: () =>
    api.get<{ success: boolean; data: AdminStats }>('/admin/stats'),
}

export default analyticsService