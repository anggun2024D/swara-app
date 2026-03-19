<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotifikasiController extends Controller
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
    // 1. LIHAT SEMUA NOTIFIKASI
    // GET /api/notifikasi
    // ================================
    public function index()
    {
        $notifikasi = Notification::where('user_id', Auth::id())
                                  ->latest('created_at')
                                  ->get();

        // Hitung jumlah yang belum dibaca
        $belumDibaca = $notifikasi->where('is_read', false)->count();

        // Kalau tidak ada notifikasi
        if ($notifikasi->isEmpty()) {
            return $this->response(
                true,
                'Belum ada notifikasi',
                [
                    'notifikasi'   => [],
                    'belum_dibaca' => 0,
                ]
            );
        }

        return $this->response(
            true,
            'Notifikasi berhasil dimuat',
            [
                'notifikasi' => $notifikasi->map(function ($item) {
                    return [
                        'id'         => $item->id,
                        'judul'      => $item->title,
                        'pesan'      => $item->message,
                        'tipe'       => $item->type,
                        'is_read'    => $item->is_read,
                        'report_id'  => $item->report_id,
                        'dibuat_pada'=> $item->created_at
                                            ->format('d M Y H:i'),
                    ];
                }),
                'belum_dibaca' => $belumDibaca,
            ]
        );
    }

    // ================================
    // 2. DETAIL NOTIFIKASI
    // GET /api/notifikasi/{id}
    // ================================
    public function show(string $id)
    {
        $notifikasi = Notification::where('id', $id)
                                  ->where('user_id', Auth::id())
                                  ->first();

        // Kalau tidak ditemukan
        if (!$notifikasi) {
            return $this->response(
                false,
                'Notifikasi tidak ditemukan',
                null,
                404
            );
        }

        return $this->response(
            true,
            'Detail notifikasi berhasil dimuat',
            [
                'id'         => $notifikasi->id,
                'judul'      => $notifikasi->title,
                'pesan'      => $notifikasi->message,
                'tipe'       => $notifikasi->type,
                'is_read'    => $notifikasi->is_read,
                'report_id'  => $notifikasi->report_id,
                'dibuat_pada'=> $notifikasi->created_at
                                           ->format('d M Y H:i'),
            ]
        );
    }

    // ================================
    // 3. TANDAI SUDAH DIBACA
    // PUT /api/notifikasi/{id}/read
    // ================================
    public function markAsRead(string $id)
    {
        $notifikasi = Notification::where('id', $id)
                                  ->where('user_id', Auth::id())
                                  ->first();

        // Kalau tidak ditemukan
        if (!$notifikasi) {
            return $this->response(
                false,
                'Notifikasi tidak ditemukan',
                null,
                404
            );
        }

        // Kalau sudah dibaca sebelumnya
        if ($notifikasi->is_read) {
            return $this->response(
                true,
                'Notifikasi sudah dibaca sebelumnya',
                ['is_read' => true]
            );
        }

        // Tandai sudah dibaca
        $notifikasi->update(['is_read' => true]);

        return $this->response(
            true,
            'Notifikasi berhasil ditandai sudah dibaca',
            ['is_read' => true]
        );
    }

    // ================================
    // 4. TANDAI SEMUA SUDAH DIBACA
    // PUT /api/notifikasi/read-all
    // ================================
    public function markAllAsRead()
    {
        $jumlah = Notification::where('user_id', Auth::id())
                              ->where('is_read', false)
                              ->update(['is_read' => true]);

        return $this->response(
            true,
            "{$jumlah} notifikasi berhasil ditandai sudah dibaca",
            ['jumlah_diupdate' => $jumlah]
        );
    }

    // ================================
    // 5. HAPUS NOTIFIKASI
    // DELETE /api/notifikasi/{id}
    // ================================
    public function destroy(string $id)
    {
        $notifikasi = Notification::where('id', $id)
                                  ->where('user_id', Auth::id())
                                  ->first();

        // Kalau tidak ditemukan
        if (!$notifikasi) {
            return $this->response(
                false,
                'Notifikasi tidak ditemukan',
                null,
                404
            );
        }

        $notifikasi->delete();

        return $this->response(
            true,
            'Notifikasi berhasil dihapus'
        );
    }
}
