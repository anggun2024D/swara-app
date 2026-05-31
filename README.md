# 🗺️ SWARA Dashboard — Frontend

**Suara Warga untuk Ruang dan Aset**  
Universitas Negeri Surabaya | D4 Manajemen Informatika

Platform pelaporan infrastruktur berbasis GIS untuk smart city Kabupaten Lamongan.  
Dibangun dengan **Next.js 14 App Router** + **TypeScript** + **Tailwind CSS**.

> 📦 Repository ini menyimpan **frontend** di branch `frontend` dan **backend** di branch `main`.  
> Pastikan kamu berada di branch yang benar sebelum memulai.

---

## 📋 Daftar Isi

1. [Requirements](#1-requirements)
2. [Cara Setup Project](#2-cara-setup-project)
3. [Menjalankan Aplikasi](#3-menjalankan-aplikasi)
4. [Akun untuk Testing](#4-akun-untuk-testing)
5. [Struktur Folder](#5-struktur-folder)
6. [Panduan Mengedit Komponen](#6-panduan-mengedit-komponen)
7. [Hooks & Services](#7-hooks--services)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Requirements

| Software | Versi Minimum | Link Download |
|---|---|---|
| **Node.js** | 18.x LTS | https://nodejs.org |
| **npm** | 9.x | Sudah termasuk bersama Node.js |
| **Git** | 2.x | https://git-scm.com |

Cek instalasi:
```bash
node --version    # Harus: v18.x.x atau lebih baru
npm --version     # Harus: 9.x.x atau lebih baru
```

> ⚠️ Backend Laravel harus sudah berjalan di `http://127.0.0.1:8000` sebelum menjalankan frontend.  
> Lihat README di branch `main` untuk setup backend.

---

## 2. Cara Setup Project

### 2.1 Clone Repository & Pindah ke Branch Frontend

```bash
git clone https://github.com/anggun2024D/swara-app.git
cd swara-app
git checkout frontend
```

### 2.2 Install Dependencies

```bash
npm install
```

Tunggu hingga selesai. Semua library JavaScript akan terunduh ke folder `node_modules/`.

### 2.3 Buat File Environment

Buat file `.env.local` di root folder:

```bash
# Windows CMD
echo NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api > .env.local
```

Atau buat file `.env.local` secara manual dan isi dengan:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

> ⚠️ Prefix `NEXT_PUBLIC_` wajib ada agar variabel bisa diakses di sisi browser (client-side).

### 2.4 Jalankan Development Server

```bash
npm run dev
```

Aplikasi berjalan di: **http://localhost:3000**

---

## 3. Menjalankan Aplikasi

Setiap kali ingin membuka aplikasi, pastikan urutan ini benar:

```
1. Buka Laragon → Start All (untuk MySQL aktif)
2. Terminal 1 → folder swara-backend → php artisan serve
3. Terminal 2 → folder SWARA-Dashboard → npm run dev
4. Buka browser → http://localhost:3000
```

### Ringkasan URL

| Halaman | URL | Keterangan |
|---|---|---|
| Landing Page | http://localhost:3000 | Halaman publik utama |
| Login | http://localhost:3000/login | Halaman login |
| Register | http://localhost:3000/register | Halaman registrasi |
| Dashboard User | http://localhost:3000/dashboard | Setelah login sebagai user |
| Buat Laporan | http://localhost:3000/laporan | Form laporan baru |
| Peta Wilayah | http://localhost:3000/peta | Peta interaktif fullscreen |
| Kategori | http://localhost:3000/kategori | Daftar kategori laporan |
| Riwayat | http://localhost:3000/riwayat | Riwayat laporan user |
| Profil | http://localhost:3000/profil | Halaman profil user |
| Bantuan | http://localhost:3000/bantuan | FAQ & kontak |
| Dashboard Admin | http://localhost:3000/admin/dashboard | Setelah login sebagai admin |
| Laporan Admin | http://localhost:3000/admin/reports | Manajemen laporan |
| Peta Monitoring | http://localhost:3000/admin/map-monitoring | Monitoring real-time |
| Verifikasi | http://localhost:3000/admin/verification | Antrian verifikasi laporan |
| Pengguna | http://localhost:3000/admin/users | Manajemen pengguna |
| Analytics | http://localhost:3000/admin/analytics | Grafik & statistik |

---

## 4. Akun untuk Testing

| Email | Password | Role | Akses |
|---|---|---|---|
| `admin@swara.com` | `password` | Admin | Semua fitur admin |
| `user@swara.com` | `password` | User | Dashboard user, buat laporan |

---

## 5. Struktur Folder

```
SWARA-Dashboard/
├── public/
│   └── logo.png
│
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── laporan/page.tsx
│   │   │   ├── peta/page.tsx
│   │   │   ├── kategori/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── riwayat/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── profil/
│   │   │   │   ├── page.tsx
│   │   │   │   └── edit/page.tsx
│   │   │   ├── notifikasi/page.tsx
│   │   │   └── bantuan/page.tsx
│   │   │
│   │   ├── (admin)/
│   │   │   ├── layout.tsx
│   │   │   └── admin/
│   │   │       ├── dashboard/page.tsx
│   │   │       ├── reports/page.tsx
│   │   │       ├── analytics/page.tsx
│   │   │       ├── notifications/page.tsx
│   │   │       ├── users/
│   │   │       │   ├── page.tsx                ← Manajemen pengguna
│   │   │       │   └── [id]/page.tsx           ← ✅ BARU — Detail pengguna
│   │   │       ├── map-monitoring/page.tsx
│   │   │       ├── verification/page.tsx
│   │   │       └── settings/page.tsx
│   │   │
│   │   └── layout.tsx
│   │
│   ├── components/
│   │   ├── landing/
│   │   │   ├── Navbar.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── CategorySection.tsx
│   │   │   ├── GISMapSection.tsx
│   │   │   ├── AnalyticsSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   └── Topbar.tsx
│   │   │
│   │   ├── guards/
│   │   │   └── AuthGuard.tsx
│   │   │
│   │   ├── MapComponent.tsx
│   │   │
│   │   ├── laporan/
│   │   │   ├── LaporanForm.tsx
│   │   │   ├── ImageUpload.tsx
│   │   │   ├── PreviewPanel.tsx
│   │   │   └── MiniMap.tsx
│   │   │
│   │   ├── peta/
│   │   │   ├── PetaMap.tsx
│   │   │   └── ReportDetailSidebar.tsx
│   │   │
│   │   ├── kategori/
│   │   │   ├── KategoriHero.tsx
│   │   │   └── KategoriCard.tsx
│   │   │
│   │   ├── riwayat/
│   │   │   ├── RiwayatCard.tsx
│   │   │   ├── RiwayatHeader.tsx
│   │   │   ├── RiwayatTabs.tsx
│   │   │   └── RiwayatSidebar.tsx
│   │   │
│   │   ├── profil/
│   │   │   ├── ProfilAvatar.tsx
│   │   │   └── ProfilMenu.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── StatsCards.tsx
│   │   │   ├── CategoryGrid.tsx
│   │   │   ├── MapSection.tsx
│   │   │   └── UpdatesPanel.tsx
│   │   │
│   │   └── admin/
│   │       ├── layout/
│   │       │   ├── AdminSidebar.tsx
│   │       │   └── AdminTopbar.tsx
│   │       ├── dashboard/
│   │       │   ├── WelcomeBanner.tsx
│   │       │   ├── AnalyticsCards.tsx
│   │       │   ├── ReportsChart.tsx
│   │       │   ├── CategoryChart.tsx
│   │       │   ├── StatusChart.tsx
│   │       │   ├── GISMapPanel.tsx
│   │       │   ├── LiveActivityFeed.tsx
│   │       │   ├── RecentReportsTable.tsx
│   │       │   ├── QuickActions.tsx
│   │       │   ├── UrgentReportsPanel.tsx
│   │       │   └── KecamatanActivity.tsx
│   │       ├── map-monitoring/
│   │       │   └── AdminMap.tsx
│   │       └── reports/
│   │           ├── ReportsTable.tsx
│   │           ├── ReportsFilter.tsx
│   │           └── ReportDetailDrawer.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useReports.ts
│   │   ├── useRiwayat.ts
│   │   ├── useAdminDashboard.ts
│   │   ├── useMapReports.ts
│   │   ├── useUserReports.ts
│   │   ├── useUserDashboard.ts
│   │   ├── useVerification.ts
│   │   ├── useKategori.ts
│   │   ├── useNotifications.ts
│   │   ├── useAnalytics.ts
│   │   ├── useUsers.ts
│   │   ├── useUserDetail.ts            ← ✅ BARU — Fetch detail satu pengguna
│   │   ├── usePublicMapReports.ts
│   │   └── usePublicStats.ts
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── reports.service.ts
│   │   ├── categories.service.ts
│   │   ├── notifications.service.ts
│   │   ├── analytics.service.ts
│   │   ├── users.service.ts            ← ✅ UPDATE — tambah getUserById() + AdminUserDetail
│   │   └── dashboard.service.ts
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx
│   │
│   └── types/
│       ├── auth.ts
│       ├── report.ts
│       ├── category.ts
│       ├── notification.ts
│       ├── analytics.ts
│       ├── user.ts
│       └── index.ts
│
├── .env.local
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 6. Panduan Mengedit Komponen

### 6.1 Mengubah Teks Landing Page

| Yang ingin diubah | File yang diedit |
|---|---|
| Menu navigasi | `src/components/landing/Navbar.tsx` → array `navLinks` |
| Judul & subjudul hero | `src/components/landing/HeroSection.tsx` → tag `<h1>` dan `<p>` |
| Tombol CTA hero | `src/components/landing/HeroSection.tsx` → `<Link href="...">` |
| Kontak & alamat | `src/components/landing/Footer.tsx` |

### 6.2 Mengubah Warna & Tema

Edit file `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary:       '#1a5c38', // warna utama hijau
      'primary-hover': '#154d2e',
      gold:          '#d4a017', // warna aksen emas
      bg:            '#f8f9fa', // latar belakang halaman
      text:          '#1a1a2e', // teks utama
      muted:         '#6b7280', // teks sekunder/placeholder
      border:        '#e5e7eb', // warna border/garis
    }
  }
}
```

Semua komponen yang memakai `bg-primary`, `text-primary`, dll akan otomatis ikut berubah.

### 6.3 Mengubah Kategori Laporan

Kategori dikelola dari **database**, bukan dari kode frontend. Untuk menambah atau mengedit:

1. Buka `http://localhost/phpmyadmin`
2. Pilih database `swara_db` → tabel `report_categories`
3. Edit kolom:
   - `name` → nama kategori yang ditampilkan
   - `icon_url` → URL gambar ikon (upload ke Cloudinary dulu, lalu paste URL-nya)
   - `is_active` → `1` tampil, `0` sembunyikan

### 6.4 Mengubah Menu Sidebar User

Edit file `src/components/layout/Sidebar.tsx`, cari array `navItems`:

```tsx
const navItems = [
  { name: 'Dashboard',    href: '/dashboard', icon: LayoutDashboard },
  { name: 'Buat Laporan', href: '/laporan',   icon: FileText        },
  // tambah item baru di sini:
  { name: 'Pengumuman',   href: '/pengumuman', icon: Megaphone      },
]
```

Icon diambil dari library `lucide-react` — lihat semua icon di https://lucide.dev/icons

### 6.5 Mengubah Menu Sidebar Admin

Edit file `src/components/admin/layout/AdminSidebar.tsx`, cari array `menuItems`:

```tsx
const menuItems = [
  { name: 'Dashboard',       href: '/admin/dashboard',      icon: LayoutDashboard },
  { name: 'Laporan Masuk',   href: '/admin/reports',        icon: FileText        },
  // tambah item baru di sini
]
```

### 6.6 Mengubah Search di Topbar Admin

Edit file `src/components/admin/layout/AdminTopbar.tsx`, cari array `SEARCH_CATEGORIES`:

```tsx
const SEARCH_CATEGORIES = [
  {
    label: 'Laporan',
    href: (q: string) => `/admin/reports?search=${encodeURIComponent(q)}`,
    keywords: ['laporan', 'jalan', 'rusak'],
  },
  // tambah kategori search baru di sini
]
```

### 6.7 Mengedit Form Laporan

Edit file `src/components/laporan/LaporanForm.tsx`:

- **Tambah field baru** → tambahkan di state `formData` dan di JSX form
- **Ubah daftar kecamatan** → cari array kecamatan (berisi 27 kecamatan Lamongan)
- **Ubah validasi** → cari fungsi `validate()`

### 6.8 Menambah Halaman Baru (Dashboard User)

**Langkah 1** — Buat file halaman:
```
src/app/(dashboard)/nama-halaman/page.tsx
```

**Langkah 2** — Isi file halaman:
```tsx
export default function NamaHalamanPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Nama Halaman</h1>
    </div>
  )
}
```

**Langkah 3** — Tambah ke menu sidebar di `src/components/layout/Sidebar.tsx`:
```tsx
{ name: 'Nama Halaman', href: '/nama-halaman', icon: NamaIcon },
```

### 6.9 Mengubah Endpoint API

Jika URL endpoint backend berubah, edit file service di `src/services/`:

```typescript
// src/services/reports.service.ts
export const getReports = async (filters: ReportFilters) => {
  const response = await api.get('/laporan', { params: filters })
  //                              ^^^^^^^^^ ganti jika endpoint berubah
  return response.data
}
```

Base URL API dikonfigurasi di `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

---

## 7. Hooks & Services

### Cara Kerja Sistem Fetch Data

```
Halaman (page.tsx)
    ↓ memanggil
Custom Hook (hooks/useXxx.ts)
    ↓ memanggil
Service (services/xxx.service.ts)
    ↓ memanggil
Axios Instance (services/api.ts)
    ↓ HTTP request
Backend Laravel (http://127.0.0.1:8000/api)
```

### Daftar Hook dan Kegunaannya

| Hook | Endpoint | Dipakai di |
|---|---|---|
| `useAuth` | `GET /auth/me` | Semua halaman |
| `useRiwayat` | `GET /laporan/riwayat` | Riwayat, Profil |
| `useUserDashboard` | Paralel: riwayat + kategori + notifikasi | Dashboard user |
| `useKategori` | `GET /kategori` | Form laporan, Kategori |
| `useNotifications` | `GET /notifikasi` | Topbar, Notifikasi |
| `useMapReports` | `GET /laporan?per_halaman=all` | Peta user, Admin map |
| `useReports` | `GET /laporan` | Admin reports |
| `useAdminDashboard` | `GET /laporan?per_halaman=all` | Admin dashboard, analytics |
| `useVerification` | `GET /laporan?status=tersubmit` | Admin verification |
| `useUsers` | `GET /admin/users` | Admin users |
| `usePublicStats` | `GET /stats` | Landing page hero |
| `usePublicMapReports` | `GET /publik/peta` | Landing page peta |

### Penting: Hook Publik vs Berautentikasi

Hook yang diawali `usePublic` menggunakan `fetch()` biasa **tanpa token** — dipakai di landing page yang bisa diakses siapa saja.

Hook lainnya menggunakan Axios instance (`api.ts`) yang **otomatis menyertakan Bearer token** dari localStorage — hanya bisa dipakai di halaman yang sudah login.

---

## 8. Troubleshooting

### Halaman putih / blank setelah login

Cek apakah `AuthGuard` sudah membaca role dengan benar. Pastikan backend mengembalikan `role: "user"` atau `role: "admin"` (huruf kecil).

### Peta tidak muncul (blank)

React Leaflet tidak mendukung SSR. Pastikan import peta menggunakan:
```tsx
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
})
```

### "Failed to fetch" / CORS error di console

- Pastikan backend sudah berjalan: `php artisan serve`
- Pastikan URL di `.env.local` benar: `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api`
- Pastikan `config/cors.php` di backend mengizinkan `http://localhost:3000`

### Foto profil / laporan tidak muncul

- Foto disimpan di Cloudinary — pastikan konfigurasi Cloudinary di `.env` backend benar
- Pastikan tidak ada spasi di `CLOUDINARY_API_KEY`

### Kategori tidak muncul di form laporan

- Pastikan tabel `report_categories` sudah terisi (jalankan `php artisan db:seed`)
- Pastikan kolom `is_active = 1` untuk kategori yang ingin ditampilkan

### Error TypeScript saat `npm run dev`

```bash
# Hapus cache TypeScript
rm -rf .next
npm run dev
```

### `npm install` gagal

```bash
# Hapus node_modules dan install ulang
rm -rf node_modules package-lock.json
npm install
```

### Perubahan kode tidak terlihat di browser

Next.js seharusnya hot-reload otomatis. Jika tidak:
1. Tekan `Ctrl+C` di terminal untuk stop server
2. Jalankan ulang: `npm run dev`
3. Hard refresh browser: `Ctrl+Shift+R`

---

## 📝 Catatan Penting untuk Developer

- **Jangan commit** `.env.local` ke Git — berisi URL API yang bisa berbeda di tiap komputer
- **UUID** — semua `id` dari backend adalah UUID string, bukan integer — jangan pakai `parseInt()`
- **Format tanggal** dari backend: `"10 Mei 2025 14:30"` (bukan ISO) — gunakan `parseBackendDate()` sebelum diproses library tanggal
- **`icon_url` kategori** — berisi URL gambar Cloudinary, bukan nama icon Lucide — selalu render dengan `<img>`, bukan komponen icon
- **Status laporan** yang valid: `tersubmit`, `diverifikasi`, `diproses`, `selesai`, `ditolak` — `urgent` bukan status, melainkan field `is_urgent: boolean` terpisah
- **React Leaflet** — wajib `dynamic import` dengan `ssr: false` untuk semua komponen peta
- **`refreshUser()`** — panggil ini (bukan `initAuth`) setelah update profil atau foto agar data user di seluruh aplikasi ikut terupdate

---

*SWARA — Tugas Akhir D4 Manajemen Informatika, Universitas Negeri Surabaya*
