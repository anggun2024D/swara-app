<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\NotifikasiController;
use App\Http\Controllers\ProfilController;  // ← tambahkan

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

    // --- NOTIFIKASI ---
    Route::prefix('notifikasi')->group(function () {
        Route::get('/',
            [NotifikasiController::class, 'index']);
        Route::put('/read-all',
            [NotifikasiController::class, 'markAllAsRead']);
        Route::get('/{id}',
            [NotifikasiController::class, 'show']);
        Route::put('/{id}/read',
            [NotifikasiController::class, 'markAsRead']);
        Route::delete('/{id}',
            [NotifikasiController::class, 'destroy']);
    });

    // --- PROFIL ---          ← tambahkan ini
    Route::prefix('profil')->group(function () {

        // GET  /api/profil
        Route::get('/',
            [ProfilController::class, 'index']);

        // PUT  /api/profil
        Route::put('/',
            [ProfilController::class, 'update']);

        // POST /api/profil/foto
        Route::post('/foto',
            [ProfilController::class, 'updateFoto']);

        // PUT  /api/profil/password
        Route::put('/password',
            [ProfilController::class, 'updatePassword']);

        // PUT  /api/profil/preferensi
        Route::put('/preferensi',
            [ProfilController::class, 'updatePreferensi']);

    });

});
