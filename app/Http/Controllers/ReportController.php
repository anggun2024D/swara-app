<?php

namespace App\Http\Controllers;

use App\Services\FCMService;
use App\Models\User;
use App\Http\Requests\StoreReportRequest;
use App\Http\Resources\ReportResource;
use App\Models\Report;
use App\Models\ReportImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Cloudinary\Cloudinary;
use Cloudinary\Configuration\Configuration;

class ReportController extends Controller
{
    // Format response standar
    private function response(
        $success,
        $message,
        $data = null,
        $code = 200
    ) {
        return response()->json([
            'success' => $success,
            'message' => $message,
            'data'    => $data,
        ], $code);
    }

    // ================================
    // 1. BUAT LAPORAN BARU
    // POST /api/laporan
    // ================================
    public function store(StoreReportRequest $request)
{
    DB::beginTransaction();
    try {
        $report = Report::create([
            'user_id'     => Auth::id(),
            'category_id' => $request->category_id,
            'judul'       => $request->judul,
            'deskripsi'   => $request->deskripsi,
            'latitude'    => $request->latitude,
            'longitude'   => $request->longitude,
            'address'     => $request->address,
            'priority'    => $request->priority,
            'status'      => 'tersubmit',
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $cloudinary = new Cloudinary(
                    Configuration::instance([
                        'cloud' => [
                            'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                            'api_key'    => env('CLOUDINARY_API_KEY'),
                            'api_secret' => env('CLOUDINARY_API_SECRET'),
                        ],
                        'url' => ['secure' => true],
                    ])
                );
                $result = $cloudinary->uploadApi()->upload(
                    $image->getRealPath(),
                    ['folder' => 'swara/reports']
                );
                ReportImage::create([
                    'report_id' => $report->id,
                    'image_url' => $result['secure_url'],
                ]);
            }
        }

        DB::commit();
        $report->load(['user', 'category', 'images']);

        // ── NOTIFIKASI ──────────────────────────────────────
        try {
            $fcm = new FCMService();

            $pembuat = Auth::user();
            if ($pembuat->fcm_token) {
                $fcm->sendToToken(
                    token: $pembuat->fcm_token,
                    title: '✅ Laporan Berhasil Dikirim',
                    body:  "Laporan \"{$report->judul}\" kamu sudah kami terima.",
                    data:  ['type' => 'laporan_dibuat', 'report_id' => (string) $report->id]
                );
            }

            $tokens = User::where('id', '!=', Auth::id())
                ->whereNotNull('fcm_token')
                ->pluck('fcm_token')
                ->toArray();

            if (!empty($tokens)) {
                $fcm->sendToMultiple(
                    tokens: $tokens,
                    title:  '📢 Laporan Baru',
                    body:   "{$pembuat->nama} membuat laporan: \"{$report->judul}\"",
                    data:   ['type' => 'laporan_baru', 'report_id' => (string) $report->id]
                );
            }
        } catch (\Exception $fcmError) {
            // FCM gagal tidak boleh cancel laporan yang sudah tersimpan
            \Log::warning('FCM notification failed: ' . $fcmError->getMessage());
        }
        // ────────────────────────────────────────────────────

        return $this->response(
            true,
            'Laporan berhasil dikirim',
            new ReportResource($report),
            201
        );

    } catch (\Exception $e) {
        DB::rollBack();
        return $this->response(
            false,
            'Laporan gagal dikirim: ' . $e->getMessage(),
            null,
            500
        );
    }
}

