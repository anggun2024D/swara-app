<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\EconomicResource;
use App\Models\Collaboration;
use App\Models\ResourceVerification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    private function ensureAdmin()
    {
        $user = auth()->user();
        if (!$user || !$user->isAdmin()) {
            abort(403, 'Akses ditolak. Hanya admin.');
        }
    }

    // ================================================================
    // GET /api/admin/users
    // ================================================================
    public function users(Request $request)
    {
        $this->ensureAdmin();

        $perHalaman   = (int) $request->query('per_halaman', 15);
        $halaman      = (int) $request->query('halaman', 1);
        $search       = $request->query('search', '');
        $roleFilter   = $request->query('role', '');
        $statusFilter = $request->query('status', '');

        $query = User::with('role')
            ->withCount('economicResources');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($roleFilter !== '') {
            $query->whereHas('role', fn($q) => $q->where('name', strtolower($roleFilter)));
        }

        if ($statusFilter === 'aktif') {
            $query->where('is_active', true);
        } elseif ($statusFilter === 'nonaktif') {
            $query->where('is_active', false);
        }

        $query->orderBy('created_at', 'desc');

        $total        = $query->count();
        $totalHalaman = (int) ceil($total / $perHalaman);
        $users        = $query->skip(($halaman - 1) * $perHalaman)->take($perHalaman)->get();

        $mapped = $users->map(fn(User $user) => [
            'id'              => $user->id,
            'nama'            => $user->nama,
            'email'           => $user->email,
            'no_telp'         => $user->no_telp,
            'foto'            => $user->foto,
            'organization'    => $user->organization,
            'role'            => $user->getRoleName(),
            'is_active'       => (bool) $user->is_active,
            'total_potensi'   => $user->economic_resources_count,
            'bergabung_pada'  => $user->created_at?->translatedFormat('d M Y') ?? '-',
        ]);

        return response()->json([
            'success' => true,
            'data'    => [
                'users'      => $mapped,
                'pagination' => [
                    'total'         => $total,
                    'per_halaman'   => $perHalaman,
                    'halaman_ini'   => $halaman,
                    'total_halaman' => $totalHalaman,
                ],
            ],
        ]);
    }

    // ================================================================
    // GET /api/admin/users/{id}
    // ================================================================
    public function showUser(string $id): JsonResponse
    {
        $this->ensureAdmin();

        $user = User::with(['role'])
            ->withCount('economicResources')
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => [
                'id'              => $user->id,
                'nama'            => $user->nama,
                'email'           => $user->email,
                'no_telp'         => $user->no_telp,
                'foto'            => $user->foto,
                'bio'             => $user->bio,
                'organization'    => $user->organization,
                'website'         => $user->website,
                'social_media'    => $user->social_media,
                'role'            => $user->getRoleName(),
                'is_active'       => (bool) $user->is_active,
                'total_potensi'   => $user->economic_resources_count,
                'bergabung_pada'  => $user->created_at->translatedFormat('d M Y'),
            ],
        ]);
    }

    // ================================================================
    // GET /api/admin/stats — Statistik Admin Global (Moderator)
    // Admin hanya mengelola platform, bukan verifikator usaha.
    // ================================================================
    public function globalStats(): JsonResponse
    {
        $this->ensureAdmin();

        return response()->json([
            'success' => true,
            'data'    => [
                'total_potensi_nasional'  => EconomicResource::where('status', 'active')->count(),
                'total_user'              => User::count(),
                'total_business_owner'    => User::whereHas('economicResources')->count(),
                'total_investor'          => User::where('is_investor', true)->count(),
                'total_community_contributor' => User::where('total_verifications_given', '>=', 10)->count(),
                'total_verifikasi'        => ResourceVerification::count(),
                'total_kolaborasi'        => Collaboration::count(),
                'total_kolaborasi_sukses' => Collaboration::where('status', 'accepted')->count(),
                'total_peluang_aktif'     => EconomicResource::where('status', 'active')
                                                ->where('opportunity_status', '!=', 'aktif')->count(),
                'total_investment_value'  => (float) EconomicResource::where('status', 'active')
                                                ->sum('investment_needed'),
                'by_category' => DB::table('economic_resources as er')
                    ->join('resource_categories as rc', 'er.category_id', '=', 'rc.id')
                    ->whereNull('er.deleted_at')
                    ->where('er.status', 'active')
                    ->select('rc.name', 'rc.color', 'rc.icon', DB::raw('COUNT(*) as total'))
                    ->groupBy('rc.name', 'rc.color', 'rc.icon')
                    ->get(),
                'recent_resources' => EconomicResource::with(['contributor', 'category'])
                    ->latest()
                    ->limit(5)
                    ->get()
                    ->map(fn($r) => [
                        'id'              => $r->id,
                        'resource_name'   => $r->resource_name,
                        'status'          => $r->status,
                        'verification_level' => $r->verification_level,
                        'category'        => $r->category?->name,
                        'contributor'     => $r->contributor?->nama,
                        'created_at'      => $r->created_at?->toISOString(),
                    ]),
            ],
        ]);
    }
}