<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\NotifikasiController;
use App\Http\Controllers\ProfilController;

// ============================================================
// PUBLIC ROUTES — Tidak perlu token
// ============================================================

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
    Route::post('/google', [AuthController::class, 'googleLogin']);
});

// Kategori publik — dibutuhkan di Home Screen sebelum login
Route::prefix('kategori')->group(function () {
    Route::get('/',     [KategoriController::class, 'index']);
    Route::get('/{id}', [KategoriController::class, 'show']);
});

// ============================================================
// PROTECTED ROUTES — Wajib JWT token
// ============================================================

Route::middleware('auth:api')->group(function () {
    
    Route::post('/fcm-token', [App\Http\Controllers\FCMTokenController::class, 'update']);

    // --- AUTH ---
    Route::prefix('auth')->group(function () {
        Route::post('/logout',         [AuthController::class, 'logout']);
        Route::get('/profile',         [AuthController::class, 'profile']);
        Route::delete('/delete-account', [AuthController::class, 'deleteAccount']);
    });

    // --- LAPORAN ---
    Route::prefix('laporan')->group(function () {
        Route::get('/',        [ReportController::class, 'index']);
        Route::post('/',       [ReportController::class, 'store']);
        Route::get('/riwayat', [ReportController::class, 'riwayat']);
        Route::get('/{id}',    [ReportController::class, 'show']);
        Route::post('/{id}',   [ReportController::class, 'update']);
        Route::put('/{id}',    [ReportController::class, 'update']);
        Route::delete('/{id}', [ReportController::class, 'destroy']);
    });

    // --- NOTIFIKASI ---
    Route::prefix('notifikasi')->group(function () {
        Route::get('/',              [NotifikasiController::class, 'index']);
        Route::put('/read-all',      [NotifikasiController::class, 'markAllAsRead']); // ← sebelum /{id}
        Route::get('/{id}',          [NotifikasiController::class, 'show']);
        Route::put('/{id}/read',     [NotifikasiController::class, 'markAsRead']);
        Route::delete('/{id}',       [NotifikasiController::class, 'destroy']);
    });

    // --- PROFIL ---
    Route::prefix('profil')->group(function () {
        Route::get('/',              [ProfilController::class, 'index']);
        Route::put('/',              [ProfilController::class, 'update']);
        Route::post('/foto',         [ProfilController::class, 'updateFoto']);
        Route::put('/password',      [ProfilController::class, 'updatePassword']);
        Route::put('/preferensi',    [ProfilController::class, 'updatePreferensi']);
    });
});
