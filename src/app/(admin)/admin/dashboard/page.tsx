'use client'

import { useAdminDashboard } from '@/hooks/useAdminDashboard'
import WelcomeBanner from '@/components/admin/dashboard/WelcomeBanner'
import AnalyticsCards from '@/components/admin/dashboard/AnalyticsCards'
import ReportsChart from '@/components/admin/dashboard/ReportsChart'
import CategoryChart from '@/components/admin/dashboard/CategoryChart'
import StatusChart from '@/components/admin/dashboard/StatusChart'
import GISMapPanel from '@/components/admin/dashboard/GISMapPanel'
import LiveActivityFeed from '@/components/admin/dashboard/LiveActivityFeed'
import RecentReportsTable from '@/components/admin/dashboard/RecentReportsTable'
import QuickActions from '@/components/admin/dashboard/QuickActions'
import UrgentReportsPanel from '@/components/admin/dashboard/UrgentReportsPanel'
import KecamatanActivity from '@/components/admin/dashboard/KecamatanActivity'

export default function AdminDashboardPage() {
  const { metrics, isLoading } = useAdminDashboard()

  return (
    <div className="space-y-8">
      <WelcomeBanner />
      <AnalyticsCards metrics={metrics} isLoading={isLoading} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-8">
          <GISMapPanel/>
          <ReportsChart data={metrics?.trendMingguIni ?? []} isLoading={isLoading} />
        </div>
        <div className="xl:col-span-4 space-y-6">
          <UrgentReportsPanel reports={metrics?.urgentReports ?? []} isLoading={isLoading} />
          <KecamatanActivity data={metrics?.kecamatanBreakdown ?? []} isLoading={isLoading} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <CategoryChart data={metrics?.categoryBreakdown ?? []} isLoading={isLoading} />
        <StatusChart data={metrics?.statusBreakdown ?? []} isLoading={isLoading} />
        <LiveActivityFeed reports={metrics?.recentReports ?? []} isLoading={isLoading} />
        <QuickActions />
      </div>

      <RecentReportsTable reports={metrics?.recentReports ?? []} isLoading={isLoading} />
    </div>
  )
}