# 📱 SWARA API Documentation

**Suara Warga untuk Ruang dan Aset**
Universitas Negeri Surabaya | Manajemen Informatika

---

## 📌 Informasi Umum

| Info | Detail |
|------|--------|
| Base URL | http://127.0.0.1:8000/api |
| Format Response | JSON |
| Authentication | JWT Bearer Token |
| Versi Laravel | 11.x |
| Versi PHP | 8.2+ |

---

## 🔐 Authentication

Semua endpoint kecuali **register** dan **login**
wajib menyertakan token di header:
```
Authorization: Bearer {token}
Accept: application/json
```

Token didapat setelah berhasil login.
Token expired setelah **1 hari (1440 menit)**.

---

## 📋 Format Response

Struktur umum untuk balikan (response) dari API SWARA.

### 1. Response Sukses (Data Object / Array)
```json
{
    "success": true,
    "message": "Pesan sukses operasional",
    "data": {
        // Objek data atau array list data terkait
    }
}
```

### 2. Response Sukses (Dengan Pagination)
Untuk data list yang memiliki halaman (pagination) seperti pada daftar laporan:
```json
{
    "success": true,
    "message": "Pesan sukses",
    "data": {
        "nama_list": [ /* array of objects */ ],
        "pagination": {
            "total": 10,
            "per_halaman": 10,
            "halaman_ini": 1,
            "total_halaman": 1
        }
    }
}
```

### 3. Response Error (400, 401, 403, 404, 500)
```json
{
    "success": false,
    "message": "Pesan error penjelasan penyebab gagal",
    "data": null
}
```

### 4. Response Validasi Error (422)
Gagal saat input form tidak sesuai aturan (rule):
```json
{
    "success": false,
    "message": "Validasi gagal",
    "errors": {
        "nama_field": [
            "pesan error 1 untuk field ini",
            "pesan error 2 jika ada"
        ]
    }
}
```

> ⚠️ **Pengecualian Endpoint Auth:** Khusus endpoint otentikasi (Auth) saat ini menggunakan key `"status": "success"` / `"status": "error"` (bertipe `string`) dan bukan `"success": true|false` (bertipe `boolean`).

---

## 🔑 AUTH ENDPOINTS

### 1. Register
```
Method : POST
URL    : /api/auth/register
Auth   : Tidak perlu
```

**Request Body (JSON):**
```json
{
    "nama": "string (required, min:3, max:100)",
    "email": "string (required, email, unique)",
    "password": "string (required, min:8)",
    "password_confirmation": "string (required)"
}
```

**Response 201 (Berhasil):**
```json
{
    "status": "success",
    "message": "Registrasi berhasil",
    "data": {
        "user": {
            "id": "uuid",
            "nama": "Nama User",
            "email": "email@gmail.com"
        }
    }
}
```

---

### 2. Login
```
Method : POST
URL    : /api/auth/login
Auth   : Tidak perlu
```

**Request Body (JSON):**
```json
{
    "email": "string (required)",
    "password": "string (required)"
}
```

**Response 200 (Berhasil):**
```json
{
    "status": "success",
    "message": "Login berhasil",
    "data": {
        "token": "eyJ0eXAiOiJKV1Qi...",
        "user": {
            "id": "uuid",
            "nama": "Nama User",
            "email": "email@gmail.com",
            "role": "user"
        }
    }
}
```

---

### 3. Logout
```
Method : POST
URL    : /api/auth/logout
Auth   : Bearer Token
```

**Response 200 (Berhasil):**
```json
{
    "status": "success",
    "message": "Logout berhasil"
}
```

---

### 4. Get Profile
```
Method : GET
URL    : /api/auth/profile
Auth   : Bearer Token
```

**Response 200 (Berhasil):**
```json
{
    "status": "success",
    "message": "Data profil berhasil diambil",
    "data": {
        "user": {
            "id": "uuid",
            "nama": "Nama User",
            "email": "email@gmail.com",
            "foto_url": null,
            "dark_mode": false,
            "notifications_enabled": true,
            "role": "user",
            "created_at": "2026-03-18T10:00:00"
        }
    }
}
```

