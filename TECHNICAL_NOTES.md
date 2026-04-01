# 🔧 SWARA Technical Notes untuk Frontend

Universitas Negeri Surabaya | Manajemen Informatika

---

## Tech Stack Backend
| Komponen | Teknologi |
|----------|-----------|
| Framework | Laravel 11 |
| Database | MySQL |
| Authentication | JWT (tymon/jwt-auth) |
| Storage | Laravel Public Storage |
| PHP | 8.2+ |

---

## Hal Penting yang Wajib Diketahui

### 1. Format ID
```
Semua ID laporan dan user berbentuk UUID!
Bukan angka biasa!

Benar  : "550e8400-e29b-41d4-a716-446655440000"
Salah  : 1, 2, 3, dst

Yang menggunakan UUID:
- users.id
- reports.id

Yang menggunakan integer biasa:
- roles.id
- report_categories.id
- report_images.id
- notifications.id
```

### 2. Authentication JWT
```
- Package  : tymon/jwt-auth
- Bukan    : Laravel Sanctum
- Header   : Authorization: Bearer {token}
- Expired  : 1 hari (1440 menit)

Cara simpan token di Flutter:
→ Gunakan shared_preferences
→ Simpan saat login berhasil
→ Hapus saat logout
→ Cek expired sebelum request
```

### 3. Upload File
```
Untuk upload foto (laporan & profil):
→ Gunakan multipart/form-data
→ BUKAN application/json!

Key untuk upload laporan : images[]
Key untuk upload profil  : foto

Di Flutter gunakan:
→ MultipartFile dari package dio
→ atau ImagePicker + FormData
```

### 4. URL Foto
```
Format URL foto yang dikembalikan API:
{base_url}/storage/{path}

Contoh:
http://127.0.0.1:8000/storage/reports/foto.jpg
http://127.0.0.1:8000/storage/profiles/foto.jpg

Sudah otomatis dikirim di response API!
Flutter tinggal load URL-nya langsung.
```

### 5. Koordinat Lokasi
```
Untuk wilayah Lamongan:
latitude  : sekitar -7.1166
longitude : sekitar 112.2384

Validasi di backend:
latitude  : antara -90 dan 90
longitude : antara -180 dan 180
```

### 6. Peta
```
Pakai OpenStreetMap + flutter_map
BUKAN Google Maps!

Package yang dibutuhkan:
flutter_map: ^6.x.x
latlong2: ^0.9.x

Tidak butuh API key apapun!
100% gratis!
```

### 7. Format Response yang Berbeda
```
PERHATIAN!

Endpoint AUTH menggunakan format:
{
    "status": "success/error",
    "message": "...",
    "data": {}
}

Endpoint LAINNYA menggunakan format:
{
    "success": true/false,
    "message": "...",
    "data": {}
}

Pastikan flutter membaca field yang benar!
```

### 8. Pagination
```
Endpoint daftar laporan menggunakan pagination.
Default 10 data per halaman.

Tambahkan query ?page=2 untuk halaman 2.

Info pagination ada di:
response.data.pagination.total
response.data.pagination.total_halaman
response.data.pagination.halaman_ini
```

### 9. Base URL
```
Development (lokal):
http://127.0.0.1:8000/api

Jika flutter dan laravel beda komputer
(dalam satu jaringan WiFi yang sama):
http://{IP_KOMPUTER_LARAVEL}:8000/api

Cara cek IP komputer Laravel:
→ Buka CMD
→ Ketik: ipconfig
→ Cari IPv4 Address
→ Contoh: 192.168.1.5

Maka base URL menjadi:
http://192.168.1.5:8000/api

Jalankan Laravel dengan:
php artisan serve --host=192.168.1.5 --port=8000
```

---

## Package Flutter yang Direkomendasikan
```yaml
dependencies:
  # HTTP Client untuk request ke API
  dio: ^5.x.x

  # Peta OpenStreetMap
  flutter_map: ^6.x.x
  latlong2: ^0.9.x

  # Simpan token & preferensi lokal
  shared_preferences: ^2.x.x

  # Upload foto dari kamera/galeri
  image_picker: ^1.x.x

  # State management
  provider: ^6.x.x

  # Tampilkan foto dari URL
  cached_network_image: ^3.x.x

  # Format tanggal
  intl: ^0.19.x
```

---

## Struktur Folder Flutter yang Disarankan
```
lib/
├── main.dart
├── config/
│   └── api_config.dart      ← base URL & endpoints
├── models/
│   ├── user_model.dart
│   ├── report_model.dart
│   ├── kategori_model.dart
│   └── notifikasi_model.dart
├── services/
│   ├── auth_service.dart
│   ├── report_service.dart
│   └── api_service.dart
├── providers/
│   ├── auth_provider.dart
│   └── report_provider.dart
└── screens/
    ├── splash_screen.dart
    ├── auth/
    │   ├── login_screen.dart
    │   └── register_screen.dart
    ├── home/
    │   └── home_screen.dart
    ├── laporan/
    │   ├── tambah_laporan_screen.dart
    │   ├── riwayat_laporan_screen.dart
    │   └── detail_laporan_screen.dart
    ├── lokasi/
    │   └── lokasi_screen.dart
    ├── notifikasi/
    │   └── notifikasi_screen.dart
    └── profil/
        └── profil_screen.dart
