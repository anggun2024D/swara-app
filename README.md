# 🗣️ SWARA Backend

**Suara Warga untuk Ruang dan Aset**
Universitas Negeri Surabaya | Manajemen Informatika

Aplikasi pelaporan masalah lingkungan dan 
partisipasi warga berbasis digital.

---

## 📋 Requirements

| Software | Versi |
|----------|-------|
| PHP | 8.2+ |
| Composer | 2.x |
| MySQL | 8.0+ |
| XAMPP/Laragon | Terbaru |

---

## 🚀 Cara Setup Project

### 1. Clone Repository
```bash
git clone {url_repository_github}
cd swara-backend
```

### 2. Install Dependencies
```bash
composer install
```

### 3. Copy File .env
```bash
cp .env.example .env
```

### 4. Generate App Key
```bash
php artisan key:generate
```

### 5. Generate JWT Secret
```bash
php artisan jwt:secret
```

### 6. Konfigurasi Database
Buka file .env dan isi:
```env
DB_DATABASE=swara_db
DB_USERNAME=root
DB_PASSWORD=
```

### 7. Buat Database
Buka phpMyAdmin di browser:
```
http://localhost/phpmyadmin
```
Buat database baru bernama: **swara_db**

### 8. Jalankan Migration
```bash
php artisan migrate
```

### 9. Isi Data Awal
```bash
php artisan db:seed
```

### 10. Setup Storage
```bash
php artisan storage:link
```

### 11. Jalankan Server
```bash
php artisan serve
```

Server berjalan di: **http://127.0.0.1:8000**

---

## 🔌 Jika Flutter & Laravel Beda Komputer
```bash
# Cek IP komputer ini dulu
ipconfig

# Jalankan server dengan IP lokal
php artisan serve --host=192.168.x.x --port=8000
```

Pastikan kedua komputer terhubung 
ke WiFi yang **sama**!

---

## 📚 Dokumentasi

| File | Isi |
|------|-----|
| API_DOCUMENTATION.md | Semua endpoint API |
| TECHNICAL_NOTES.md | Catatan teknis untuk frontend |

---
allen

## 🧪 Testing API

Import file berikut ke Postman:
- `SWARA_API.postman_collection.json`
- `SWARA_Local.postman_environment.json`

---

## 📊 Struktur Database

Terdiri dari 8 tabel:
1. roles
2. users
3. user_sessions
4. report_categories
5. reports
6. report_images
7. report_status_logs
8. notifications
