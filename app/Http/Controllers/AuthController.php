<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    // ─── REGISTER ────────────────────────────────────────────────
    public function register(Request $request)
    {
        $request->validate([
            'nama'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:6|confirmed',
        ]);

        // Ambil role_id untuk "user"
        $userRole = DB::table('roles')->where('name', 'user')->first();

        $user = User::create([
            'nama'          => $request->nama,
            'email'         => $request->email,
            'password_hash' => bcrypt($request->password),
            'role_id'       => $userRole->id,  // ← tambah ini
            'is_active'     => true,            // ← tambah ini
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'status'  => 'success',
            'message' => 'Registrasi berhasil',
            'data'    => [
                'token'      => $token,
                'token_type' => 'bearer',
                'expires_in' => config('jwt.ttl') * 60,
                'user'       => $this->formatUser($user),
            ],
        ], 201);
    }

    // ─── LOGIN ────────────────────────────────────────────────────
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        // ← TIDAK bisa pakai JWTAuth::attempt() karena kolom = password_hash
        $user = User::where('email', $request->email)
                    ->where('is_active', true)
                    ->first();

        if (!$user || !Hash::check($request->password, $user->password_hash)) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Email atau password salah',
            ], 401);
        }

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'status'  => 'success',
            'message' => 'Login berhasil',
            'data'    => [
                'token'      => $token,
                'token_type' => 'bearer',
                'expires_in' => config('jwt.ttl') * 60,
                'user'       => $this->formatUser($user),
            ],
        ]);
    }

    // ─── LOGOUT ───────────────────────────────────────────────────
    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json([
            'status'  => 'success',
            'message' => 'Logout berhasil',
        ]);
    }

    // ─── PROFILE / ME ─────────────────────────────────────────────
    public function me()
    {
        $user = JWTAuth::parseToken()->authenticate();

        return response()->json([
            'status' => 'success',
            'data'   => $this->formatUser($user),
        ]);
    }

    // ─── REFRESH TOKEN ────────────────────────────────────────────
    public function refresh()
    {
        $token = JWTAuth::refresh(JWTAuth::getToken());

        return response()->json([
            'status' => 'success',
            'data'   => ['token' => $token],
        ]);
    }

    // ─── FORMAT USER (konsisten ke frontend) ──────────────────────
    private function formatUser(User $user): array
    {
        return [
            'id'     => $user->id,                      // UUID string
            'name'   => $user->nama,                    // map nama → name
            'email'  => $user->email,
            'role'   => $user->role?->name ?? 'user',   // dari relasi
            'phone'  => $user->no_telp,                 // map no_telp → phone
            'avatar' => $user->foto
                            ? asset('storage/' . $user->foto)
                            : null,
            'is_active'  => $user->is_active,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ];
    }
}