<?php

namespace App\Http\Controllers;

use App\Models\ResourceVerification;
use App\Models\EconomicResource;
use App\Services\VerificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VerificationController extends Controller
{
    public function __construct(
        private VerificationService $verificationService
    ) {}

    private function response($success, $message, $data = null, $code = 200)
    {
        return response()->json(['success' => $success, 'message' => $message, 'data' => $data], $code);
    }

    // ================================================================
    // POST /api/resources/{id}/verify
    // ================================================================
    public function store(Request $request, string $resourceId)
    {
        $resource = EconomicResource::find($resourceId);
        if (!$resource || $resource->status !== 'active') {
            return $this->response(false, 'Potensi tidak ditemukan atau belum aktif', null, 404);
        }

        // Pemilik tidak bisa verifikasi miliknya sendiri
        if ($resource->user_id === Auth::id()) {
            return $this->response(false, 'Anda tidak dapat memverifikasi potensi milik sendiri', null, 422);
        }

        $request->validate([
            'type'   => 'required|in:support,verify,rate,review',
            'rating' => 'required_if:type,rate|nullable|integer|min:1|max:5',
            'review' => 'required_if:type,review|nullable|string|min:10|max:1000',
        ]);

        // Cek duplikasi (kecuali review bisa berkali-kali)
        if ($request->type !== 'review') {
            if ($this->verificationService->hasVerified(Auth::id(), $resourceId, $request->type)) {
                return $this->response(false, 'Anda sudah melakukan ' . $request->type . ' pada potensi ini', null, 422);
            }
        }

        $verification = ResourceVerification::create([
            'resource_id' => $resourceId,
            'user_id'     => Auth::id(),
            'type'        => $request->type,
            'rating'      => $request->type === 'rate' ? $request->rating : null,
            'review'      => in_array($request->type, ['review', 'verify']) ? $request->review : null,
        ]);

        // Hitung ulang verification_score + level
        $newScore = $this->verificationService->recalculateScore($resourceId);

        // Increment jumlah verifikasi yang diberikan user (untuk badge Community Contributor)
        $this->verificationService->incrementUserVerificationCount(Auth::id());

        $updatedResource = EconomicResource::find($resourceId);

        return $this->response(true, 'Verifikasi berhasil disimpan', [
            'verification'     => [
                'id'         => $verification->id,
                'type'       => $verification->type,
                'rating'     => $verification->rating,
                'review'     => $verification->review,
                'created_at' => $verification->created_at?->toISOString(),
            ],
            'new_score'          => $newScore,
            'community_verified' => $newScore >= 30,
            'verification_level' => $updatedResource->verification_level ?? 1,
            'verification_label' => VerificationService::getLevelInfo($updatedResource->verification_level ?? 1)['label'],
        ], 201);
    }

    // ================================================================
    // GET /api/resources/{id}/verifications
    // ================================================================
    public function index(string $resourceId)
    {
        $resource = EconomicResource::find($resourceId);
        if (!$resource) {
            return $this->response(false, 'Potensi tidak ditemukan', null, 404);
        }

        $verifications = ResourceVerification::with('user')
            ->where('resource_id', $resourceId)
            ->latest()
            ->paginate(10);

        return $this->response(true, 'Daftar verifikasi berhasil dimuat', [
            'verifications' => $verifications->map(fn($v) => [
                'id'         => $v->id,
                'type'       => $v->type,
                'rating'     => $v->rating,
                'review'     => $v->review,
                'user'       => [
                    'id'   => $v->user?->id,
                    'nama' => $v->user?->nama,
                    'foto' => $v->user?->foto,
                ],
                'created_at' => $v->created_at?->toISOString(),
            ])->values(),
            'summary' => [
                'total_support'  => ResourceVerification::where('resource_id', $resourceId)->where('type', 'support')->count(),
                'total_verify'   => ResourceVerification::where('resource_id', $resourceId)->where('type', 'verify')->count(),
                'total_reviews'  => ResourceVerification::where('resource_id', $resourceId)->where('type', 'review')->count(),
                'avg_rating'     => round(ResourceVerification::where('resource_id', $resourceId)->where('type', 'rate')->avg('rating') ?? 0, 1),
                'verification_score' => $resource->verification_score,
                'community_verified' => (bool) $resource->community_verified,
            ],
        ]);
    }

    // ================================================================
    // DELETE /api/verifications/{id}
    // ================================================================
    public function destroy(string $id)
    {
        $verification = ResourceVerification::find($id);

        if (!$verification) {
            return $this->response(false, 'Verifikasi tidak ditemukan', null, 404);
        }

        if ($verification->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            return $this->response(false, 'Tidak diizinkan', null, 403);
        }

        $resourceId = $verification->resource_id;
        $verification->delete();

        // Hitung ulang score
        $this->verificationService->recalculateScore($resourceId);

        return $this->response(true, 'Verifikasi berhasil dihapus');
    }
}
