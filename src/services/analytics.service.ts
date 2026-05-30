import api from './api';
import type { AnalyticsData, APIResponse } from '@/types';

export const analyticsService = {
  async getAnalytics(period: 'week' | 'month' | 'year' = 'month'): Promise<AnalyticsData> {
    const { data } = await api.get<APIResponse<AnalyticsData>>('/analytics', {
      params: { period },
    });
    return data.data;
  },

  async getAdminAnalytics(period = 'month'): Promise<AnalyticsData> {
    const { data } = await api.get<APIResponse<AnalyticsData>>('/admin/analytics', {
      params: { period },
    });
    return data.data;
  },
};