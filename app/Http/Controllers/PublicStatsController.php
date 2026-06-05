<?php

namespace App\Http\Controllers;

use App\Models\EconomicResource;
use App\Models\User;
use App\Models\ResourceVerification;
use App\Models\Collaboration;
use Illuminate\Support\Facades\DB;

class PublicStatsController extends Controller
{
    // ================================================================
    // GET /api/stats — Statistik Publik Landing Page
    // ================================================================
    public function index()
    {
        $totalResources = EconomicResource::where('status', 'active')->count();
        $totalUsers     = User::where('is_active', true)->count();
        $totalVerified  = EconomicResource::where('status', 'active')
                            ->where('community_verified', true)->count();
        $totalCollabs   = Collaboration::where('status', 'accepted')->count();

        // Per kategori
        $byCategory = DB::table('economic_resources as er')
            ->join('resource_categories as rc', 'er.category_id', '=', 'rc.id')
            ->whereNull('er.deleted_at')
            ->where('er.status', 'active')
            ->select('rc.id', 'rc.name', 'rc.slug', 'rc.icon', 'rc.color', DB::raw('COUNT(*) as total'))
            ->groupBy('rc.id', 'rc.name', 'rc.slug', 'rc.icon', 'rc.color')
            ->get();

        // Top 5 provinsi
        $topProvinces = DB::table('economic_resources')
            ->whereNull('deleted_at')
            ->where('status', 'active')
            ->whereNotNull('province')
            ->select('province', DB::raw('COUNT(*) as total'))
            ->groupBy('province')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data'    => [
                'total_potensi'       => $totalResources,
                'total_pengguna'      => $totalUsers,
                'total_terverifikasi' => $totalVerified,
                'total_kolaborasi'    => $totalCollabs,
                'by_category'         => $byCategory,
                'top_provinces'       => $topProvinces,
            ],
        ]);
    }
}