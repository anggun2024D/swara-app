// src/types/admin.ts
export interface Report {
  id: string
  title: string
  pelapor: string
  kategori: string
  kecamatan: string
  priority: 'rendah' | 'sedang' | 'tinggi' | 'urgent'
  status: 'menunggu' | 'verifikasi' | 'diproses' | 'selesai' | 'ditolak'
  tanggal: string
  lat: number
  lng: number
  images: string[]
  description: string
}