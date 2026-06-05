<?php

namespace App\Http\Controllers;

use App\Models\EconomicResource;
use App\Services\RecommendationService;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    public function __construct(
        private RecommendationService $recommendationService
    ) {}

    // ================================================================
    // GET /api/resources/{id}/recommendations
    // ================================================================
    public function index(string $resourceId)
    {
        $resource = EconomicResource::find($resourceId);

        if (!$resource) {
            return response()->json([
                'success' => false,
                'message' => 'Potensi tidak ditemukan',
            ], 404);
        }

        $categoryRecommendations = $this->recommendationService->getByCategory($resource->category_id);
        $statusRecommendations   = $this->recommendationService->getByOpportunityStatus($resource->opportunity_status);

        // Cari resource serupa berdasarkan kategori & wilayah
        $similarResources = EconomicResource::with(['category', 'contributor'])
            ->where('id', '!=', $resourceId)
            ->where('status', 'active')
            ->where('category_id', $resource->category_id)
            ->when($resource->province, function ($q) use ($resource) {
                $q->where('province', $resource->province);
            })
            ->orderByDesc('verification_score')
            ->limit(5)
            ->get()
            ->map(fn($r) => [
                'id'                 => $r->id,
                'resource_name'      => $r->resource_name,
                'business_scale'     => $r->business_scale,
                'verification_score' => $r->verification_score,
                'province'           => $r->province,
                'city'               => $r->city,
                'category'           => $r->category?->name,
                'contributor'        => $r->contributor?->nama,
            ]);

        // Cari investor yang berpotensi sesuai
        $potentialInvestors = \App\Models\User::where('is_investor', true)
            ->inRandomOrder()
            ->limit(5)
            ->get()
            ->map(fn($u) => [
                'id'           => $u->id,
                'nama'         => $u->nama,
                'organization' => $u->organization,
                'foto'         => $u->foto,
            ]);

        return response()->json([
            'success' => true,
            'data'    => [
                'resource_id'              => $resourceId,
                'category_id'              => $resource->category_id,
                'category_recommendations' => $categoryRecommendations,
                'status_recommendations'   => $statusRecommendations,
                'similar_resources'        => $similarResources,
                'potential_investors'       => $potentialInvestors,
            ],
        ]);
    }
}
