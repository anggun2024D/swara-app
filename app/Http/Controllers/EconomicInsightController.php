<?php

namespace App\Http\Controllers;

use App\Models\EconomicResource;
use App\Models\User;
use App\Models\Collaboration;
use App\Models\ResourceVerification;
use App\Services\GeospatialService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EconomicInsightController extends Controller
{
    public function __construct(
        private GeospatialService $geoService
    ) {}

    // ================================================================
    // GET /api/insights/dashboard — Dashboard Stats Global
    // ================================================================
    public function dashboard()
    {
        $data = [
            'total_resources'           => EconomicResource::where('status', 'active')->count(),
            'total_contributors'        => User::count(),
            'total_investors'           => User::where('is_investor', true)->count(),
            'total_community'           => User::where('total_verifications_given', '>=', 10)->count(),
            'total_verifications'       => ResourceVerification::count(),
            'total_collaborations'      => Collaboration::count(),
            'total_accepted_collabs'    => Collaboration::where('status', 'accepted')->count(),
            'total_active_opportunities' => EconomicResource::where('status', 'active')
                                            ->where('opportunity_status', '!=', 'aktif')->count(),
            'total_investment_potential' => (float) EconomicResource::where('status', 'active')
                                            ->sum('investment_needed'),
            'by_category'               => $this->geoService->getCategoryDistribution(),
            'by_province'               => $this->geoService->getProvinceStats(),
        ];

        return response()->json(['success' => true, 'data' => $data]);
    }

    // ================================================================
    // GET /api/insights/heatmap — Heatmap Data
    // ================================================================
    public function heatmap(Request $request)
    {
        $filters = $request->only(['category_id', 'province']);
        $data    = $this->geoService->getHeatmapData($filters);

        return response()->json(['success' => true, 'data' => $data]);
    }

    // ================================================================
    // GET /api/insights/top-regions — Top Wilayah
    // ================================================================
    public function topRegions(Request $request)
    {
        $data = $this->geoService->getProvinceStats();

        if ($request->filled('province')) {
            $cities = $this->geoService->getCityStats($request->province);
            return response()->json(['success' => true, 'data' => ['province' => $request->province, 'cities' => $cities]]);
        }

        return response()->json(['success' => true, 'data' => ['provinces' => $data]]);
    }

    // ================================================================
    // GET /api/insights/growth — Grafik Pertumbuhan
    // ================================================================
    public function growthChart()
    {
        $resourceGrowth = $this->geoService->getGrowthData();

        // Pertumbuhan verifikasi per bulan
        $verificationGrowth = DB::table('resource_verifications')
            ->where('created_at', '>=', now()->subMonths(12))
            ->select(
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn($r) => ['month' => $r->month, 'total' => (int) $r->total])
            ->toArray();

        // Pertumbuhan kolaborasi per bulan
        $collaborationGrowth = DB::table('collaborations')
            ->where('created_at', '>=', now()->subMonths(12))
            ->select(
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
                DB::raw('COUNT(*) as total'),
                DB::raw('SUM(CASE WHEN status = "accepted" THEN 1 ELSE 0 END) as accepted')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn($r) => [
                'month'    => $r->month,
                'total'    => (int) $r->total,
                'accepted' => (int) $r->accepted,
            ])
            ->toArray();

        return response()->json([
            'success' => true,
            'data'    => [
                'resources'      => $resourceGrowth,
                'verifications'  => $verificationGrowth,
                'collaborations' => $collaborationGrowth,
            ],
        ]);
    }

    // ================================================================
    // GET /api/insights/categories — Distribusi Kategori
    // ================================================================
    public function categoryDistribution()
    {
        $data = $this->geoService->getCategoryDistribution();

        return response()->json(['success' => true, 'data' => $data]);
    }
}
