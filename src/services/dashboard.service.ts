import api from './api';

export const dashboardService = {
  async getUserDashboard(): Promise<any> {
    const { data } = await api.get('/dashboard');
    return data.data;
  },

  async getAdminDashboard(): Promise<any> {
    const { data } = await api.get('/admin/dashboard');
    return data.data;
  },
};