<?php

namespace App\Http\Controllers;

use App\Models\EconomicResource;
use App\Models\ResourceImage;
use App\Services\EconomicResourceService;
use App\Services\VerificationService;
use App\Services\FCMService;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class EconomicResourceController extends Controller
{
    public function __construct(
        private EconomicResourceService $resourceService
    ) {}

    private function response($success, $message, $data = null, $code = 200)
    {
        return response()->json(['success' => $success, 'message' => $message, 'data' => $data], $code);
    }

    // ================================================================
    // POST /api/resources — Tambah Potensi Ekonomi Baru
    // Langsung AKTIF tanpa review admin.
    // ================================================================
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'resource_name'        => 'required|string|max:255',
            'description'          => 'required|string|min:20',
            'category_id'          => 'required|integer|in:1,2,3,4',
            'latitude'             => 'nullable|numeric|between:-90,90',
            'longitude'            => 'nullable|numeric|between:-180,180',
            'address'              => 'nullable|string|max:500',
            'province'             => 'nullable|string|max:100',
            'city'                 => 'nullable|string|max:100',
            'business_scale'       => 'required|in:mikro,kecil,menengah,besar',
            'monthly_capacity'     => 'nullable|string|max:255',
            'investment_needed'    => 'nullable|numeric|min:0',
            'collaboration_needed' => 'nullable|string',
            'opportunity_status'   => 'nullable|in:aktif,mencari_investor,mencari_distributor,mencari_supplier,mencari_mitra,ekspansi',
            'contact_information'  => 'nullable|string|max:255',
            'website'              => 'nullable|url|max:255',
            'social_media'         => 'nullable|array',
            'images'               => 'nullable|array|max:5',
            'images.*'             => 'image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        if ($validator->fails()) {
            return $this->response(false, 'Validasi gagal', $validator->errors(), 422);
        }

        DB::beginTransaction();
        try {
            $resource = EconomicResource::create([
                'user_id'              => Auth::id(),
                'category_id'          => $request->category_id,
                'resource_name'        => $request->resource_name,
                'description'          => $request->description,
                'latitude'             => $request->latitude,
                'longitude'            => $request->longitude,
                'address'              => $request->address,
                'province'             => $request->province,
                'city'                 => $request->city,
                'business_scale'       => $request->business_scale,
                'monthly_capacity'     => $request->monthly_capacity,
                'investment_needed'    => $request->investment_needed,
                'collaboration_needed' => $request->collaboration_needed,
                'opportunity_status'   => $request->opportunity_status ?? 'aktif',
                'contact_information'  => $request->contact_information,
                'website'              => $request->website,
                'social_media'         => $request->social_media,
                'status'               => 'active', // Langsung aktif!
                'verification_level'   => 1,         // Level 1: Terdaftar
            ]);

            if ($request->hasFile('images')) {
                $this->resourceService->uploadImages($resource->id, $request->file('images'));
            }

            DB::commit();
            $resource->load(['contributor', 'category', 'images']);

            // FCM notifikasi
            try {
                $fcm = new FCMService();
                $user = Auth::user();
                if ($user->fcm_token) {
                    $fcm->sendToToken(
                        token: $user->fcm_token,
                        title: '✅ Potensi Berhasil Dipublikasikan',
                        body:  "Potensi \"{$resource->resource_name}\" kini aktif di peta ekonomi!",
                        data:  ['type' => 'resource_created', 'resource_id' => (string) $resource->id]
                    );
                }
            } catch (\Exception $e) {
                \Log::warning('FCM failed: ' . $e->getMessage());
            }

            return $this->response(true, 'Potensi ekonomi berhasil dipublikasikan', $this->formatResource($resource), 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->response(false, 'Gagal menyimpan: ' . $e->getMessage(), null, 500);
        }
    }

    // ================================================================
    // GET /api/resources
    // ================================================================
    public function index(Request $request)
    {
        $result = $this->resourceService->getList($request);
        $resources = $result['resources'];
        $collection = is_a($resources, \Illuminate\Pagination\LengthAwarePaginator::class)
            ? $resources->getCollection()
            : $resources;

        return $this->response(true, 'Daftar potensi berhasil dimuat', [
            'resources'  => $collection->map(fn($r) => $this->formatResource($r)),
            'pagination' => $result['pagination'],
        ]);
    }

    // ================================================================
    // GET /api/resources/mine
    // ================================================================
    public function myResources(Request $request)
    {
        $result = $this->resourceService->getList($request, Auth::id());
        $resources = $result['resources'];
        $collection = is_a($resources, \Illuminate\Pagination\LengthAwarePaginator::class)
            ? $resources->getCollection()
            : $resources;

        return $this->response(true, 'Potensi saya berhasil dimuat', [
            'resources'  => $collection->map(fn($r) => $this->formatResource($r)),
            'pagination' => $result['pagination'],
        ]);
    }

    // ================================================================
    // GET /api/resources/{id}
    // ================================================================
    public function show(string $id)
    {
        $resource = EconomicResource::with([
            'contributor', 'category', 'images',
            'verifications.user', 'savedBy',
        ])->find($id);

        if (!$resource) {
            return $this->response(false, 'Potensi tidak ditemukan', null, 404);
        }

        $resource->increment('view_count');

        return $this->response(true, 'Detail potensi berhasil dimuat', $this->formatResource($resource, true));
    }

    // ================================================================
    // PUT /api/resources/{id}
    // ================================================================
    public function update(Request $request, string $id)
    {
        $resource = EconomicResource::find($id);

        if (!$resource) {
            return $this->response(false, 'Potensi tidak ditemukan', null, 404);
        }

        if ($resource->user_id !== Auth::id()) {
            return $this->response(false, 'Tidak diizinkan mengedit potensi ini', null, 403);
        }

        DB::beginTransaction();
        try {
            $resource->update([
                'resource_name'        => $request->resource_name        ?? $resource->resource_name,
                'description'          => $request->description          ?? $resource->description,
                'category_id'          => $request->category_id          ?? $resource->category_id,
                'latitude'             => $request->latitude              ?? $resource->latitude,
                'longitude'            => $request->longitude             ?? $resource->longitude,
                'address'              => $request->address               ?? $resource->address,
                'province'             => $request->province              ?? $resource->province,
                'city'                 => $request->city                  ?? $resource->city,
                'business_scale'       => $request->business_scale        ?? $resource->business_scale,
                'monthly_capacity'     => $request->monthly_capacity      ?? $resource->monthly_capacity,
                'investment_needed'    => $request->investment_needed     ?? $resource->investment_needed,
                'collaboration_needed' => $request->collaboration_needed  ?? $resource->collaboration_needed,
                'opportunity_status'   => $request->opportunity_status    ?? $resource->opportunity_status,
                'contact_information'  => $request->contact_information   ?? $resource->contact_information,
                'website'              => $request->website               ?? $resource->website,
                'social_media'         => $request->social_media          ?? $resource->social_media,
                // TIDAK kembali ke pending — tetap aktif setelah edit
            ]);

            $existingUrls = $request->input('existing_photos', []);
            if (!empty($existingUrls) || $request->hasFile('images')) {
                $this->resourceService->syncImages($resource->id, $existingUrls);
            }

            if ($request->hasFile('images')) {
                $this->resourceService->uploadImages($resource->id, $request->file('images'));
            }

            DB::commit();
            $resource->load(['contributor', 'category', 'images']);

            return $this->response(true, 'Potensi berhasil diperbarui', $this->formatResource($resource));

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->response(false, 'Gagal memperbarui: ' . $e->getMessage(), null, 500);
        }
    }

    // ================================================================
    // DELETE /api/resources/{id}
    // ================================================================
    public function destroy(string $id)
    {
        $resource = EconomicResource::find($id);

        if (!$resource) {
            return $this->response(false, 'Potensi tidak ditemukan', null, 404);
        }

        if ($resource->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            return $this->response(false, 'Tidak diizinkan menghapus potensi ini', null, 403);
        }

        $resource->delete();

        return $this->response(true, 'Potensi berhasil dihapus');
    }

    // ================================================================
    // GET /api/publik/economic-map
    // ================================================================
    public function economicMap(Request $request)
    {
        $data = $this->resourceService->getMapData($request);
        return response()->json(['success' => true, 'data' => $data]);
    }

    // ================================================================
    // ADMIN: Hapus spam / data palsu (bukan verifikasi)
    // DELETE /api/admin/resources/{id}/remove
    // ================================================================
    public function adminRemove(Request $request, string $id)
    {
        if (!Auth::user()->isAdmin()) {
            return $this->response(false, 'Akses ditolak', null, 403);
        }

        $resource = EconomicResource::find($id);
        if (!$resource) {
            return $this->response(false, 'Potensi tidak ditemukan', null, 404);
        }

        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $resource->update([
            'status'      => 'removed',
            'admin_notes' => 'Dihapus admin: ' . $request->reason,
        ]);
        $resource->delete(); // soft delete

        // FCM ke pemilik
        try {
            $fcm  = new FCMService();
            $user = $resource->contributor;
            if ($user?->fcm_token) {
                $fcm->sendToToken(
                    token: $user->fcm_token,
                    title: '⚠️ Potensi Dihapus oleh Admin',
                    body:  "Potensi \"{$resource->resource_name}\" dihapus. Alasan: {$request->reason}",
                    data:  ['type' => 'resource_removed', 'resource_id' => (string) $resource->id]
                );
            }
        } catch (\Exception $e) {
            \Log::warning('FCM failed: ' . $e->getMessage());
        }

        return $this->response(true, 'Potensi berhasil dihapus oleh admin');
    }

    // ================================================================
    // FORMATTER
    // ================================================================
    private function formatResource(EconomicResource $resource, bool $detail = false): array
    {
        $levelInfo = VerificationService::getLevelInfo($resource->verification_level ?? 1);

        $data = [
            'id'                   => $resource->id,
            'resource_name'        => $resource->resource_name,
            'description'          => $resource->description,
            'status'               => $resource->status,
            'opportunity_status'   => $resource->opportunity_status,
            'business_scale'       => $resource->business_scale,
            'monthly_capacity'     => $resource->monthly_capacity,
            'investment_needed'    => $resource->investment_needed,
            'collaboration_needed' => $resource->collaboration_needed,
            'verification_score'   => $resource->verification_score,
            'community_verified'   => (bool) $resource->community_verified,
            'verification_level'   => $resource->verification_level ?? 1,
            'verification_label'   => $levelInfo['label'],
            'verification_icon'    => $levelInfo['icon'],
            'verification_color'   => $levelInfo['color'],
            'contact_information'  => $resource->contact_information,
            'website'              => $resource->website,
            'social_media'         => $resource->social_media,
            'view_count'           => $resource->view_count,
            'lokasi'               => [
                'latitude'  => $resource->latitude ? (float) $resource->latitude : null,
                'longitude' => $resource->longitude ? (float) $resource->longitude : null,
                'address'   => $resource->address,
                'province'  => $resource->province,
                'city'      => $resource->city,
            ],
            'category'    => $resource->category ? [
                'id'    => $resource->category->id,
                'name'  => $resource->category->name,
                'slug'  => $resource->category->slug,
                'color' => $resource->category->color,
                'icon'  => $resource->category->icon,
            ] : null,
            'contributor' => $resource->contributor ? [
                'id'              => $resource->contributor->id,
                'nama'            => $resource->contributor->nama,
                'foto'            => $resource->contributor->foto,
                'organization'    => $resource->contributor->organization,
                'is_business_owner' => $resource->contributor->isBusinessOwner(),
                'is_investor'     => $resource->contributor->isInvestor(),
                'badges'          => $resource->contributor->getBadges(),
            ] : null,
            'images'      => $resource->images->map(fn($img) => [
                'id'  => $img->id,
                'url' => $img->image_url,
            ])->values(),
            'dibuat_pada'   => $resource->created_at?->toISOString(),
            'diupdate_pada' => $resource->updated_at?->toISOString(),
        ];

        if ($detail && $resource->relationLoaded('verifications')) {
            $data['verifications'] = $resource->verifications->map(fn($v) => [
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
            ])->values();

            $data['saved_count'] = $resource->savedBy->count();
        }

        return $data;
    }
}
