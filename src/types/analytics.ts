export interface AnalyticsSummary {
  total_reports: number;
  pending_reports: number;
  in_progress_reports: number;
  resolved_reports: number;
  rejected_reports: number;
  total_users: number;
  active_users: number;
  reports_this_month: number;
  reports_last_month: number;
  growth_percentage: number;
}

export interface ReportsByCategory {
  category_id: number;
  category_name: string;
  count: number;
  percentage: number;
}

export interface ReportsByStatus {
  status: string;
  count: number;
  percentage: number;
}

export interface ReportsByMonth {
  month: string;
  year: number;
  count: number;
  resolved: number;
}

export interface ReportsByKecamatan {
  kecamatan: string;
  count: number;
  resolved: number;
  pending: number;
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  by_category: ReportsByCategory[];
  by_status: ReportsByStatus[];
  by_month: ReportsByMonth[];
  by_kecamatan: ReportsByKecamatan[];
}