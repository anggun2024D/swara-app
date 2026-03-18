<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReportRequest;
use App\Http\Resources\ReportResource;
use App\Models\Report;
use App\Models\ReportImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
                'status'      => 'tersubmit',
            ]);

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('reports', 'public');
                    ReportImage::create([
                        'report_id' => $report->id,
                        'image_url' => $path,
                    ]);
                }
            }

            DB::commit();
            $report->load(['user', 'category', 'images']);

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
                'Laporan gagal dikirim',
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

        $reports = $query->paginate(10);

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
}
