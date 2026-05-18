<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Google\Auth\Credentials\ServiceAccountCredentials;

class FCMService
{
    private string $projectId;
    private string $credentialsPath;

    public function __construct()
    {
        $this->projectId       = config('services.firebase.project_id');
        $this->credentialsPath = config('services.firebase.credentials_path');
    }

    // ================================
    // Kirim ke 1 user (by fcm_token)
    // ================================
    public function sendToToken(
        string $token,
        string $title,
        string $body,
        array  $data = []
    ): bool {
        if (empty($token)) return false;

        return $this->send([
            'token' => $token,
            'notification' => [
                'title' => $title,
                'body'  => $body,
            ],
            'data'         => array_map('strval', $data),
            'android'      => [
                'notification' => [
                    'sound'        => 'default',
                    'click_action' => 'FLUTTER_NOTIFICATION_CLICK',
                ],
            ],
        ]);
    }

    // ================================
    // Broadcast ke banyak user
    // Kirim satu per satu (FCM tidak support multicast di HTTP v1)
    // ================================
    public function sendToMultiple(
        array  $tokens,
        string $title,
        string $body,
        array  $data = []
    ): void {
        $tokens = array_filter($tokens); // buang yang null/kosong
        foreach ($tokens as $token) {
            $this->sendToToken($token, $title, $body, $data);
        }
    }

    // ================================
    // Core: kirim ke FCM HTTP v1 API
    // ================================
    private function send(array $message): bool
    {
        try {
            $accessToken = $this->getAccessToken();
            $url = "https://fcm.googleapis.com/v1/projects/{$this->projectId}/messages:send";

            $response = Http::withToken($accessToken)
                ->post($url, ['message' => $message]);

            if ($response->successful()) {
                return true;
            }

            Log::error('[FCM] Gagal kirim notifikasi', [
                'status'   => $response->status(),
                'response' => $response->json(),
            ]);
            return false;

        } catch (\Exception $e) {
            Log::error('[FCM] Exception: ' . $e->getMessage());
            return false;
        }
    }

    // ================================
    // Ambil OAuth2 access token
    // dari service account credentials
    // ================================
    private function getAccessToken(): string
    {
        $credentials = new ServiceAccountCredentials(
            'https://www.googleapis.com/auth/firebase.messaging',
            json_decode(file_get_contents($this->credentialsPath), true)
        );

        $token = $credentials->fetchAuthToken();
        return $token['access_token'];
    }
}
