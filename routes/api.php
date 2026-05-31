<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\NotifikasiController;
use App\Http\Controllers\ProfilController;
use App\Http\Controllers\FCMTokenController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\BroadcastController;
use App\Http\Controllers\PublicStatsController;

// ============================================================
// PUBLIC ROUTES
// ============================================================

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
    Route::post('/google',   [AuthController::class, 'googleLogin']);
});

Route::prefix('fcm-token')->group(function () {
    Route::post('/',    [FCMTokenController::class, 'store']);
    Route::delete('/',  [FCMTokenController::class, 'destroy']);
});

// Kategori publik
Route::prefix('kategori')->group(function () {
    Route::get('/',     [KategoriController::class, 'index']);
    Route::get('/{id}', [KategoriController::class, 'show']);
    
});

Route::get('/publik/peta', [ReportController::class, 'petaPublik']);

// Statistik publik
Route::prefix('stats')->group(function () {
    Route::get('/', [PublicStatsController::class, 'index']);
});

// ============================================================
// PROTECTED ROUTES
// ============================================================

Route::middleware('auth:api')->group(function () {

    // --- AUTH ---
    Route::prefix('auth')->group(function () {
        Route::post('/logout',           [AuthController::class, 'logout']);
        Route::post('/refresh',          [AuthController::class, 'refresh']);
        Route::get('/me',                [AuthController::class, 'me']);
        Route::get('/profile',           [AuthController::class, 'me']);       // alias
        Route::delete('/delete-account', [AuthController::class, 'deleteAccount']);
    });

    // --- LAPORAN ---
    Route::prefix('laporan')->group(function () {
        Route::get('/riwayat', [ReportController::class, 'riwayat']);          // ← sebelum /{id}
        Route::get('/',        [ReportController::class, 'index']);
        Route::post('/',       [ReportController::class, 'store']);
        Route::get('/{id}',    [ReportController::class, 'show']);
        Route::put('/{id}',    [ReportController::class, 'update']);
        Route::delete('/{id}', [ReportController::class, 'destroy']);
        Route::put('/{id}/verifikasi', [ReportController::class, 'verifikasi']);
    });

    // --- NOTIFIKASI ---
    Route::prefix('notifikasi')->group(function () {
        Route::get('/unread-count', [NotifikasiController::class, 'unreadCount']);
        Route::put('/read-all',     [NotifikasiController::class, 'markAllAsRead']);
        Route::get('/',             [NotifikasiController::class, 'index']);
        Route::get('/{id}',         [NotifikasiController::class, 'show']);
        Route::put('/{id}/read',    [NotifikasiController::class, 'markAsRead']);
        Route::delete('/{id}',      [NotifikasiController::class, 'destroy']);
    });

    // --- PROFIL ---
    Route::prefix('profil')->group(function () {
        Route::get('/',           [ProfilController::class, 'index']);
        Route::put('/',           [ProfilController::class, 'update']);
        Route::post('/foto',      [ProfilController::class, 'updateFoto']);
        Route::put('/password',   [ProfilController::class, 'updatePassword']);
        Route::put('/preferensi', [ProfilController::class, 'updatePreferensi']);
    });

    // --- ADMIN ---
    Route::prefix('admin')->group(function () {
        Route::get('/users', [AdminController::class, 'users']);
        Route::get('/users/{id}', [AdminController::class, 'showUser']);
        Route::post('/broadcast', [BroadcastController::class, 'send']);               // ← baru
    });

    // --- FCM TOKEN (authenticated) ---
    Route::post('/fcm-token', [FCMTokenController::class, 'update']);
});