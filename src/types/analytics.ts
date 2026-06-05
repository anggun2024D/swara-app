// types/analytics.ts
// SWARA Economic Intelligence Types

export interface EconomicInsights {
  total_resources: number
  total_contributors: number
  total_investors: number
  total_community: number
  total_verifications: number
  total_collaborations: number
  total_accepted_collabs: number
  total_active_opportunities: number
  total_investment_potential: number
  by_category: CategoryStat[]
  by_province: RegionStat[]
}

export interface CategoryStat {
  category_id: number
  category_name: string
  color: string
  icon: string
  count: number
  percentage: number
}

export interface RegionStat {
  province: string
  total: number
  total_investment: number
  avg_score: number
}

export interface CityStat {
  city: string
  total: number
  total_investment: number
}

export interface HeatmapPoint {
  lat: number
  lng: number
  intensity: number
  category_id: number
}

export interface GrowthData {
  resources: GrowthPoint[]
  verifications: GrowthPoint[]
  collaborations: CollabGrowthPoint[]
}

export interface GrowthPoint {
  month: string
  total: number
  active?: number
}

export interface CollabGrowthPoint {
  month: string
  total: number
  accepted: number
}

export interface AdminStats {
  total_potensi_nasional: number
  total_user: number
  total_business_owner: number
  total_investor: number
  total_community_contributor: number
  total_verifikasi: number
  total_kolaborasi: number
  total_kolaborasi_sukses: number
  total_peluang_aktif: number
  total_investment_value: number
  by_category: Array<{
    name: string
    color: string
    icon: string
    total: number
  }>
  recent_resources: Array<{
    id: string
    resource_name: string
    status: string
    verification_level: number
    category: string
    contributor: string
    created_at: string
  }>
}

export interface PublicStats {
  total_potensi: number
  total_pengguna: number
  total_terverifikasi: number
  total_kolaborasi: number
  by_category: Array<{
    id: number
    name: string
    slug: string
    icon: string
    color: string
    total: number
  }>
  top_provinces: Array<{
    province: string
    total: number
  }>
}