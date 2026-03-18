<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    // ===========================
    // REGISTER
    // ===========================
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama'     => 'required|string|min:3|max:100',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Validasi gagal',
                'errors'  => $validator->errors()
            ], 422);
        }

        $role = Role::where('name', 'user')->first();

        $user = User::create([
            'role_id'       => $role->id,
            'nama'          => $request->nama,
            'email'         => $request->email,
            'password_hash' => Hash::make($request->password),
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Registrasi berhasil',
            'data'    => [
                'user' => [
                    'id'    => $user->id,
                    'nama'  => $user->nama,
                    'email' => $user->email,
                ]
            ]
        ], 201);
    }

    // ===========================
    // LOGIN
    // ===========================
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Validasi gagal',
                'errors'  => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check(
            $request->password,
            $user->password_hash
        )) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Email atau password salah',
            ], 401);
        }

        if (!$user->is_active) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Akun kamu tidak aktif',
            ], 403);
        }

        try {
            $token = JWTAuth::fromUser($user);
        } catch (JWTException $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal membuat token',
            ], 500);
        }

        $user->sessions()->create([
            'device_info'   => $request->header('User-Agent'),
            'ip_address'    => $request->ip(),
            'last_activity' => now(),
            'expired_at'    => now()->addDays(1),
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Login berhasil',
            'data'    => [
                'token' => $token,
                'user'  => [
                    'id'    => $user->id,
                    'nama'  => $user->nama,
                    'email' => $user->email,
                    'role'  => $user->role->name,
                ]
            ]
        ], 200);
    }

    // ===========================
    // GET PROFILE
    // ===========================
    public function profile(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        return response()->json([
            'status'  => 'success',
            'message' => 'Data profil berhasil diambil',
            'data'    => [
                'user' => [
                    'id'                    => $user->id,
                    'nama'                  => $user->nama,
                    'email'                 => $user->email,
                    'foto_url'              => $user->foto_url,
                    'dark_mode'             => $user->dark_mode,
                    'notifications_enabled' => $user->notifications_enabled,
                    'role'                  => $user->role->name,
                    'created_at'            => $user->created_at,
                ]
            ]
        ], 200);
    }

    // ===========================
    // LOGOUT
    // ===========================
    public function logout(Request $request)
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());

            return response()->json([
                'status'  => 'success',
                'message' => 'Logout berhasil',
            ], 200);

        } catch (JWTException $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal logout',
            ], 500);
        }
    }

    // ===========================
    // DELETE ACCOUNT
    // ===========================
    public function deleteAccount(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            JWTAuth::invalidate(JWTAuth::getToken());
            $user->delete();

            return response()->json([
                'status'  => 'success',
                'message' => 'Akun berhasil dihapus',
            ], 200);

        } catch (JWTException $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal menghapus akun',
            ], 500);
        }
    }
}
