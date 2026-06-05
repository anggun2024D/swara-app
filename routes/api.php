<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EconomicResourceController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\NotifikasiController;
use App\Http\Controllers\ProfilController;
use App\Http\Controllers\FCMTokenController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\BroadcastController;
use App\Http\Controllers\PublicStatsController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\CollaborationController;
use App\Http\Controllers\OpportunityController;
use App\Http\Controllers\EconomicInsightController;
use App\Http\Controllers\RecommendationController;

// ============================================================
// PUBLIC ROUTES
// ============================================================

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
    // Route::post('/google',   [AuthController::class, 'googleLogin']); // TODO: implement
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

// Peta ekonomi publik
Route::get('/publik/economic-map', [EconomicResourceController::class, 'economicMap']);
Route::get('/resources/map',       [EconomicResourceController::class, 'economicMap']); // alias untuk landing page

// Peluang publik (opportunity board)
Route::get('/publik/opportunities', [OpportunityController::class, 'index']);

// Statistik publik
Route::prefix('stats')->group(function () {
    Route::get('/', [PublicStatsController::class, 'index']);
});

// Heatmap publik
Route::get('/insights/heatmap', [EconomicInsightController::class, 'heatmap']);

// ============================================================
// BACKWARD COMPATIBILITY (temporary, to be removed)
// ============================================================
// Route::get('/publik/peta', [EconomicResourceController::class, 'economicMap']);

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
        // Route::delete('/delete-account', [AuthController::class, 'deleteAccount']); // TODO: implement
    });

    // --- ECONOMIC RESOURCES ---
    Route::prefix('resources')->group(function () {
        Route::get('/mine',    [EconomicResourceController::class, 'myResources']);
        Route::get('/',        [EconomicResourceController::class, 'index']);
        Route::post('/',       [EconomicResourceController::class, 'store']);
        Route::get('/{id}',    [EconomicResourceController::class, 'show']);
        Route::put('/{id}',    [EconomicResourceController::class, 'update']);
        Route::delete('/{id}', [EconomicResourceController::class, 'destroy']);

        // Community Verification
        Route::post('/{id}/verify',        [VerificationController::class, 'store']);
        Route::get('/{id}/verifications',  [VerificationController::class, 'index']);

        // AI Recommendations
        Route::get('/{id}/recommendations', [RecommendationController::class, 'index']);
    });

    // --- VERIFICATION (standalone) ---
    Route::delete('/verifications/{id}', [VerificationController::class, 'destroy']);

    // --- OPPORTUNITIES ---
    Route::prefix('opportunities')->group(function () {
        Route::get('/saved',          [OpportunityController::class, 'saved']);
        Route::get('/',               [OpportunityController::class, 'index']);
        Route::post('/{id}/save',     [OpportunityController::class, 'save']);
        Route::delete('/{id}/save',   [OpportunityController::class, 'unsave']);
    });

    // --- COLLABORATIONS ---
    Route::prefix('collaborations')->group(function () {
        Route::get('/',              [CollaborationController::class, 'index']);
        Route::post('/',             [CollaborationController::class, 'store']);
        Route::get('/{id}',          [CollaborationController::class, 'show']);
        Route::put('/{id}/respond',  [CollaborationController::class, 'respond']);
    });

    // --- ECONOMIC INSIGHTS ---
    Route::prefix('insights')->group(function () {
        Route::get('/dashboard',    [EconomicInsightController::class, 'dashboard']);
        Route::get('/top-regions',  [EconomicInsightController::class, 'topRegions']);
        Route::get('/growth',       [EconomicInsightController::class, 'growthChart']);
        Route::get('/categories',   [EconomicInsightController::class, 'categoryDistribution']);
    });

    // --- NOTIFIKASI ---
    Route::prefix('notifikasi')->group(function () {
        // Route::get('/unread-count', [NotifikasiController::class, 'unreadCount']); // TODO: implement
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
        Route::put('/investor',   [ProfilController::class, 'toggleInvestor']); // Aktifkan profil investor
        Route::get('/full',       [ProfilController::class, 'fullProfile']);     // Profil lengkap + statuses
    });

    // --- ADMIN (Moderator, bukan verifikator) ---
    Route::prefix('admin')->group(function () {
        Route::get('/users',                    [AdminController::class, 'users']);
        Route::get('/users/{id}',               [AdminController::class, 'showUser']);
        Route::get('/stats',                    [AdminController::class, 'globalStats']);
        Route::delete('/resources/{id}/remove',  [EconomicResourceController::class, 'adminRemove']);
        Route::post('/broadcast',               [BroadcastController::class, 'send']);
    });

    // --- FCM TOKEN (authenticated) ---
    Route::post('/fcm-token', [FCMTokenController::class, 'store']);
});