---

### 5. Delete Account
```
Method : DELETE
URL    : /api/auth/delete-account
Auth   : Bearer Token
```

**Response 200 (Berhasil):**
```json
{
    "status": "success",
    "message": "Akun berhasil dihapus"
}
```

---

## 📝 LAPORAN ENDPOINTS

### 1. Buat Laporan Baru
```
Method       : POST
URL          : /api/laporan
Auth         : Bearer Token
Content-Type : multipart/form-data
```

**Request Body (form-data):**
```
judul        : string (required, min:5, max:150)
deskripsi    : string (required, min:10)
category_id  : integer (required, exists di tabel)
latitude     : decimal (required, antara -90 & 90)
longitude    : decimal (required, antara -180 & 180)
address      : string (optional, max:255)
is_confirmed : boolean (required, harus bernilai 1)
images[]     : file (required, min:1 max:5 file,
               format jpg/jpeg/png, max 5MB per file)
```

**Response 201 (Berhasil):**
```json
{
    "success": true,
    "message": "Laporan berhasil dikirim",
    "data": {
        "id": "uuid",
        "judul": "Jalan Rusak",
        "deskripsi": "Jalan berlubang...",
        "status": "tersubmit",
        "priority": "sedang",
        "lokasi": {
            "latitude": "-7.1166",
            "longitude": "112.2384",
            "address": "Jl. Raya Lamongan"
        },
        "kategori": {
            "id": 2,
            "nama": "Jalan"
        },
        "pelapor": {
            "id": "uuid",
            "nama": "Nama User"
        },
        "foto": [
            {
                "id": 1,
                "url": "http://127.0.0.1:8000/storage/reports/foto.jpg"
            }
        ],
        "dibuat_pada": "18 Mar 2026 10:30"
    }
}
```

---

### 2. Lihat Daftar Laporan
```
Method : GET
URL    : /api/laporan
Auth   : Bearer Token
```

**Query Parameters (Optional):**
```
category_id : integer → filter kategori
status      : string  → filter status
              (tersubmit/diproses/selesai/ditolak)
search      : string  → cari judul/deskripsi/alamat
daerah      : string  → cari berdasarkan daerah
page        : integer → halaman (default: 1)
```

**Contoh URL dengan filter:**
```
/api/laporan?category_id=2
/api/laporan?status=diproses
/api/laporan?search=jalan+rusak
/api/laporan?category_id=2&status=tersubmit
```

**Response 200 (Berhasil):**
```json
{
    "success": true,
    "message": "Daftar laporan berhasil dimuat",
    "data": {
        "laporan": [ ],
        "pagination": {
            "total": 10,
            "per_halaman": 10,
            "halaman_ini": 1,
            "total_halaman": 1
        }
    }
}
```

---

### 3. Detail Laporan
```
Method : GET
URL    : /api/laporan/{id}
Auth   : Bearer Token
```

> ID berbentuk UUID, contoh:
> /api/laporan/550e8400-e29b-41d4-a716-446655440000

---

### 4. Riwayat Laporan User
```
Method : GET
URL    : /api/laporan/riwayat
Auth   : Bearer Token
```

**Query Parameters (Optional):**
```
status : string → filter status
search : string → cari laporan
```

---

## 📂 KATEGORI ENDPOINTS

### 1. Lihat Semua Kategori
```
Method : GET
URL    : /api/kategori
Auth   : Bearer Token
```

**Response 200 (Berhasil):**
```json
{
    "success": true,
    "message": "Daftar kategori berhasil dimuat",
    "data": [
        {"id": 1, "nama": "Sampah", "icon_url": null},
        {"id": 2, "nama": "Jalan",  "icon_url": null},
        {"id": 3, "nama": "Lampu",  "icon_url": null},
        {"id": 4, "nama": "Banjir", "icon_url": null},
        {"id": 5, "nama": "Lainnya","icon_url": null}
    ]
}
```

---

