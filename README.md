# 🗺️ SWARA — Suara Warga untuk Ruang dan Aset

> Platform pelaporan infrastruktur berbasis GIS untuk smart city Kabupaten Lamongan.  
> Dibangun dengan **Next.js 14** (frontend) dan **Laravel** (backend).

---

## 📋 Daftar Isi

1. [Prasyarat & Software yang Dibutuhkan](#1-prasyarat--software-yang-dibutuhkan)
2. [Ekstrak File dari Google Drive](#2-ekstrak-file-dari-google-drive)
3. [Setup Backend (Laravel)](#3-setup-backend-laravel)
4. [Setup Frontend (Next.js)](#4-setup-frontend-nextjs)
5. [Menjalankan Aplikasi](#5-menjalankan-aplikasi)
6. [Akun untuk Testing](#6-akun-untuk-testing)
7. [Struktur Folder Frontend](#7-struktur-folder-frontend)
8. [Struktur Folder Backend](#8-struktur-folder-backend)
9. [Panduan Mengedit Komponen Frontend](#9-panduan-mengedit-komponen-frontend)
10. [Konfigurasi Environment](#10-konfigurasi-environment)
11. [API Endpoints](#11-api-endpoints)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Prasyarat & Software yang Dibutuhkan

Pastikan semua software berikut sudah terinstall di komputer sebelum memulai.

### Wajib

| Software | Versi Minimum | Link Download | Keterangan |
|---|---|---|---|
| **Laragon** | 6.0+ | https://laragon.org/download | Bundel PHP + MySQL + Apache |
| **Node.js** | 18.x LTS | https://nodejs.org | Runtime JavaScript untuk frontend |
| **Composer** | 2.x | https://getcomposer.org | Package manager PHP |
| **Git** | 2.x | https://git-scm.com | Version control (opsional tapi disarankan) |

### Sudah Termasuk di Laragon
- PHP 8.1+
- MySQL 8.0
- Apache / Nginx

### Cek Instalasi

Buka terminal / Command Prompt, jalankan perintah berikut untuk memverifikasi:

```bash
node --version       # Harus: v18.x.x atau lebih baru
npm --version        # Harus: 9.x.x atau lebih baru
php --version        # Harus: PHP 8.1 atau lebih baru
composer --version   # Harus: Composer 2.x
```

---

## 2. Ekstrak File dari Google Drive

### Langkah-langkah

1. **Download kedua file ZIP** dari Google Drive:
   - `SWARA-Dashboard.zip` → file frontend (Next.js)
   - `swara-backend.zip` → file backend (Laravel)

2. **Buat folder kerja**, disarankan di root Laragon agar mudah diakses:
   ```
   C:\laragon\www\
   ```

3. **Ekstrak `swara-backend.zip`** ke:
   ```
   C:\laragon\www\swara-backend\
   ```

4. **Ekstrak `SWARA-Dashboard.zip`** ke lokasi manapun, contoh:
   ```
   C:\Users\NamaKamu\Documents\SWARA-Dashboard\
   ```
   atau langsung di dalam `C:\laragon\www\` jika ingin semua dalam satu tempat.

5. Pastikan struktur folder akhir seperti ini:
   ```
   C:\laragon\www\
   └── swara-backend\          ← folder backend Laravel
       ├── app\
       ├── routes\
       ├── .env                ← akan dibuat di langkah berikutnya
       └── ...

   C:\Users\NamaKamu\Documents\
   └── SWARA-Dashboard\        ← folder frontend Next.js
       ├── src\
       ├── .env.local          ← akan dibuat di langkah berikutnya
       └── ...
   ```

---

## 3. Setup Backend (Laravel)

Buka **terminal baru** (PowerShell / CMD), lalu ikuti langkah berikut.

### 3.1 Masuk ke Folder Backend

```bash
cd C:\laragon\www\swara-backend
```

### 3.2 Install Dependensi PHP

```bash
composer install
```

Tunggu hingga selesai. Proses ini akan mengunduh semua library PHP yang dibutuhkan ke folder `vendor/`.

### 3.3 Buat File Environment

Salin file contoh environment:

```bash
copy .env.example .env
```

Atau jika tidak ada `.env.example`, buat file `.env` baru dan isi dengan:

```env
APP_NAME=SWARA
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

LOG_CHANNEL=stack

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=swara_db
DB_USERNAME=root
DB_PASSWORD=

JWT_SECRET=VzQCcvbQMllqsYHjXuT5nsGkK2gNTIqGgNgmAVGp796VseTVDRfnRFWlpW05d3MT
JWT_TTL=1440
JWT_REFRESH_TTL=20160

CLOUDINARY_CLOUD_NAME=dkqeyc6eo
CLOUDINARY_API_KEY=596367781669349
CLOUDINARY_API_SECRET=oVzpyoTxCuh0jddvjK7Ay00cpQw

FIREBASE_PROJECT_ID=swara-mi-2026
```

> ⚠️ **Penting:** Pastikan tidak ada spasi di sekitar tanda `=` dan tidak ada spasi di akhir nilai, terutama pada `CLOUDINARY_API_KEY`.

### 3.4 Generate Application Key

```bash
php artisan key:generate
```

### 3.5 Buat Database

1. **Buka Laragon**, klik kanan pada tray icon → **Database** → **HeidiSQL** (atau buka phpMyAdmin via browser di `http://localhost/phpmyadmin`)
2. Login dengan:
   - Host: `127.0.0.1`
   - User: `root`
   - Password: *(kosong)*
3. Buat database baru dengan nama: **`swara_db`**
4. Encoding: `utf8mb4_unicode_ci`

### 3.6 Jalankan Migration & Seeder

```bash
# Jalankan semua migration (buat tabel)
php artisan migrate

# Jalankan seeder (isi data awal: roles, kategori, user test)
php artisan db:seed
```

Jika ingin reset dan isi ulang dari awal:

```bash
php artisan migrate:fresh --seed
```

### 3.7 Generate JWT Secret (jika belum ada)

```bash
php artisan jwt:secret
```

### 3.8 Buat Storage Link (untuk file upload lokal)

```bash
php artisan storage:link
```

### 3.9 Jalankan Server Backend

```bash
php artisan serve
```

Server backend akan berjalan di: **http://127.0.0.1:8000**

Biarkan terminal ini tetap buka. Buka terminal baru untuk langkah frontend.

---

## 4. Setup Frontend (Next.js)

Buka **terminal baru**, lalu ikuti langkah berikut.

### 4.1 Masuk ke Folder Frontend

```bash
cd C:\Users\NamaKamu\Documents\SWARA-Dashboard
```

Sesuaikan path dengan lokasi ekstrak kamu.

### 4.2 Install Dependensi Node.js

```bash
npm install
```

Tunggu hingga selesai. Proses ini mengunduh semua library JavaScript ke folder `node_modules/`.

### 4.3 Buat File Environment

Buat file `.env.local` di root folder frontend:

```bash
# Windows CMD
echo NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api > .env.local

# Atau buat manual — buat file baru bernama .env.local lalu isi:
```

Isi file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

> ⚠️ Prefix `NEXT_PUBLIC_` wajib ada agar variabel bisa diakses di sisi browser.

### 4.4 Jalankan Development Server

```bash
npm run dev
```

Frontend akan berjalan di: **http://localhost:3000**

---

## 5. Menjalankan Aplikasi

Setiap kali ingin membuka aplikasi, ikuti urutan berikut:

### Urutan yang Benar

```
1. Buka Laragon → Start All (untuk MySQL)
2. Terminal 1: cd swara-backend → php artisan serve
3. Terminal 2: cd SWARA-Dashboard → npm run dev
4. Buka browser → http://localhost:3000
```

### Ringkasan URL

| Layanan | URL | Keterangan |
|---|---|---|
| **Landing Page** | http://localhost:3000 | Halaman publik SWARA |
| **Login** | http://localhost:3000/login | Halaman login |
| **Dashboard User** | http://localhost:3000/dashboard | Setelah login sebagai user |
| **Dashboard Admin** | http://localhost:3000/admin/dashboard | Setelah login sebagai admin |
| **Backend API** | http://127.0.0.1:8000/api | Endpoint API Laravel |
| **phpMyAdmin** | http://localhost/phpmyadmin | Manajemen database |

---

## 6. Akun untuk Testing

| Email | Password | Role | Akses |
|---|---|---|---|
| `admin@swara.com` | `password` | Admin | Semua fitur admin + dashboard admin |
| `user@swara.com` | `password` | User | Dashboard user, buat laporan, riwayat |

---

## 7. Struktur Folder Frontend

```
SWARA-Dashboard/
├── public/                         ← File statis (logo, gambar, favicon)
│   └── logo.png
│
├── src/
│   ├── app/                        ← Next.js App Router (halaman-halaman)
│   │   │
│   │   ├── (public)/               ← Route group: halaman publik (tanpa layout dashboard)
│   │   │   ├── page.tsx            ← Landing page (http://localhost:3000)
│   │   │   ├── login/
│   │   │   │   └── page.tsx        ← Halaman login
│   │   │   └── register/
│   │   │       └── page.tsx        ← Halaman registrasi
│   │   │
│   │   ├── (dashboard)/            ← Route group: dashboard user (wajib login sebagai user)
│   │   │   ├── layout.tsx          ← Layout: Sidebar + Topbar + AuthGuard role="user"
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx        ← Halaman utama dashboard user
│   │   │   ├── laporan/
│   │   │   │   └── page.tsx        ← Form buat laporan baru
│   │   │   ├── peta/
│   │   │   │   └── page.tsx        ← Peta interaktif fullscreen
│   │   │   ├── kategori/
│   │   │   │   ├── page.tsx        ← Daftar semua kategori
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx    ← Detail kategori + laporan per kategori
│   │   │   ├── riwayat/
│   │   │   │   ├── page.tsx        ← Riwayat laporan milik user
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx    ← Detail laporan tertentu
│   │   │   ├── profil/
│   │   │   │   ├── page.tsx        ← Halaman profil user
│   │   │   │   └── edit/
│   │   │   │       └── page.tsx    ← Edit profil & ubah password
│   │   │   ├── notifikasi/
│   │   │   │   └── page.tsx        ← Daftar notifikasi user
│   │   │   └── bantuan/
│   │   │       └── page.tsx        ← Halaman bantuan & FAQ
│   │   │
│   │   ├── (admin)/                ← Route group: dashboard admin (wajib login sebagai admin)
│   │   │   ├── layout.tsx          ← Layout: AdminSidebar + AdminTopbar + AuthGuard role="admin"
│   │   │   └── admin/
│   │   │       ├── dashboard/
│   │   │       │   └── page.tsx    ← Dashboard utama admin
│   │   │       ├── reports/
│   │   │       │   └── page.tsx    ← Manajemen semua laporan
│   │   │       ├── analytics/
│   │   │       │   └── page.tsx    ← Halaman analitik & statistik
│   │   │       ├── notifications/
│   │   │       │   └── page.tsx    ← Manajemen notifikasi
│   │   │       ├── users/
│   │   │       │   └── page.tsx    ← Manajemen pengguna
│   │   │       ├── map-monitoring/
│   │   │       │   └── page.tsx    ← Monitoring peta real-time
│   │   │       ├── verification/
│   │   │       │   └── page.tsx    ← Antrian verifikasi laporan
│   │   │       └── settings/
│   │   │           └── page.tsx    ← Pengaturan sistem
│   │   │
│   │   └── layout.tsx              ← Root layout: AuthProvider + Toaster
│   │
│   ├── components/                 ← Komponen React yang dapat digunakan ulang
│   │   │
│   │   ├── landing/                ← Komponen khusus landing page
│   │   │   ├── Navbar.tsx          ← Navigasi atas landing page
│   │   │   ├── HeroSection.tsx     ← Bagian hero dengan stats real-time
│   │   │   ├── CategorySection.tsx ← Grid kategori layanan
│   │   │   ├── GISMapSection.tsx   ← Peta publik dengan filter
│   │   │   ├── AnalyticsSection.tsx← Statistik & grafik publik
│   │   │   ├── FeaturesSection.tsx ← Fitur-fitur unggulan
│   │   │   └── Footer.tsx          ← Footer landing page
│   │   │
│   │   ├── layout/                 ← Komponen layout dashboard user
│   │   │   ├── Sidebar.tsx         ← Sidebar navigasi user
│   │   │   └── Topbar.tsx          ← Topbar user (avatar, notifikasi)
│   │   │
│   │   ├── guards/
│   │   │   └── AuthGuard.tsx       ← Proteksi route berdasarkan role
│   │   │
│   │   ├── MapComponent.tsx        ← Komponen peta Leaflet (dipakai di banyak tempat)
│   │   │
│   │   ├── laporan/                ← Komponen form buat laporan
│   │   │   ├── LaporanForm.tsx     ← Form utama laporan
│   │   │   ├── ImageUpload.tsx     ← Upload foto laporan
│   │   │   ├── PreviewPanel.tsx    ← Preview sebelum submit
│   │   │   └── MiniMap.tsx         ← Peta kecil interaktif di form
│   │   │
│   │   ├── peta/                   ← Komponen halaman peta user
│   │   │   ├── PetaMap.tsx         ← Peta fullscreen
│   │   │   └── ReportDetailSidebar.tsx ← Sidebar detail laporan
│   │   │
│   │   ├── kategori/               ← Komponen halaman kategori
│   │   │   ├── KategoriHero.tsx    ← Header halaman kategori
│   │   │   └── KategoriCard.tsx    ← Card per kategori
│   │   │
│   │   ├── riwayat/                ← Komponen halaman riwayat
│   │   │   ├── RiwayatCard.tsx     ← Card per laporan di riwayat
│   │   │   ├── RiwayatHeader.tsx   ← Header + search riwayat
│   │   │   ├── RiwayatTabs.tsx     ← Tab filter status
│   │   │   └── RiwayatSidebar.tsx  ← Sidebar statistik riwayat
│   │   │
│   │   ├── profil/                 ← Komponen halaman profil
│   │   │   ├── ProfilAvatar.tsx    ← Upload & tampil avatar
│   │   │   └── ProfilMenu.tsx      ← Menu profil & logout
│   │   │
│   │   ├── dashboard/              ← Komponen dashboard user
│   │   │   ├── HeroSection.tsx     ← Sambutan & statistik user
│   │   │   ├── StatsCards.tsx      ← Kartu statistik laporan user
│   │   │   ├── CategoryGrid.tsx    ← Grid kategori di dashboard
│   │   │   ├── MapSection.tsx      ← Section peta mini di dashboard
│   │   │   └── UpdatesPanel.tsx    ← Panel update terbaru
│   │   │
│   │   └── admin/                  ← Komponen khusus admin
│   │       ├── layout/
│   │       │   ├── AdminSidebar.tsx    ← Sidebar admin (dark theme)
│   │       │   └── AdminTopbar.tsx     ← Topbar admin + search
│   │       ├── dashboard/          ← Semua widget di admin dashboard
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
│   │       │   └── AdminMap.tsx        ← Peta monitoring admin
│   │       └── reports/
│   │           ├── ReportsTable.tsx    ← Tabel semua laporan
│   │           ├── ReportsFilter.tsx   ← Filter laporan
│   │           └── ReportDetailDrawer.tsx ← Drawer detail laporan
│   │
│   ├── hooks/                      ← Custom React hooks
│   │   ├── useAuth.ts              ← State autentikasi user
│   │   ├── useReports.ts           ← Fetch daftar laporan (admin)
│   │   ├── useRiwayat.ts           ← Fetch riwayat laporan milik user
│   │   ├── useAdminDashboard.ts    ← Metrics dashboard admin
│   │   ├── useMapReports.ts        ← Data laporan untuk peta (dengan koordinat)
│   │   ├── useUserReports.ts       ← Laporan semua user untuk peta
│   │   ├── useUserDashboard.ts     ← Data dashboard user (paralel fetch)
│   │   ├── useVerification.ts      ← Antrian verifikasi laporan admin
│   │   ├── useKategori.ts          ← Daftar kategori (public)
│   │   ├── useNotifications.ts     ← Notifikasi user
│   │   ├── useAnalytics.ts         ← Data analitik admin
│   │   ├── useUsers.ts             ← Daftar pengguna (admin)
│   │   ├── usePublicMapReports.ts  ← Data peta untuk landing page (tanpa auth)
│   │   └── usePublicStats.ts       ← Statistik publik untuk landing page
│   │
│   ├── services/                   ← Fungsi pemanggilan API
│   │   ├── api.ts                  ← Axios instance + JWT interceptor
│   │   ├── auth.service.ts         ← Login, register, logout
│   │   ├── reports.service.ts      ← CRUD laporan
│   │   ├── categories.service.ts   ← Fetch kategori
│   │   ├── notifications.service.ts← Fetch & kelola notifikasi
│   │   ├── analytics.service.ts    ← Data analitik
│   │   ├── users.service.ts        ← Manajemen user
│   │   └── dashboard.service.ts    ← Data dashboard
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx         ← Global state autentikasi (React Context)
│   │
│   └── types/                      ← TypeScript type definitions
│       ├── auth.ts                 ← Tipe AuthUser, LoginRequest, dll
│       ├── report.ts               ← Tipe Report, ReportStatus, ReportFilters
│       ├── category.ts             ← Tipe Kategori
│       ├── notification.ts         ← Tipe Notifikasi
│       ├── analytics.ts            ← Tipe data analitik
│       ├── user.ts                 ← Tipe User (admin)
│       └── index.ts                ← Barrel export semua types
│
├── .env.local                      ← Variabel environment frontend (JANGAN di-commit)
├── next.config.js                  ← Konfigurasi Next.js
├── tailwind.config.js              ← Konfigurasi Tailwind CSS
├── tsconfig.json                   ← Konfigurasi TypeScript
└── package.json                    ← Daftar dependensi Node.js
```

---

## 8. Struktur Folder Backend

```
swara-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/            ← Logika bisnis tiap endpoint
│   │   │   ├── AuthController.php          ← Login, register, logout, refresh token
│   │   │   ├── ReportController.php        ← CRUD laporan + verifikasi admin
│   │   │   ├── KategoriController.php      ← Daftar & detail kategori
│   │   │   ├── NotifikasiController.php    ← Notifikasi user
│   │   │   ├── ProfilController.php        ← Update profil, foto, password
│   │   │   ├── AdminController.php         ← Manajemen pengguna (admin only)
│   │   │   ├── PublicStatsController.php   ← Statistik publik (tanpa auth)
│   │   │   ├── BroadcastController.php     ← Broadcast notifikasi ke semua user
│   │   │   └── FCMTokenController.php      ← Simpan & hapus FCM token (push notif)
│   │   │
│   │   ├── Requests/               ← Validasi input request
│   │   │   └── StoreReportRequest.php      ← Validasi form buat laporan
│   │   │
│   │   └── Resources/              ← Format response JSON
│   │       └── ReportResource.php          ← Format data laporan yang dikirim ke frontend
│   │
│   ├── Models/                     ← Eloquent ORM models
│   │   ├── User.php                ← Model pengguna
│   │   ├── Report.php              ← Model laporan
│   │   ├── ReportImage.php         ← Model foto laporan
│   │   └── Role.php                ← Model role (user/admin)
│   │
│   └── Services/
│       └── FCMService.php          ← Service untuk kirim push notification via Firebase
│
├── database/
│   ├── migrations/                 ← Skema tabel database
│   │   ├── ..._create_users_table.php
│   │   ├── ..._create_roles_table.php
│   │   ├── ..._create_reports_table.php
│   │   ├── ..._create_report_categories_table.php
│   │   ├── ..._create_report_images_table.php
│   │   ├── ..._add_priority_to_reports.php
│   │   ├── ..._add_admin_notes_to_reports.php
│   │   └── ..._add_is_urgent_to_reports.php
│   │
│   └── seeders/                    ← Data awal database
│       ├── DatabaseSeeder.php
│       ├── RoleSeeder.php          ← Isi tabel roles (user, admin)
│       ├── UserSeeder.php          ← Buat akun test (admin & user)
│       └── KategoriSeeder.php      ← Isi kategori laporan awal
│
├── routes/
│   └── api.php                     ← Semua definisi endpoint API
│
├── config/
│   ├── cors.php                    ← Konfigurasi CORS (izinkan localhost:3000)
│   └── jwt.php                     ← Konfigurasi JWT authentication
│
├── storage/
│   └── app/public/                 ← File upload lokal (jika tidak pakai Cloudinary)
│
├── .env                            ← Variabel environment backend (JANGAN di-commit)
├── composer.json                   ← Daftar dependensi PHP
└── artisan                         ← CLI Laravel
```

### Tabel Database

| Tabel | Keterangan |
|---|---|
| `users` | Data pengguna (id UUID, nama, email, password_hash, foto, role_id) |
| `roles` | Peran pengguna (id:1=user, id:2=admin) |
| `reports` | Data laporan (judul, deskripsi, koordinat, status, priority, is_urgent) |
| `report_categories` | Kategori laporan (name, icon_url, is_active) |
| `report_images` | Foto-foto laporan (report_id, image_url Cloudinary) |
| `notifications` | Notifikasi in-app untuk user |

---

## 9. Panduan Mengedit Komponen Frontend

### 9.1 Mengubah Teks & Konten Landing Page

**Navbar (teks menu, tombol):**
```
src/components/landing/Navbar.tsx
```
- Cari array `navLinks` untuk mengubah item menu navigasi
- Cari bagian `Desktop Buttons` untuk mengubah teks tombol Login / Mulai Sekarang

**Hero Section (judul, subjudul, tombol CTA):**
```
src/components/landing/HeroSection.tsx
```
- Ubah teks `<h1>` untuk judul utama
- Ubah teks `<p>` di bawahnya untuk deskripsi
- Ganti `href` di `<Link>` untuk mengubah tujuan tombol CTA

**Footer:**
```
src/components/landing/Footer.tsx
```
- Edit alamat, nomor telepon, email kontak di sini

### 9.2 Mengubah Warna & Tema

Warna utama diatur di `tailwind.config.js`:

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: '#...',         // warna utama (hijau)
      'primary-hover': '#...', // warna hover tombol
      gold: '#...',            // warna aksen emas
      bg: '#...',              // warna latar belakang
      text: '#...',            // warna teks utama
      muted: '#...',           // warna teks sekunder
      border: '#...',          // warna garis border
    }
  }
}
```

Setelah mengubah warna di sini, semua komponen yang menggunakan class `text-primary`, `bg-primary`, dll akan otomatis ikut berubah.

### 9.3 Mengubah Kategori Laporan

Kategori dikelola dari **database**, bukan dari kode. Untuk menambah/edit kategori:

1. Buka phpMyAdmin di `http://localhost/phpmyadmin`
2. Pilih database `swara_db`
3. Buka tabel `report_categories`
4. Edit kolom:
   - `name` → nama kategori
   - `icon_url` → URL gambar ikon (upload ke Cloudinary terlebih dahulu)
   - `is_active` → `1` untuk tampil, `0` untuk sembunyikan

### 9.4 Mengedit Tampilan Dashboard User

**Sidebar navigasi user:**
```
src/components/layout/Sidebar.tsx
```
- Ubah array `navItems` untuk menambah/hapus menu
- Setiap item: `{ name, href, icon }` — icon dari library `lucide-react`

**Topbar user (avatar, nama):**
```
src/components/layout/Topbar.tsx
```

**Kartu statistik di dashboard:**
```
src/components/dashboard/StatsCards.tsx
```

**Grid kategori di dashboard:**
```
src/components/dashboard/CategoryGrid.tsx
```

### 9.5 Mengedit Tampilan Dashboard Admin

**Sidebar admin:**
```
src/components/admin/layout/AdminSidebar.tsx
```
- Ubah array `menuItems` untuk menambah/hapus menu admin

**Topbar admin (search, notifikasi):**
```
src/components/admin/layout/AdminTopbar.tsx
```
- Ubah `SEARCH_CATEGORIES` untuk mengatur ke mana hasil pencarian diarahkan

**Tabel laporan:**
```
src/components/admin/reports/ReportsTable.tsx
```

**Filter laporan:**
```
src/components/admin/reports/ReportsFilter.tsx
```

**Grafik & chart di dashboard admin:**
```
src/components/admin/dashboard/ReportsChart.tsx
src/components/admin/dashboard/CategoryChart.tsx
src/components/admin/dashboard/StatusChart.tsx
```

### 9.6 Mengedit Form Laporan

```
src/components/laporan/LaporanForm.tsx
```
- Tambah/hapus field di form
- Ubah daftar kecamatan di array kecamatan (ada 27 kecamatan Lamongan)
- Ubah validasi di bagian `validate()`

### 9.7 Menambah Halaman Baru

1. Buat folder di `src/app/(dashboard)/nama-halaman/`
2. Buat file `page.tsx` di dalamnya
3. Tambahkan link menu di `src/components/layout/Sidebar.tsx`

Contoh menambah halaman "Pengumuman":

```tsx
// src/app/(dashboard)/pengumuman/page.tsx
export default function PengumumanPage() {
  return (
    <div>
      <h1>Pengumuman</h1>
    </div>
  )
}
```

```tsx
// src/components/layout/Sidebar.tsx — tambahkan ke navItems:
{ name: 'Pengumuman', href: '/pengumuman', icon: Megaphone },
```

### 9.8 Mengubah Koneksi API

Semua pemanggilan API ada di:
```
src/services/
```

Jika endpoint backend berubah, edit file service yang relevan. Contoh mengubah endpoint laporan:

```typescript
// src/services/reports.service.ts
export const getReports = async (filters: ReportFilters) => {
  const response = await api.get('/laporan', { params: filters })
  // ganti '/laporan' jika endpoint berubah
  return response.data
}
```

URL base API dikonfigurasi di `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

---

## 10. Konfigurasi Environment

### Frontend — `.env.local`

```env
# URL backend API — sesuaikan jika backend berjalan di port berbeda
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

### Backend — `.env`

```env
# Aplikasi
APP_NAME=SWARA
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

# Database MySQL (via Laragon)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=swara_db
DB_USERNAME=root
DB_PASSWORD=

# JWT Authentication
JWT_SECRET=VzQCcvbQMllqsYHjXuT5nsGkK2gNTIqGgNgmAVGp796VseTVDRfnRFWlpW05d3MT
JWT_TTL=1440           # Token berlaku 24 jam
JWT_REFRESH_TTL=20160  # Refresh token berlaku 14 hari

# Cloudinary (penyimpanan foto laporan)
CLOUDINARY_CLOUD_NAME=dkqeyc6eo
CLOUDINARY_API_KEY=596367781669349
CLOUDINARY_API_SECRET=oVzpyoTxCuh0jddvjK7Ay00cpQw

# Firebase Cloud Messaging (push notification)
FIREBASE_PROJECT_ID=swara-mi-2026

# CORS — izinkan frontend mengakses backend
# Sudah diatur di config/cors.php: allowed_origins = ['http://localhost:3000']
```

---

## 11. API Endpoints

### Public (Tanpa Token)

| Method | Endpoint | Keterangan |
|---|---|---|
| `POST` | `/api/auth/register` | Registrasi akun baru |
| `POST` | `/api/auth/login` | Login, return JWT token |
| `POST` | `/api/auth/google` | Login via Google OAuth |
| `GET` | `/api/kategori` | Daftar semua kategori aktif |
| `GET` | `/api/kategori/{id}` | Detail satu kategori |
| `GET` | `/api/stats` | Statistik publik (total laporan, completion rate) |
| `GET` | `/api/publik/peta` | Data laporan untuk peta landing page |

### Protected (Wajib Bearer Token)

**Autentikasi:**

| Method | Endpoint | Keterangan |
|---|---|---|
| `GET` | `/api/auth/me` | Data user yang sedang login |
| `POST` | `/api/auth/logout` | Logout, invalidate token |
| `POST` | `/api/auth/refresh` | Refresh JWT token |

**Laporan:**

| Method | Endpoint | Keterangan |
|---|---|---|
| `GET` | `/api/laporan` | Daftar laporan (support filter & pagination) |
| `POST` | `/api/laporan` | Buat laporan baru (multipart/form-data) |
| `GET` | `/api/laporan/riwayat` | Riwayat laporan milik user sendiri |
| `GET` | `/api/laporan/{id}` | Detail satu laporan |
| `PUT` | `/api/laporan/{id}` | Edit laporan (hanya status tersubmit) |
| `DELETE` | `/api/laporan/{id}` | Hapus laporan (soft delete) |
| `PUT` | `/api/laporan/{id}/verifikasi` | Verifikasi laporan — admin only |

**Notifikasi:**

| Method | Endpoint | Keterangan |
|---|---|---|
| `GET` | `/api/notifikasi` | Daftar notifikasi user |
| `PUT` | `/api/notifikasi/read-all` | Tandai semua sudah dibaca |
| `PUT` | `/api/notifikasi/{id}/read` | Tandai satu notifikasi dibaca |
| `DELETE` | `/api/notifikasi/{id}` | Hapus notifikasi |

**Profil:**

| Method | Endpoint | Keterangan |
|---|---|---|
| `GET` | `/api/profil` | Data profil user |
| `PUT` | `/api/profil` | Update nama, email, no_telp |
| `POST` | `/api/profil/foto` | Upload foto profil |
| `PUT` | `/api/profil/password` | Ubah password |

**Admin:**

| Method | Endpoint | Keterangan |
|---|---|---|
| `GET` | `/api/admin/users` | Daftar semua pengguna |
| `POST` | `/api/admin/broadcast` | Broadcast notifikasi ke semua user |

---

## 12. Troubleshooting

### Backend tidak bisa diakses (http://127.0.0.1:8000)

**Penyebab & solusi:**
- Pastikan Laragon sudah running (MySQL harus aktif)
- Jalankan ulang: `php artisan serve`
- Cek apakah port 8000 dipakai program lain: `netstat -an | findstr 8000`
- Coba port lain: `php artisan serve --port=8001` lalu update `.env.local` frontend

### Frontend error "Failed to fetch" atau CORS error

**Solusi:**
1. Pastikan backend sudah berjalan di `http://127.0.0.1:8000`
2. Cek `config/cors.php` — `allowed_origins` harus berisi `http://localhost:3000`
3. Setelah ubah CORS, jalankan: `php artisan config:clear`

### Database: "SQLSTATE: Access denied"

**Solusi:**
- Cek username & password MySQL di `.env` backend
- Default Laragon: `DB_USERNAME=root`, `DB_PASSWORD=` (kosong)

### Migration error: "Table already exists"

**Solusi:**
```bash
php artisan migrate:fresh --seed
```
> ⚠️ Perintah ini akan **menghapus semua data** dan membuat ulang dari awal.

### "Invalid api_key" saat upload foto

**Penyebab:** Ada spasi di `.env` pada baris `CLOUDINARY_API_KEY`.

**Solusi:** Buka `.env` backend, pastikan:
```env
CLOUDINARY_API_KEY=596367781669349
# Bukan:
CLOUDINARY_API_KEY= 596367781669349  ← ada spasi, ini salah!
```

### Peta tidak muncul (blank/error)

**Penyebab:** React Leaflet tidak bisa di-render di server (SSR).

**Solusi:** Pastikan komponen peta di-import dengan `dynamic` dan `ssr: false`:
```tsx
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
})
```

### Token expired — user terpaksa login ulang terus

**Solusi:** Cek nilai `JWT_TTL` di `.env` backend. Nilai `1440` = 24 jam. Naikkan sesuai kebutuhan.

### npm install gagal / node_modules error

**Solusi:**
```bash
# Hapus node_modules dan package-lock.json
rm -rf node_modules package-lock.json

# Install ulang
npm install
```

### `php artisan` tidak dikenali di terminal

**Penyebab:** PHP belum ditambahkan ke PATH sistem.

**Solusi:**
1. Buka Laragon → Menu → PHP → Add PHP to Path
2. Restart terminal
3. Cek: `php --version`

---

## 📝 Catatan Penting untuk Developer

- **Jangan commit** file `.env` dan `.env.local` ke Git — keduanya berisi credential sensitif
- **UUID** — semua `id` di tabel `users` dan `reports` adalah UUID string, bukan integer
- **Kolom non-standard** di tabel `users`: `nama` (bukan `name`), `password_hash` (bukan `password`), `no_telp`, `foto`
- **Status laporan** yang valid: `tersubmit`, `diverifikasi`, `diproses`, `selesai`, `ditolak` — kata `urgent` bukan status, melainkan field `is_urgent: boolean` terpisah
- **Icon kategori** (`icon_url`) berisi URL gambar dari Cloudinary, bukan nama icon Lucide — render dengan `<img>`, bukan komponen icon
- **Format tanggal** dari backend: `"10 Mei 2025 14:30"` (bukan ISO 8601) — gunakan fungsi `parseBackendDate()` sebelum diproses dengan library tanggal
- **Soft delete** — laporan yang dihapus tidak benar-benar terhapus dari DB, statusnya diubah ke `ditolak` dan kolom `deleted_at` diisi

---

*Dokumentasi ini dibuat untuk proyek SWARA — Tugas Akhir D4 Manajemen Informatika.*