    // ================================
    // 2. LIHAT DAFTAR LAPORAN
    // GET /api/laporan
    // ================================
    public function index(Request $request)
    {
        $query = Report::with(['user', 'category', 'images'])
                       ->latest();

        // Filter kategori
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Pencarian
        if ($request->has('search')) {
            $keyword = $request->search;
            $query->where(function ($q) use ($keyword) {
                $q->where('judul', 'like', "%{$keyword}%")
                  ->orWhere('deskripsi', 'like', "%{$keyword}%")
                  ->orWhere('address', 'like', "%{$keyword}%");
            });
        }

        // Filter daerah
        if ($request->has('daerah')) {
            $query->where(
                'address',
                'like',
                "%{$request->daerah}%"
            );
        }

        $perHalaman = $request->input('per_halaman');
        $reports = $perHalaman === 'all'
            ? $query->get()          // return Collection, bukan Paginator
            : $query->paginate((int) $perHalaman ?: 10);

        if ($perHalaman === 'all') {
        return $this->response(
                true,
                'Daftar laporan berhasil dimuat',
                [
                    'laporan'    => ReportResource::collection($reports),
                    'pagination' => [
                        'total'         => $reports->count(),
                        'per_halaman'   => $reports->count(),
                        'halaman_ini'   => 1,
                        'total_halaman' => 1,
                    ]
                ]
            );
        }

        return $this->response(
            true,
            'Daftar laporan berhasil dimuat',
            [
                'laporan'    => ReportResource::collection($reports),
                'pagination' => [
                    'total'         => $reports->total(),
                    'per_halaman'   => $reports->perPage(),
                    'halaman_ini'   => $reports->currentPage(),
                    'total_halaman' => $reports->lastPage(),
                ]
            ]
        );
    }

    // ================================
    // 3. LIHAT DETAIL LAPORAN
    // GET /api/laporan/{id}
    // ================================
    public function show(string $id)
    {
        $report = Report::with([
                        'user',
                        'category',
                        'images',
                        'statusLogs'
                    ])->find($id);

        if (!$report) {
            return $this->response(
                false,
                'Laporan tidak ditemukan',
                null,
                404
            );
        }

        $report->increment('view_count');

        return $this->response(
            true,
            'Detail laporan berhasil dimuat',
            new ReportResource($report)
        );
    }

    // ================================
    // 4. RIWAYAT LAPORAN MILIK USER
    // GET /api/laporan/riwayat
    // ================================
    public function riwayat(Request $request)
    {
        $query = Report::with(['category', 'images'])
                        ->withTrashed()
                       ->where('user_id', Auth::id())
                       ->latest();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $keyword = $request->search;
            $query->where(function ($q) use ($keyword) {
                $q->where('judul', 'like', "%{$keyword}%")
                  ->orWhere('deskripsi', 'like', "%{$keyword}%");
            });
        }

        $reports = $query->paginate(10);

        return $this->response(
            true,
            'Riwayat laporan berhasil dimuat',
            [
                'laporan'    => ReportResource::collection($reports),
                'pagination' => [
                    'total'         => $reports->total(),
                    'per_halaman'   => $reports->perPage(),
                    'halaman_ini'   => $reports->currentPage(),
                    'total_halaman' => $reports->lastPage(),
                ]
            ]
        );
    }

    // ================================
