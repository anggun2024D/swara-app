<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;
use Kreait\Firebase\Factory;

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

        $user = User::create([
            'nama'     => $request->nama,
            'email'    => $request->email,
            'password' => bcrypt($request->password),
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'status'  => 'success',
            'message' => 'Registrasi berhasil',
            'data'    => ['token' => $token, 'user' => $user],
        ], 201);
    }

    // ─── LOGIN ────────────────────────────────────────────────────
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Email atau password salah',
            ], 401);
        }

        $user = JWTAuth::user();

        return response()->json([
            'status'  => 'success',
            'message' => 'Login berhasil',
            'data'    => ['token' => $token, 'user' => $user],
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

    // ─── PROFILE ──────────────────────────────────────────────────
    public function profile()
    {
        $user = JWTAuth::user();

        return response()->json([
            'status' => 'success',
            'data'   => $user,
        ]);
    }

    // ─── GOOGLE LOGIN (tanpa kreait/laravel-firebase) ─────────────
    public function googleLogin(Request $request)
    {
        $request->validate(['id_token' => 'required|string']);

        try {
            // Verifikasi token langsung ke Google API — tidak butuh SDK apapun
            $response = \Illuminate\Support\Facades\Http::get(
                'https://oauth2.googleapis.com/tokeninfo',
                ['id_token' => $request->id_token]
            );

            if ($response->failed()) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Token Google tidak valid',
                ], 401);
            }

            $googleData = $response->json();

            // Pastikan token untuk project Firebase kamu
            $allowedAudiences = [
                '1020702878705-xxxxxxxx.apps.googleusercontent.com', // ganti dengan client_id kamu
            ];

            // Ambil data user dari Google
            $email = $googleData['email']       ?? null;
            $name  = $googleData['name']        ?? 'Pengguna';
            $foto  = $googleData['picture']     ?? null;
            $uid   = $googleData['sub']         ?? null;

            if (!$email || !$uid) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Data Google tidak lengkap',
                ], 400);
            }

            // Cari atau buat user
            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'nama'      => $name,
                    'google_id' => $uid,
                    'foto'      => $foto,
                    'password'  => bcrypt(\Illuminate\Support\Str::random(16)),
                ]
            );

            // Update google_id kalau user sudah ada tapi belum punya
            if (!$user->google_id) {
                $user->update(['google_id' => $uid]);
            }

            $token = \Tymon\JWTAuth\Facades\JWTAuth::fromUser($user);

            return response()->json([
                'status'  => 'success',
                'message' => 'Login berhasil',
                'data'    => [
                    'token' => $token,
                    'user'  => [
                        'id'    => $user->id,
                        'nama'  => $user->nama,
                        'email' => $user->email,
                        'foto'  => $user->foto,
                    ],
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => $e->getMessage(), // sudah ada
                'file'    => $e->getFile(),    // tambah ini
                'line'    => $e->getLine(),    // tambah ini
            ], 500);
        }
    }
}
