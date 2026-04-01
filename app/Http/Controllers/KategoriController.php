<?php

namespace App\Http\Controllers;

use App\Models\ReportCategory;
use Illuminate\Http\Request;

class KategoriController extends Controller
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
    // 1. LIHAT SEMUA KATEGORI
    // GET /api/kategori
    // ================================
    public function index()
    {
        // Ambil semua kategori yang aktif saja
        $kategori = ReportCategory::where('is_active', true)
                                  ->get();

        // Kalau tidak ada kategori sama sekali
        if ($kategori->isEmpty()) {
            return $this->response(
                false,
                'Belum ada kategori tersedia',
                null,
                404
            );
        }

        return $this->response(
            true,
            'Daftar kategori berhasil dimuat',
            $kategori->map(function ($item) {
                return [
                    'id'       => $item->id,
                    'nama'     => $item->name,
                    'icon_url' => $item->icon_url,
                ];
            })
        );
    }

    // ================================
    // 2. DETAIL KATEGORI
    // GET /api/kategori/{id}
    // ================================
    public function show(string $id)
    {
        $kategori = ReportCategory::where('id', $id)
                                  ->where('is_active', true)
                                  ->first();

        // Kalau kategori tidak ditemukan
        if (!$kategori) {
            return $this->response(
                false,
                'Kategori tidak ditemukan',
                null,
                404
            );
        }

        return $this->response(
            true,
            'Detail kategori berhasil dimuat',
            [
                'id'            => $kategori->id,
                'nama'          => $kategori->name,
                'icon_url'      => $kategori->icon_url,
                'jumlah_laporan'=> $kategori->reports()->count(),
            ]
        );
    }
}
