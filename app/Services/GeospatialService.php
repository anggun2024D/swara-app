<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class GeospatialService
{
    /**
     * Data heatmap: titik-titik lat/lng dengan intensitas per kategori
     */
    public function getHeatmapData(array $filters = []): array
    {
        $query = DB::table('economic_resources')
            ->whereNull('deleted_at')
            ->where('status', 'active')
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->select('latitude', 'longitude', 'category_id', 'verification_score');

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }
        if (!empty($filters['province'])) {
            $query->where('province', $filters['province']);
        }

        return $query->get()->map(fn($r) => [
            'lat'         => (float) $r->latitude,
            'lng'         => (float) $r->longitude,
            'intensity'   => min(1, ($r->verification_score / 100)),
            'category_id' => $r->category_id,
        ])->toArray();
    }

    /**
     * Statistik per provinsi
     */
    public function getProvinceStats(): array
    {
        return DB::table('economic_resources')
            ->whereNull('deleted_at')
            ->where('status', 'active')
            ->whereNotNull('province')
            ->select(
                'province',
                DB::raw('COUNT(*) as total'),
                DB::raw('SUM(investment_needed) as total_investment'),
                DB::raw('AVG(verification_score) as avg_score')
            )
            ->groupBy('province')
            ->orderByDesc('total')
            ->limit(20)
            ->get()
            ->map(fn($r) => [
                'province'         => $r->province,
                'total'            => (int) $r->total,
                'total_investment' => (float) ($r->total_investment ?? 0),
                'avg_score'        => round((float) ($r->avg_score ?? 0), 1),
            ])
            ->toArray();
    }

    /**
     * Statistik per kota dalam provinsi
     */
    public function getCityStats(string $province): array
    {
        return DB::table('economic_resources')
            ->whereNull('deleted_at')
            ->where('status', 'active')
            ->where('province', $province)
            ->whereNotNull('city')
            ->select(
                'city',
                DB::raw('COUNT(*) as total'),
                DB::raw('SUM(investment_needed) as total_investment')
            )
            ->groupBy('city')
            ->orderByDesc('total')
            ->limit(15)
            ->get()
            ->map(fn($r) => [
                'city'             => $r->city,
                'total'            => (int) $r->total,
                'total_investment' => (float) ($r->total_investment ?? 0),
            ])
            ->toArray();
    }

    /**
     * Distribusi per kategori
     */
    public function getCategoryDistribution(): array
    {
        $total = DB::table('economic_resources')
            ->whereNull('deleted_at')
            ->where('status', 'active')
            ->count();

        if ($total === 0) return [];

        return DB::table('economic_resources as er')
            ->join('resource_categories as rc', 'er.category_id', '=', 'rc.id')
            ->whereNull('er.deleted_at')
            ->where('er.status', 'active')
            ->select(
                'rc.id as category_id',
                'rc.name as category_name',
                'rc.color',
                'rc.icon',
                DB::raw('COUNT(er.id) as count')
            )
            ->groupBy('rc.id', 'rc.name', 'rc.color', 'rc.icon')
            ->orderByDesc('count')
            ->get()
            ->map(fn($r) => [
                'category_id'   => $r->category_id,
                'category_name' => $r->category_name,
                'color'         => $r->color,
                'icon'          => $r->icon,
                'count'         => (int) $r->count,
                'percentage'    => round(($r->count / $total) * 100, 1),
            ])
            ->toArray();
    }

    /**
     * Data pertumbuhan potensi per bulan (12 bulan terakhir)
     */
    public function getGrowthData(): array
    {
        return DB::table('economic_resources')
            ->whereNull('deleted_at')
            ->where('created_at', '>=', now()->subMonths(12))
            ->select(
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
                DB::raw('COUNT(*) as total'),
                DB::raw('SUM(CASE WHEN status = "active" THEN 1 ELSE 0 END) as active'),
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn($r) => [
                'month'  => $r->month,
                'total'  => (int) $r->total,
                'active' => (int) $r->active,
            ])
            ->toArray();
    }
}
