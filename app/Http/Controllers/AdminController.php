<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class AdminController extends Controller
{
    /**
     * GET /api/admin/users
     *
     * Query params:
     *   - search       : cari nama / email
     *   - role         : filter role (user|admin)
     *   - status       : filter is_active (aktif|nonaktif)
     *   - per_halaman  : jumlah per halaman (default 15)
     *   - halaman      : nomor halaman (default 1)
     */
    public function users(Request $request)
    {
        // Pastikan hanya admin yang bisa akses
        $authUser = auth()->user();
        if (!$authUser || strtolower($authUser->role->name ?? '') !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak. Hanya admin yang dapat mengakses endpoint ini.',
            ], 403);
        }

        $perHalaman = (int) $request->query('per_halaman', 15);
        $halaman    = (int) $request->query('halaman', 1);
        $search     = $request->query('search', '');
        $roleFilter = $request->query('role', '');
        $statusFilter = $request->query('status', '');

        $query = User::with('role')
            ->withCount('reports'); // jumlah laporan per user

        // Filter search (nama atau email)
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter role
        if ($roleFilter !== '') {
            $query->whereHas('role', function ($q) use ($roleFilter) {
                $q->where('name', strtolower($roleFilter));
            });
        }

        // Filter status aktif
        if ($statusFilter === 'aktif') {
            $query->where('is_active', true);
        } elseif ($statusFilter === 'nonaktif') {
            $query->where('is_active', false);
        }

        $query->orderBy('created_at', 'desc');

        $total        = $query->count();
        $totalHalaman = (int) ceil($total / $perHalaman);
        $users        = $query->skip(($halaman - 1) * $perHalaman)->take($perHalaman)->get();

        $mapped = $users->map(function (User $user) {
            return [
                'id'            => $user->id,
                'nama'          => $user->nama,
                'email'         => $user->email,
                'no_telp'       => $user->no_telp,
                'foto'          => $user->foto,
                'role'          => strtolower($user->role->name ?? 'user'),
                'is_active'     => (bool) $user->is_active,
                'total_laporan' => $user->reports_count,
                'bergabung_pada' => $user->created_at
                    ? $user->created_at->translatedFormat('d M Y')
                    : '-',
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'users' => $mapped,
                'pagination' => [
                    'total'         => $total,
                    'per_halaman'   => $perHalaman,
                    'halaman_ini'   => $halaman,
                    'total_halaman' => $totalHalaman,
                ],
            ],
        ]);
    }

    public function showUser(string $id): JsonResponse
    {
        $user = User::with(['role'])
            ->withCount('reports')
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'id'            => $user->id,
                'nama'          => $user->nama,
                'email'         => $user->email,
                'no_telp'       => $user->no_telp,
                'foto'          => $user->foto,
                'role'          => strtolower($user->role->name),
                'is_active'     => (bool) $user->is_active,
                'total_laporan' => $user->reports_count,
                'bergabung_pada'=> $user->created_at->translatedFormat('d M Y'),
            ],
        ]);
    }
}