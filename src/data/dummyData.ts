// Legacy dummy data — tidak lagi digunakan oleh platform SWARA baru
// File ini dipertahankan hanya sebagai referensi

export const user = {
  id: 1,
  name: 'Fikro Nabila',
  email: 'fikro.nabila@example.com',
  role: 'user' as const,
  avatar: 'FN',
  is_active: true,
}

export const categories = [
  { id: 1, name: 'UMKM & Industri Kreatif', slug: 'umkm', icon: '🏭', color: '#F59E0B' },
  { id: 2, name: 'Pertanian & Pangan', slug: 'pertanian', icon: '🌾', color: '#10B981' },
  { id: 3, name: 'Perikanan & Peternakan', slug: 'perikanan', icon: '🐟', color: '#3B82F6' },
  { id: 4, name: 'Pariwisata & Ekonomi Lokal', slug: 'pariwisata', icon: '🏝️', color: '#8B5CF6' },
]

export const reports: any[] = []
export const notifications: any[] = []