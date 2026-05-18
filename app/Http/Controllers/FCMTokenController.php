<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FCMTokenController extends Controller
{
    // POST /api/fcm-token
    // Dipanggil Flutter setiap kali token refresh atau user login
    public function store(Request $request)
    {
        $request->validate([
            'fcm_token' => 'required|string',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::guard('api')->user();
        $user->update(['fcm_token' => $request->fcm_token]);

        return response()->json([
            'success' => true,
            'message' => 'FCM token berhasil disimpan',
        ]);
    }

    // DELETE /api/fcm-token
    // Dipanggil Flutter saat logout — hapus token agar notif tidak nyasar
    public function destroy()
    {
        /** @var \App\Models\User $user */
        $user = Auth::guard('api')->user();
        $user->update(['fcm_token' => null]);

        return response()->json([
            'success' => true,
            'message' => 'FCM token berhasil dihapus',
        ]);
    }
}
