<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\ReportCategory;
use Illuminate\Http\JsonResponse;

class PublicStatsController extends Controller
{
    public function index(): JsonResponse
    {
        // Ambil semua laporan (tanpa auth), exclude soft deleted
        $reports = Report::with('category')
            ->whereNull('deleted_at')
            ->get();

        $total     = $reports->count();
        $selesai   = $reports->where('status', 'selesai')->count();
        $diproses  = $reports->where('status', 'diproses')->count();
        $tersubmit = $reports->where('status', 'tersubmit')->count();
        $ditolak   = $reports->where('status', 'ditolak')->count();

        // Breakdown per kategori
        $categoryBreakdown = $reports
            ->groupBy(fn($r) => $r->category?->name ?? 'Lainnya')
            ->map(fn($group) => $group->count())
            ->sortDesc()
            ->take(5)
            ->map(fn($count, $name) => [
                'name'       => $name,
                'count'      => $count,
                'percentage' => $total > 0 ? round(($count / $total) * 100) : 0,
            ])
            ->values();

        return response()->json([
            'success' => true,
            'data'    => [
                'total'              => $total,
                'selesai'            => $selesai,
                'diproses'           => $diproses,
                'tersubmit'          => $tersubmit,
                'ditolak'            => $ditolak,
                'completion_rate'    => $total > 0 ? round(($selesai / $total) * 100) : 0,
                'category_breakdown' => $categoryBreakdown,
            ],
        ]);
    }
}