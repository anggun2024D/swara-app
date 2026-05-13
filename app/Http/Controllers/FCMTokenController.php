<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FCMTokenController extends Controller
{
    public function update(Request $request)
    {
        $request->validate(['fcm_token' => 'required|string']);

        Auth::user()->update(['fcm_token' => $request->fcm_token]);

        return response()->json([
            'success' => true,
            'message' => 'FCM token berhasil disimpan',
        ]);
    }
}
