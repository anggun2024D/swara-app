import { Report, Category, Notification, User } from '../types'

export const user: User = {
  name: 'Fikro Nabila',
  email: 'fikro.nabila@lamongan.go.id',
  avatar: 'FN',
  reportsCount: 8,
  completedCount: 5,
  points: 420,
}

export const categories: Category[] = [
  { name: 'Sampah', slug: 'sampah', reportCount: 128, icon: 'Trash2' },
  { name: 'Jalan', slug: 'jalan', reportCount: 85, icon: 'Route' },
  { name: 'Fasilitas Umum', slug: 'fasilitas-umum', reportCount: 210, icon: 'Building' },
  { name: 'Lingkungan', slug: 'lingkungan', reportCount: 42, icon: 'Leaf' },
  { name: 'Pelayanan Publik', slug: 'pelayanan-publik', reportCount: 315, icon: 'Users' },
  { name: 'Keamanan', slug: 'keamanan', reportCount: 56, icon: 'Shield' },
]

export const reports: Report[] = [
  {
    id: 'SW-001',
    title: 'Jalan Rusak di Pusat Kota',
    description: 'Jalan berlubang besar di tengah jalan yang membahayakan pengendara.',
    category: 'Infrastruktur',
    location: 'Jl. Sudirman, Lamongan Kota',
    lat: -7.1195,
    lng: 112.4316,
    status: 'diproses',
    priority: 'darurat',
    createdAt: new Date('2024-10-24T09:15:00'),
    updatedAt: new Date('2024-10-24T14:30:00'),
    images: [],
    user: { name: 'Fikro Nabila', avatar: 'FN' }
  },
  {
    id: 'SW-002',
    title: 'Penumpukan Sampah Liar',
    description: 'Sampah menggunung di Pasar Lama, bau tidak sedap.',
    category: 'Kebersihan',
    location: 'Pasar Lama, Kec. Babat',
    lat: -7.1132,
    lng: 112.4158,
    status: 'diproses',
    priority: 'sedang',
    createdAt: new Date('2024-10-23T08:00:00'),
    updatedAt: new Date('2024-10-23T10:15:00'),
    images: [],
    user: { name: 'Fikro Nabila', avatar: 'FN' }
  },
  {
    id: 'SW-003',
    title: 'Lampu Jalan Mati',
    description: 'Area gelap rawan kecelakaan di Gang Mawar.',
    category: 'Fasilitas Umum',
    location: 'Gang Mawar, Lamongan Kota',
    lat: -7.1167,
    lng: 112.4345,
    status: 'selesai',
    priority: 'sedang',
    createdAt: new Date('2024-10-20T14:00:00'),
    updatedAt: new Date('2024-10-22T09:00:00'),
    images: [],
    user: { name: 'Fikro Nabila', avatar: 'FN' }
  },
  {
    id: 'SW-004',
    title: 'Pohon Tumbang',
    description: 'Pohon besar menutup sebagian badan jalan.',
    category: 'Lingkungan',
    location: 'Jl. Basuki Rahmat, Sukodadi',
    lat: -7.1098,
    lng: 112.4289,
    status: 'terkirim',
    priority: 'darurat',
    createdAt: new Date('2024-10-25T07:30:00'),
    updatedAt: new Date('2024-10-25T08:00:00'),
    images: [],
    user: { name: 'Fikro Nabila', avatar: 'FN' }
  }
]

export const notifications: Notification[] = [
  {
    id: '1',
    title: 'Laporan Selesai Ditangani',
    message: 'Laporan Jalan Rusak di Pusat Kota telah selesai ditangani oleh Tim PU Lamongan.',
    type: 'laporan',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    reportId: 'SW-001'
  },
  {
    id: '2',
    title: 'Status Laporan Diperbarui',
    message: 'Laporan Sampah Menumpuk Pasar Lama kini berstatus Diproses oleh Regu Wilayah B.',
    type: 'laporan',
    read: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    reportId: 'SW-002'
  },
  {
    id: '3',
    title: 'Laporan Berhasil Dikirim',
    message: 'Laporan Pohon Tumbang Jl. Basuki Rahmat Anda telah berhasil diterima sistem.',
    type: 'laporan',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    reportId: 'SW-004'
  }
]