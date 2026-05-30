# 🗺️ SWARA Backend

**Suara Warga untuk Ruang dan Aset**  
Universitas Negeri Surabaya | D4 Manajemen Informatika

Platform pelaporan infrastruktur berbasis GIS untuk smart city Kabupaten Lamongan.  
Dibangun dengan **Laravel** + **JWT Authentication** + **Cloudinary** untuk penyimpanan foto.

---

## 📋 Requirements

| Software | Versi | Keterangan |
|---|---|---|
| PHP | 8.1+ | Sudah termasuk di Laragon |
| Composer | 2.x | https://getcomposer.org |
| MySQL | 8.0+ | Sudah termasuk di Laragon |
| Laragon | 6.0+ | https://laragon.org/download |

---

## 🚀 Cara Setup Project

### 1. Clone Repository

```bash
git clone https://github.com/anggun2024D/swara-app.git
cd swara-app
```

> Repository ini menyimpan backend di branch `main` dan frontend di branch `frontend`.  
> Kamu sudah berada di branch `main` (backend) secara default.

### 2. Install Dependencies

```bash
composer install
```

### 3. Buat File `.env`

```bash
cp .env.example .env
```

Lalu buka file `.env` dan sesuaikan isinya:

```env
APP_NAME=SWARA
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=swara_db
DB_USERNAME=root
DB_PASSWORD=

JWT_SECRET=
JWT_TTL=1440
JWT_REFRESH_TTL=20160

CLOUDINARY_CLOUD_NAME=dkqeyc6eo
CLOUDINARY_API_KEY=596367781669349
CLOUDINARY_API_SECRET=oVzpyoTxCuh0jddvjK7Ay00cpQw

FIREBASE_PROJECT_ID=swara-mi-2026
```

> ⚠️ Pastikan tidak ada spasi di sekitar `=` dan tidak ada spasi di akhir nilai,  
> terutama pada `CLOUDINARY_API_KEY` — pernah menyebabkan error `Invalid api_key`.

### 4. Generate Application Key

```bash
php artisan key:generate
```

### 5. Generate JWT Secret

```bash
php artisan jwt:secret
```

### 6. Buat Database

1. Buka Laragon → klik kanan tray icon → **Database** → **HeidiSQL**  
   atau buka phpMyAdmin di browser: `http://localhost/phpmyadmin`
2. Login: host `127.0.0.1`, user `root`, password kosong
3. Buat database baru bernama: **`swara_db`**
4. Encoding: `utf8mb4_unicode_ci`

### 7. Jalankan Migration

```bash
php artisan migrate
```

### 8. Isi Data Awal (Seeder)

```bash
php artisan db:seed
```

Perintah ini akan mengisi:
- Tabel `roles` → data role user & admin
- Tabel `report_categories` → kategori laporan awal
- Tabel `users` → akun test admin & user

Untuk reset dan isi ulang dari awal:

```bash
php artisan migrate:fresh --seed
```

### 9. Setup Storage Link

```bash
php artisan storage:link
```

### 10. Bersihkan Cache

```bash
php artisan route:clear
php artisan config:clear
php artisan cache:clear
```

### 11. Jalankan Server

```bash
php artisan serve
```

Server berjalan di: **http://127.0.0.1:8000**

---

## 👤 Akun Default untuk Testing

| Email | Password | Role |
|---|---|---|
| `admin@swara.com` | `password` | Admin |
| `user@swara.com` | `password` | User |

---

## 📊 Struktur Database

Terdiri dari 8 tabel:

| No | Tabel | Keterangan |
|---|---|---|
| 1 | `roles` | Peran pengguna (id:1=user, id:2=admin) |
| 2 | `users` | Data pengguna (UUID, nama, email, password_hash, foto, fcm_token) |
| 3 | `user_sessions` | Sesi login pengguna |
| 4 | `report_categories` | Kategori laporan (name, icon_url, is_active) |
| 5 | `reports` | Data laporan (judul, deskripsi, koordinat, status, priority, is_urgent) |
| 6 | `report_images` | Foto laporan (URL Cloudinary) |
| 7 | `report_status_logs` | Log riwayat perubahan status laporan |
| 8 | `notifications` | Notifikasi in-app untuk user |

