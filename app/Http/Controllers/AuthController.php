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
        $response = \Illuminate\Support\Facades\Http::get(
            'https://oauth2.googleapis.com/tokeninfo',
            ['id_token' => $request->id_token]
        );

        $googleData = $response->json();

        // Langsung return data untuk debug
        return response()->json([
            'status'      => 'debug',
            'google_data' => $googleData,
            'response_status' => $response->status(),
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'status'  => 'error',
            'message' => $e->getMessage(),
            'file'    => $e->getFile(),
            'line'    => $e->getLine(),
        ], 500);
    }
}
}
