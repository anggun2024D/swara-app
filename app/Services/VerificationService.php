<?php

namespace App\Services;

use App\Models\EconomicResource;
use App\Models\ResourceVerification;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class VerificationService
{
    /**
     * VERIFICATION LEVELS:
     * ═══════════════════
     * Level 1 — Terdaftar (default saat usaha dibuat)
     * Level 2 — Terverifikasi Komunitas (3+ verifikasi, foto & koordinat valid)
     * Level 3 — Terverifikasi Mitra (diverifikasi organisasi resmi)
     * Level 4 — Terverifikasi Resmi (pemerintah/KADIN/BUMN — masa depan)
     */

    const LEVEL_TERDAFTAR   = 1;
    const LEVEL_KOMUNITAS   = 2;
    const LEVEL_MITRA       = 3;
    const LEVEL_RESMI       = 4;

    const LEVEL_LABELS = [
        1 => ['label' => 'Terdaftar',              'icon' => '📋', 'color' => '#6B7280'],
        2 => ['label' => 'Terverifikasi Komunitas', 'icon' => '✅', 'color' => '#10B981'],
        3 => ['label' => 'Terverifikasi Mitra',     'icon' => '🏛️', 'color' => '#3B82F6'],
        4 => ['label' => 'Terverifikasi Resmi',     'icon' => '🏆', 'color' => '#F59E0B'],
    ];

    /**
     * Formula skor:
     * verify  = +3 poin
     * support = +1 poin
     * rating  = avg_rating * 10 (maks 50)
     * Normalized ke 0–100
     */
    public function recalculateScore(string $resourceId): int
    {
        $verifications = ResourceVerification::where('resource_id', $resourceId)->get();

        $verifyCount  = $verifications->where('type', 'verify')->count();
        $supportCount = $verifications->where('type', 'support')->count();
        $ratings      = $verifications->where('type', 'rate')->whereNotNull('rating');
        $avgRating    = $ratings->count() > 0 ? $ratings->avg('rating') : 0;

        $rawScore = ($verifyCount * 3) + ($supportCount * 1) + ($avgRating * 10);
        $score    = (int) min(100, round($rawScore));

        $resource = EconomicResource::find($resourceId);
        if ($resource) {
            $communityVerified = $score >= 30;
            $level = $this->calculateLevel($resource, $verifyCount);

            $resource->update([
                'verification_score'  => $score,
                'community_verified'  => $communityVerified,
                'verification_level'  => $level,
            ]);
        }

        return $score;
    }

    /**
     * Hitung verification level berdasarkan kriteria
     */
    public function calculateLevel(EconomicResource $resource, ?int $verifyCount = null): int
    {
        if ($verifyCount === null) {
            $verifyCount = ResourceVerification::where('resource_id', $resource->id)
                ->where('type', 'verify')
                ->count();
        }

        // Level 2: Terverifikasi Komunitas
        // Syarat: 3+ verifikasi user, foto valid, koordinat valid
        $hasValidPhotos   = $resource->images()->count() > 0;
        $hasValidLocation = $resource->latitude !== null && $resource->longitude !== null;

        if ($verifyCount >= 3 && $hasValidPhotos && $hasValidLocation) {
            // Cek apakah ada verifikasi dari mitra (organisasi resmi)
            $mitraVerifications = ResourceVerification::where('resource_id', $resource->id)
                ->where('type', 'verify')
                ->whereHas('user', function ($q) {
                    $q->whereNotNull('organization');
                })
                ->count();

            // Level 3: Terverifikasi Mitra (minimal 1 verifikasi dari user berorganisasi)
            if ($mitraVerifications >= 1) {
                return self::LEVEL_MITRA;
            }

            return self::LEVEL_KOMUNITAS;
        }

        return self::LEVEL_TERDAFTAR;
    }

    /**
     * Cek apakah user sudah melakukan verifikasi dengan type tertentu
     */
    public function hasVerified(string $userId, string $resourceId, string $type): bool
    {
        return ResourceVerification::where('user_id', $userId)
            ->where('resource_id', $resourceId)
            ->where('type', $type)
            ->exists();
    }

    /**
     * Update total_verifications_given pada user setelah memberi verifikasi
     */
    public function incrementUserVerificationCount(string $userId): void
    {
        $user = User::find($userId);
        if ($user) {
            $user->increment('total_verifications_given');
        }
    }

    /**
     * Ambil info level untuk response
     */
    public static function getLevelInfo(int $level): array
    {
        return self::LEVEL_LABELS[$level] ?? self::LEVEL_LABELS[1];
    }
}