### 2. Detail Kategori
```
Method : GET
URL    : /api/kategori/{id}
Auth   : Bearer Token
```

---

## 🔔 NOTIFIKASI ENDPOINTS

### 1. Lihat Semua Notifikasi
```
Method : GET
URL    : /api/notifikasi
Auth   : Bearer Token
```

**Response 200 (Berhasil):**
```json
{
    "success": true,
    "message": "Notifikasi berhasil dimuat",
    "data": {
        "notifikasi": [
            {
                "id": 1,
                "judul": "Status Laporan Diperbarui",
                "pesan": "Laporan kamu sedang diproses",
                "tipe": "status_changed",
                "is_read": false,
                "report_id": "uuid",
                "dibuat_pada": "19 Mar 2026 10:30"
            }
        ],
        "belum_dibaca": 2
    }
}
```

---

### 2. Detail Notifikasi
```
Method : GET
URL    : /api/notifikasi/{id}
Auth   : Bearer Token
```

---

### 3. Tandai Sudah Dibaca
```
Method : PUT
URL    : /api/notifikasi/{id}/read
Auth   : Bearer Token
```

---

### 4. Tandai Semua Sudah Dibaca
```
Method : PUT
URL    : /api/notifikasi/read-all
Auth   : Bearer Token
```

---

### 5. Hapus Notifikasi
```
Method : DELETE
URL    : /api/notifikasi/{id}
Auth   : Bearer Token
```

---

## 👤 PROFIL ENDPOINTS

### 1. Lihat Profil
```
Method : GET
URL    : /api/profil
Auth   : Bearer Token
```

**Response 200 (Berhasil):**
```json
{
    "success": true,
    "message": "Profil berhasil dimuat",
    "data": {
        "id": "uuid",
        "nama": "Nama User",
        "email": "email@gmail.com",
        "foto_url": null,
        "dark_mode": false,
        "notifications_enabled": true,
        "role": "user",
        "bergabung_sejak": "18 Mar 2026"
    }
}
```

---

### 2. Update Profil
```
Method       : PUT
URL          : /api/profil
Auth         : Bearer Token
Content-Type : application/json
```

**Request Body (JSON):**
```json
{
    "nama": "string (required, min:3, max:100)",
    "email": "string (required, email, unique)"
}
```

---

### 3. Update Foto Profil
```
Method       : POST
URL          : /api/profil/foto
Auth         : Bearer Token
Content-Type : multipart/form-data
```

**Request Body (form-data):**
```
foto : file (required, jpg/jpeg/png, max:3MB)
```

---

### 4. Ganti Password
```
Method       : PUT
URL          : /api/profil/password
Auth         : Bearer Token
Content-Type : application/json
```

**Request Body (JSON):**
```json
{
    "password_lama": "string (required)",
    "password_baru": "string (required, min:8)",
    "password_baru_confirmation": "string (required)"
}
```

---

### 5. Update Preferensi
```
Method       : PUT
URL          : /api/profil/preferensi
Auth         : Bearer Token
Content-Type : application/json
```

**Request Body (JSON):**
```json
{
    "dark_mode": "boolean",
    "notifications_enabled": "boolean"
}
```

---

## 📊 Referensi Data

### Status Laporan
| Status | Keterangan |
|--------|------------|
| tersubmit | Laporan baru dikirim |
| diproses | Sedang ditangani |
| selesai | Sudah selesai ditangani |
| ditolak | Laporan ditolak |

### Tipe Notifikasi
| Tipe | Keterangan |
|------|------------|
| status_changed | Status laporan berubah |
| report_created | Laporan berhasil dibuat |
| report_rejected | Laporan ditolak |

### HTTP Status Code
| Code | Keterangan |
|------|------------|
| 200 | OK - Request berhasil |
| 201 | Created - Data berhasil dibuat |
| 401 | Unauthenticated - Token salah/expired |
| 403 | Forbidden - Tidak punya akses |
| 404 | Not Found - Data tidak ditemukan |
| 422 | Unprocessable - Validasi gagal |
| 500 | Server Error - Error di server |


