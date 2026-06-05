// types/resource.ts
// SWARA — Smart Wealth & Resource Alliance

export type BusinessScale = 'mikro' | 'kecil' | 'menengah' | 'besar'

export type OpportunityStatus =
  | 'aktif'
  | 'mencari_investor'
  | 'mencari_distributor'
  | 'mencari_supplier'
  | 'mencari_mitra'
  | 'ekspansi'

export type ResourceStatus = 'pending' | 'active' | 'rejected' | 'removed'

export type VerificationType = 'support' | 'verify' | 'rate' | 'review'

export type VerificationLevel = 1 | 2 | 3 | 4

export interface VerificationLevelInfo {
  level: VerificationLevel
  label: string    // Terdaftar / Terverifikasi Komunitas / Mitra / Resmi
  icon: string
  color: string
}

export type CollaborationType = 'investasi' | 'distribusi' | 'supply' | 'kemitraan' | 'ekspansi'

export type CollaborationStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled'

export interface ResourceCategory {
  id: number
  name: string
  slug: string
  icon: string
  color: string
  description?: string
  total?: number
}

export interface EconomicResource {
  id: string
  resource_name: string
  description: string
  status: ResourceStatus
  opportunity_status: OpportunityStatus
  business_scale: BusinessScale
  monthly_capacity?: string
  investment_needed?: number
  collaboration_needed?: string
  verification_score: number
  community_verified: boolean
  verification_level: VerificationLevel
  verification_label: string
  verification_icon: string
  verification_color: string
  contact_information?: string
  website?: string
  social_media?: SocialMedia
  view_count: number
  admin_notes?: string | null
  lokasi: {
    latitude: number | null
    longitude: number | null
    address: string | null
    province?: string | null
    city?: string | null
  }
  category: ResourceCategory | null
  contributor: {
    id: string
    nama: string
    foto?: string | null
    organization?: string | null
    is_business_owner?: boolean
    is_investor?: boolean
    badges?: Array<{ key: string; label: string; icon: string }>
  } | null
  images: Array<{
    id: number
    url: string
  }>
  dibuat_pada: string
  diupdate_pada: string
  // Detail fields (only present in show)
  verifications?: ResourceVerification[]
  saved_count?: number
}

export interface SocialMedia {
  instagram?: string
  tiktok?: string
  facebook?: string
  whatsapp?: string
  [key: string]: string | undefined
}

export interface ResourceFilters {
  category_id?: number
  province?: string
  city?: string
  business_scale?: BusinessScale
  opportunity_status?: OpportunityStatus
  search?: string
  per_halaman?: number | 'all'
}

export interface ResourceVerification {
  id: string
  type: VerificationType
  rating?: number
  review?: string
  user: {
    id: string
    nama: string
    foto?: string | null
  }
  created_at: string
}

export interface VerificationSummary {
  total_support: number
  total_verify: number
  total_reviews: number
  avg_rating: number
  verification_score: number
  community_verified: boolean
}

export interface Collaboration {
  id: string
  type: CollaborationType
  message: string
  status: CollaborationStatus
  responded_at?: string
  created_at: string
  resource: {
    id: string
    resource_name: string
    category?: string
  } | null
  initiator: {
    id: string
    nama: string
    foto?: string | null
    organization?: string | null
  } | null
  target: {
    id: string
    nama: string
    foto?: string | null
    organization?: string | null
  } | null
}

export interface Recommendation {
  type: string
  label: string
  icon: string
  description: string
}

export interface RecommendationData {
  resource_id: string
  category_id: number
  category_recommendations: Recommendation[]
  status_recommendations: string[]
  similar_resources: SimilarResource[]
  potential_investors: PotentialInvestor[]
}

export interface SimilarResource {
  id: string
  resource_name: string
  business_scale: BusinessScale
  verification_score: number
  province?: string
  city?: string
  category?: string
  contributor?: string
}

export interface PotentialInvestor {
  id: string
  nama: string
  organization?: string
  foto?: string | null
}

// API Response types
export interface ResourcesIndexResponse {
  success: boolean
  message: string
  data: {
    resources: EconomicResource[]
    pagination: PaginationData
  }
}

export interface OpportunitiesResponse {
  success: boolean
  message: string
  data: {
    opportunities: EconomicResource[]
    pagination: PaginationData
    filters: {
      statuses: Array<{ value: string; label: string }>
    }
  }
}

export interface PaginationData {
  total: number
  per_halaman: number
  halaman_ini: number
  total_halaman: number
}

// Form types
export interface CreateResourceRequest {
  resource_name: string
  description: string
  category_id: number
  latitude?: number
  longitude?: number
  address?: string
  province?: string
  city?: string
  business_scale: BusinessScale
  monthly_capacity?: string
  investment_needed?: number
  collaboration_needed?: string
  opportunity_status?: OpportunityStatus
  contact_information?: string
  website?: string
  social_media?: SocialMedia
  images?: File[]
}

export interface CreateCollaborationRequest {
  resource_id: string
  type: CollaborationType
  message: string
}

export interface CreateVerificationRequest {
  type: VerificationType
  rating?: number
  review?: string
}

// Map types
export interface MapMarker {
  id: string
  resource_name: string
  opportunity_status: OpportunityStatus
  business_scale: BusinessScale
  verification_score: number
  community_verified: boolean
  investment_needed?: number
  lokasi: {
    latitude: number
    longitude: number
    address: string | null
    province?: string | null
    city?: string | null
  }
  category: {
    id: number
    name: string
    slug: string
    color: string
    icon: string
  }
}
