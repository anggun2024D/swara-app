<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ReportController;

// ===========================
// ROUTES TANPA LOGIN
// (Public Routes)
// ===========================
Route::prefix('auth')->group(function () {

    // POST /api/auth/register
    Route::post('/register', [AuthController::class, 'register']);

    // POST /api/auth/login
    Route::post('/login', [AuthController::class, 'login']);

});

// ===========================
// ROUTES YANG BUTUH LOGIN
// (Protected Routes)
// ===========================
Route::middleware('auth:api')->group(function () {

    // --- AUTH ---
    // POST   /api/auth/logout
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // GET    /api/auth/profile
    Route::get('/auth/profile', [AuthController::class, 'profile']);

    // DELETE /api/auth/delete-account
    Route::delete('/auth/delete-account', [AuthController::class, 'deleteAccount']);

    // --- LAPORAN ---
    Route::prefix('laporan')->group(function () {

        // GET  /api/laporan
        Route::get('/', [ReportController::class, 'index']);

        // POST /api/laporan
        Route::post('/', [ReportController::class, 'store']);

        // GET  /api/laporan/riwayat
        Route::get('/riwayat', [ReportController::class, 'riwayat']);

        // GET  /api/laporan/{id}
        Route::get('/{id}', [ReportController::class, 'show']);

    }); // ← tutup prefix laporan

});
