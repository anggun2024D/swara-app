import { Report } from '@/types/admin'

export const dummyReports: Report[] = [
  { id: 'SW-001', title: 'Jalan Rusak Parah', pelapor: 'Fikro Nabila', kategori: 'Jalan', kecamatan: 'Lamongan Kota', priority: 'urgent', status: 'menunggu', tanggal: '2024-01-15T10:00:00', lat: -7.1195, lng: 112.4316, images: [], description: 'Lubang besar di tengah jalan membahayakan pengendara.' },
  { id: 'SW-002', title: 'Lampu Jalan Mati', pelapor: 'Budi Santoso', kategori: 'Lampu Jalan', kecamatan: 'Sukodadi', priority: 'sedang', status: 'diproses', tanggal: '2024-01-14T14:30:00', lat: -7.1132, lng: 112.4158, images: [], description: 'Lampu mati di gang gelap.' },
  { id: 'SW-003', title: 'Drainase Tersumbat', pelapor: 'Siti Aminah', kategori: 'Drainase', kecamatan: 'Babat', priority: 'tinggi', status: 'selesai', tanggal: '2024-01-13T09:15:00', lat: -7.1089, lng: 112.4085, images: [], description: 'Banjir akibat drainase mampet.' },
  { id: 'SW-004', title: 'Jembatan Retak', pelapor: 'Ahmad Zaki', kategori: 'Jembatan', kecamatan: 'Brondong', priority: 'urgent', status: 'verifikasi', tanggal: '2024-01-12T16:45:00', lat: -7.1250, lng: 112.4250, images: [], description: 'Retakan di pilar jembatan.' },
]

export const dummyNotifications = [
  { id: 1, title: 'Laporan Baru', message: 'Jalan Rusak dari Kec. Tikung', type: 'laporan', read: false, createdAt: new Date() },
  { id: 2, title: 'Urgent!', message: 'Laporan prioritas tinggi dari Kec. Babat', type: 'urgent', read: false, createdAt: new Date() },
]

export const dummyUsers = [
  { id: 1, name: 'Fikro Nabila', email: 'user@swara.com', role: 'masyarakat', totalReports: 8, status: 'aktif', joinedAt: '2023-01-01' },
  { id: 2, name: 'Admin SWARA', email: 'admin@swara.com', role: 'super_admin', totalReports: 0, status: 'aktif', joinedAt: '2023-01-01' },
]

export const dummyKecamatan = [
  { name: 'Lamongan Kota', laporan: 342, response: 2.1, solved: 89 },
  { name: 'Sukodadi', laporan: 187, response: 2.8, solved: 76 },
  { name: 'Babat', laporan: 165, response: 3.2, solved: 68 },
]