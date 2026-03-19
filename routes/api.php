<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\NotifikasiController;  // ← tambahkan

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

Route::middleware('auth:api')->group(function () {

    // --- AUTH ---
    Route::post('/auth/logout',
        [AuthController::class, 'logout']);
    Route::get('/auth/profile',
        [AuthController::class, 'profile']);
    Route::delete('/auth/delete-account',
        [AuthController::class, 'deleteAccount']);

    // --- LAPORAN ---
    Route::prefix('laporan')->group(function () {
        Route::get('/',        [ReportController::class, 'index']);
        Route::post('/',       [ReportController::class, 'store']);
        Route::get('/riwayat', [ReportController::class, 'riwayat']);
        Route::get('/{id}',    [ReportController::class, 'show']);
    });

    // --- KATEGORI ---
    Route::prefix('kategori')->group(function () {
        Route::get('/',     [KategoriController::class, 'index']);
        Route::get('/{id}', [KategoriController::class, 'show']);
    });

    // --- NOTIFIKASI ---          ← tambahkan ini
    Route::prefix('notifikasi')->group(function () {

        // GET    /api/notifikasi
        Route::get('/',
            [NotifikasiController::class, 'index']);

        // PUT    /api/notifikasi/read-all
        // ⚠️ Harus di atas /{id} agar tidak bentrok!
        Route::put('/read-all',
            [NotifikasiController::class, 'markAllAsRead']);

        // GET    /api/notifikasi/{id}
        Route::get('/{id}',
            [NotifikasiController::class, 'show']);

        // PUT    /api/notifikasi/{id}/read
        Route::put('/{id}/read',
            [NotifikasiController::class, 'markAsRead']);

        // DELETE /api/notifikasi/{id}
        Route::delete('/{id}',
            [NotifikasiController::class, 'destroy']);

    });

}); // ← tutup middleware auth:api
