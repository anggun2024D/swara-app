import api from './api';
import type { AnalyticsSummary, Report, APIResponse } from '@/types';

export const dashboardService = {
  async getUserDashboard(): Promise<{
    summary: { total: number; pending: number; resolved: number; in_progress: number };
    recent_reports: Report[];
  }> {
    const { data } = await api.get('/dashboard');
    return data.data;
  },

  async getAdminDashboard(): Promise<{
    summary: AnalyticsSummary;
    recent_reports: Report[];
    recent_users: { id: number; name: string; created_at: string }[];
  }> {
    const { data } = await api.get('/admin/dashboard');
    return data.data;
  },
};