// 5. EDIT LAPORAN
// POST /api/laporan/{id}?_method=PUT
// ================================
public function update(Request $request, string $id)
{
    DB::beginTransaction();
    try {
        $report = Report::with(['user', 'category', 'images'])
                        ->find($id);

        if (!$report) {
            return $this->response(false, 'Laporan tidak ditemukan', null, 404);
        }

        // Hanya pelapor sendiri yang boleh edit
        if ($report->user_id !== Auth::id()) {
            return $this->response(false, 'Tidak diizinkan mengedit laporan ini', null, 403);
        }

        // Hanya laporan dengan status 'tersubmit' yang boleh diedit
        if ($report->status !== 'tersubmit') {
            return $this->response(false, 'Laporan yang sudah diproses tidak dapat diedit', null, 422);
        }

        // Update field utama
        $report->update([
            'category_id' => $request->category_id ?? $report->category_id,
            'judul'       => $request->judul       ?? $report->judul,
            'deskripsi'   => $request->deskripsi   ?? $report->deskripsi,
            'latitude'    => $request->latitude     ?? $report->latitude,
            'longitude'   => $request->longitude    ?? $report->longitude,
            'address'     => $request->address      ?? $report->address,
        ]);

        // ── Kelola foto lama ──────────────────────────────
        // existing_photos[] berisi URL foto yang DIPERTAHANKAN user
        $existingUrls = $request->input('existing_photos', []);

        // Ambil semua foto laporan ini dari DB
        $allImages = ReportImage::where('report_id', $report->id)->get();

        foreach ($allImages as $image) {
            // Buat full URL untuk dibandingkan dengan yang dikirim Flutter
            $fullUrl = asset('storage/' . $image->image_url);

            // Jika URL foto ini tidak ada di existing_photos → hapus
            if (!in_array($fullUrl, $existingUrls) && !in_array($image->image_url, $existingUrls)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($image->image_url);
                $image->delete();
            }
        }

        // ── Tambah foto baru ──────────────────────────────
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                // Simpan foto baru
                $cloudinary = new Cloudinary(
                    Configuration::instance([
                        'cloud' => [
                            'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                            'api_key'    => env('CLOUDINARY_API_KEY'),
                            'api_secret' => env('CLOUDINARY_API_SECRET'),
                        ],
                        'url' => ['secure' => true],
                    ])
                );
                $result = $cloudinary->uploadApi()->upload(
                    $image->getRealPath(),
                    ['folder' => 'swara/reports']
                );
                ReportImage::create([
                    'report_id' => $report->id,
                    'image_url' => $result['secure_url'],
                ]);
            }
        }

        DB::commit();
        $report->load(['user', 'category', 'images']);

        return $this->response(
            true,
            'Laporan berhasil diperbarui',
            new ReportResource($report)
        );

    } catch (\Exception $e) {
        DB::rollBack();
        return $this->response(false, 'Laporan gagal diperbarui: ' . $e->getMessage(), null, 500);
    }
}

    // ================================
    // 6. HAPUS LAPORAN
    // DELETE /api/laporan/{id}
    // ================================
    public function destroy(string $id)
{
    DB::beginTransaction();
    try {
        $report = Report::find($id); // tanpa withTrashed

        if (!$report) {
            return $this->response(false, 'Laporan tidak ditemukan', null, 404);
        }

        if ($report->user_id !== Auth::id()) {
            return $this->response(false, 'Tidak diizinkan menghapus laporan ini', null, 403);
        }

        // 1. Ubah status ke 'ditolak' sebelum soft delete
        $report->update(['status' => 'ditolak']);

        // 2. Soft delete (isi deleted_at)
        $report->delete();

        DB::commit();
        return $this->response(true, 'Laporan berhasil dibatalkan');

    } catch (\Exception $e) {
        DB::rollBack();
        return $this->response(false, 'Gagal membatalkan: ' . $e->getMessage(), null, 500);
    }
}

    // ================================
    // 7. VERIFIKASI LAPORAN (ADMIN)
    // PUT /api/laporan/{id}/verifikasi
    // ================================
    public function verifikasi(Request $request, string $id)
    {
        $report = Report::find($id);

        if (!$report) {
            return $this->response(false, 'Laporan tidak ditemukan', null, 404);
        }

        $request->validate([
            'status'       => 'required|in:diverifikasi,diproses,selesai,ditolak',
            'admin_notes'  => 'nullable|string|max:500',
        ]);

        $report->update([
            'status'      => $request->status,
            'admin_notes' => $request->admin_notes,
        ]);

        $report->load(['user', 'category', 'images']);

        return $this->response(
            true,
            'Status laporan berhasil diperbarui',
            new ReportResource($report)
        );
    }

    /**
     * Data peta untuk landing page — publik, tanpa auth
     * Hanya return field minimal yang dibutuhkan peta
     */
    public function petaPublik()
    {
        $laporan = Report::with(['category'])
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->whereIn('status', ['tersubmit', 'diverifikasi', 'diproses', 'selesai'])
            ->select([
                'id', 'judul', 'status', 'is_urgent',
                'latitude', 'longitude', 'address',
                'category_id'
            ])
            ->latest()
            ->get();

        $data = $laporan->map(fn($r) => [
            'id'        => $r->id,
            'judul'     => $r->judul,
            'status'    => $r->status,
            'is_urgent' => (bool) $r->is_urgent,
            'lokasi'    => [
                'latitude'  => $r->latitude,
                'longitude' => $r->longitude,
                'address'   => $r->address,
            ],
            'category' => [
                'id'   => $r->category?->id,
                'nama' => $r->category?->name,
            ],
        ]);

        return response()->json([
            'success' => true,
            'data'    => $data,
        ]);
    }

}
