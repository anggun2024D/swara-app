<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\KategoriController;  // ← tambahkan ini

// ===========================
// ROUTES TANPA LOGIN
// (Public Routes)
// ===========================
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

// ===========================
// ROUTES YANG BUTUH LOGIN
// (Protected Routes)
// ===========================
Route::middleware('auth:api')->group(function () {

    // --- AUTH ---
    Route::post('/auth/logout',         [AuthController::class, 'logout']);
    Route::get('/auth/profile',         [AuthController::class, 'profile']);
    Route::delete('/auth/delete-account',[AuthController::class, 'deleteAccount']);

    // --- LAPORAN ---
    Route::prefix('laporan')->group(function () {
        Route::get('/',        [ReportController::class, 'index']);
        Route::post('/',       [ReportController::class, 'store']);
        Route::get('/riwayat', [ReportController::class, 'riwayat']);
        Route::get('/{id}',    [ReportController::class, 'show']);
    });

    // --- KATEGORI ---          ← tambahkan ini
    Route::prefix('kategori')->group(function () {
        Route::get('/',      [KategoriController::class, 'index']);
        Route::get('/{id}',  [KategoriController::class, 'show']);
    });

});