### Kolom Penting di Tabel `reports`

| Kolom | Type | Keterangan |
|---|---|---|
| `id` | UUID | Primary key, bukan integer |
| `status` | enum | `tersubmit` / `diverifikasi` / `diproses` / `selesai` / `ditolak` |
| `priority` | enum nullable | `rendah` / `sedang` / `tinggi` / `urgent` |
| `is_urgent` | boolean | Penanda laporan mendesak (terpisah dari status) |
| `admin_notes` | text nullable | Catatan admin saat verifikasi |
| `deleted_at` | timestamp | Soft delete |

---

## 🔌 API Endpoints

### Public (Tanpa Token)

| Method | Endpoint | Keterangan |
|---|---|---|
| `POST` | `/api/auth/register` | Registrasi akun baru |
| `POST` | `/api/auth/login` | Login, return JWT token |
| `GET` | `/api/kategori` | Daftar semua kategori aktif |
| `GET` | `/api/kategori/{id}` | Detail satu kategori |
| `GET` | `/api/stats` | Statistik publik (total laporan, completion rate) |
| `GET` | `/api/publik/peta` | Data laporan untuk peta landing page |

### Protected (Wajib Bearer Token)

| Method | Endpoint | Keterangan |
|---|---|---|
| `GET` | `/api/auth/me` | Data user yang sedang login |
| `POST` | `/api/auth/logout` | Logout |
| `GET` | `/api/laporan` | Daftar laporan (support filter & pagination) |
| `POST` | `/api/laporan` | Buat laporan baru (multipart/form-data) |
| `GET` | `/api/laporan/riwayat` | Riwayat laporan milik user |
| `GET` | `/api/laporan/{id}` | Detail laporan |
| `PUT` | `/api/laporan/{id}/verifikasi` | Verifikasi laporan — admin only |
| `GET` | `/api/notifikasi` | Daftar notifikasi |
| `GET` | `/api/profil` | Data profil user |
| `PUT` | `/api/profil` | Update nama, email, no_telp |
| `POST` | `/api/profil/foto` | Upload foto profil ke Cloudinary |
| `PUT` | `/api/profil/password` | Ubah password |
| `GET` | `/api/admin/users` | Daftar semua pengguna — admin only |

---

## 📁 Struktur Folder

```
swara-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/        ← Logika bisnis tiap endpoint
│   │   ├── Requests/           ← Validasi input
│   │   └── Resources/          ← Format response JSON
│   ├── Models/                 ← Eloquent ORM (User, Report, dll)
│   └── Services/
│       └── FCMService.php      ← Push notification Firebase
├── database/
│   ├── migrations/             ← Skema tabel database
│   └── seeders/                ← Data awal (roles, kategori, user test)
├── routes/
│   └── api.php                 ← Semua definisi endpoint API
├── config/
│   ├── cors.php                ← Izinkan akses dari localhost:3000
│   └── jwt.php                 ← Konfigurasi JWT
└── .env                        ← Variabel environment (jangan di-commit!)
```

---

## ⚠️ Catatan Teknis Penting

- **UUID** — semua `id` di tabel `users` dan `reports` adalah UUID string, bukan integer
- **Kolom non-standard** — `nama` (bukan `name`), `password_hash` (bukan `password`), `no_telp`, `foto`
- **JWT Library** — menggunakan `tymon/jwt-auth`, bukan `php-open-source-saver`
- **Soft delete** — laporan yang dihapus tidak benar-benar hilang; `deleted_at` diisi dan status diubah ke `ditolak`
- **FCM try-catch** — error push notification tidak membatalkan proses simpan laporan
- **Cloudinary** — semua foto (laporan & profil) disimpan di Cloudinary, bukan local storage
- **CORS** — sudah dikonfigurasi di `config/cors.php` untuk mengizinkan `http://localhost:3000`

---

*SWARA — Tugas Akhir D4 Manajemen Informatika, Universitas Negeri Surabaya*
