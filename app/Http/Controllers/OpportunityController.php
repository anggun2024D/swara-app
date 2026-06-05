<?php

namespace App\Http\Controllers;

use App\Models\EconomicResource;
use App\Models\SavedOpportunity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OpportunityController extends Controller
{
    private function response($success, $message, $data = null, $code = 200)
    {
        return response()->json(['success' => $success, 'message' => $message, 'data' => $data], $code);
    }

    private function formatResource(EconomicResource $r): array
    {
        $levelInfo = \App\Services\VerificationService::getLevelInfo($r->verification_level ?? 1);

        return [
            'id'                   => $r->id,
            'resource_name'        => $r->resource_name,
            'description'          => $r->description,
            'status'               => $r->status,
            'opportunity_status'   => $r->opportunity_status,
            'business_scale'       => $r->business_scale,
            'investment_needed'    => $r->investment_needed,
            'collaboration_needed' => $r->collaboration_needed,
            'verification_score'   => $r->verification_score,
            'community_verified'   => (bool) $r->community_verified,
            'verification_level'   => $r->verification_level ?? 1,
            'verification_label'   => $levelInfo['label'],
            'verification_icon'    => $levelInfo['icon'],
            'verification_color'   => $levelInfo['color'],
            'view_count'           => $r->view_count,
            'lokasi'               => [
                'latitude'  => $r->latitude ? (float) $r->latitude : null,
                'longitude' => $r->longitude ? (float) $r->longitude : null,
                'address'   => $r->address,
                'province'  => $r->province,
                'city'      => $r->city,
            ],
            'category' => $r->category ? [
                'id'    => $r->category->id,
                'name'  => $r->category->name,
                'slug'  => $r->category->slug,
                'color' => $r->category->color,
                'icon'  => $r->category->icon,
            ] : null,
            'contributor' => $r->contributor ? [
                'id'           => $r->contributor->id,
                'nama'         => $r->contributor->nama,
                'foto'         => $r->contributor->foto,
                'organization' => $r->contributor->organization,
            ] : null,
            'images' => $r->images->map(fn($img) => [
                'id'  => $img->id,
                'url' => $img->image_url,
            ])->values(),
            'dibuat_pada' => $r->created_at?->toISOString(),
        ];
    }

    // ================================================================
    // GET /api/opportunities — Opportunity Board (publik)
    // ================================================================
    public function index(Request $request)
    {
        $query = EconomicResource::with(['contributor', 'category', 'images'])
            ->where('status', 'active')
            ->where('opportunity_status', '!=', 'aktif') // hanya yang mencari sesuatu
            ->latest();

        // Filter opportunity_status
        if ($request->filled('opportunity_status')) {
            $query->where('opportunity_status', $request->opportunity_status);
        }

        // Filter kategori
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter provinsi
        if ($request->filled('province')) {
            $query->where('province', $request->province);
        }

        // Filter kota
        if ($request->filled('city')) {
            $query->where('city', 'like', "%{$request->city}%");
        }

        // Filter skala usaha
        if ($request->filled('business_scale')) {
            $query->where('business_scale', $request->business_scale);
        }

        // Pencarian
        if ($request->filled('search')) {
            $keyword = $request->search;
            $query->where(function ($q) use ($keyword) {
                $q->where('resource_name', 'like', "%{$keyword}%")
                  ->orWhere('description', 'like', "%{$keyword}%")
                  ->orWhere('address', 'like', "%{$keyword}%");
            });
        }

        $resources = $query->paginate(12);

        return $this->response(true, 'Daftar peluang berhasil dimuat', [
            'opportunities' => $resources->map(fn($r) => $this->formatResource($r))->values(),
            'pagination'    => [
                'total'         => $resources->total(),
                'per_halaman'   => $resources->perPage(),
                'halaman_ini'   => $resources->currentPage(),
                'total_halaman' => $resources->lastPage(),
            ],
            'filters'       => [
                'statuses' => [
                    ['value' => 'mencari_investor',    'label' => 'Mencari Investor'],
                    ['value' => 'mencari_distributor', 'label' => 'Mencari Distributor'],
                    ['value' => 'mencari_supplier',    'label' => 'Mencari Supplier'],
                    ['value' => 'mencari_mitra',       'label' => 'Mencari Mitra Bisnis'],
                    ['value' => 'ekspansi',            'label' => 'Ekspansi Usaha'],
                ],
            ],
        ]);
    }

    // ================================================================
    // POST /api/opportunities/{id}/save — Simpan Peluang
    // ================================================================
    public function save(string $resourceId)
    {
        $resource = EconomicResource::find($resourceId);
        if (!$resource || $resource->status !== 'active') {
            return $this->response(false, 'Potensi tidak ditemukan', null, 404);
        }

        // Cek duplikasi
        $exists = SavedOpportunity::where('user_id', Auth::id())
            ->where('resource_id', $resourceId)
            ->exists();

        if ($exists) {
            return $this->response(false, 'Peluang sudah disimpan sebelumnya', null, 422);
        }

        SavedOpportunity::create([
            'user_id'     => Auth::id(),
            'resource_id' => $resourceId,
        ]);

        return $this->response(true, 'Peluang berhasil disimpan', null, 201);
    }

    // ================================================================
    // DELETE /api/opportunities/{id}/save — Hapus dari Simpan
    // ================================================================
    public function unsave(string $resourceId)
    {
        $deleted = SavedOpportunity::where('user_id', Auth::id())
            ->where('resource_id', $resourceId)
            ->delete();

        if (!$deleted) {
            return $this->response(false, 'Peluang tidak ditemukan di daftar simpan', null, 404);
        }

        return $this->response(true, 'Peluang berhasil dihapus dari simpanan');
    }

    // ================================================================
    // GET /api/opportunities/saved — Peluang Tersimpan
    // ================================================================
    public function saved(Request $request)
    {
        $query = SavedOpportunity::with(['resource.contributor', 'resource.category', 'resource.images'])
            ->where('user_id', Auth::id())
            ->latest();

        $saved = $query->paginate(10);

        return $this->response(true, 'Peluang tersimpan berhasil dimuat', [
            'saved' => $saved->map(function ($s) {
                return $s->resource ? $this->formatResource($s->resource) : null;
            })->filter()->values(),
            'pagination' => [
                'total'         => $saved->total(),
                'per_halaman'   => $saved->perPage(),
                'halaman_ini'   => $saved->currentPage(),
                'total_halaman' => $saved->lastPage(),
            ],
        ]);
    }
}
