<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BroadcastController extends Controller
{
    public function send(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'message'     => 'required|string|max:1000',
            'target_role' => 'nullable|in:user,admin',
        ]);

        $targetRole = $request->target_role;

        $query = User::where('is_active', true);
        if ($targetRole) {
            $query->whereHas('role', fn($q) => $q->where('name', $targetRole));
        }
        $users = $query->get();

        if ($users->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada user yang sesuai target',
            ], 404);
        }

        $notifications = $users->map(fn($user) => [
            'user_id'      => $user->id,
            'report_id'    => null,
            'type'         => 'broadcast',
            'title'        => $request->title,
            'message'      => $request->message,
            'is_broadcast' => true,
            'target_role'  => $targetRole,
            'is_read'      => false,
            'created_at'   => now(),
        ])->toArray();

        Notification::insert($notifications);

        // FCM push notification (opsional)
        try {
            $fcmTokens = $users->pluck('fcm_token')->filter()->values()->toArray();
            if (!empty($fcmTokens)) {
                \Log::info('FCM broadcast tokens: ' . count($fcmTokens));
                // sambungkan ke FCMService yang sudah ada jika perlu
            }
        } catch (\Exception $e) {
            \Log::warning('FCM broadcast failed: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Broadcast berhasil dikirim',
            'data'    => [
                'total_penerima' => $users->count(),
                'target_role'    => $targetRole ?? 'semua',
            ],
        ]);
    }
}