<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Google\Auth\Credentials\ServiceAccountCredentials;

class FCMService
{
    public function sendNotification(string $fcmToken, string $title, string $body, array $data = []): bool
    {
        try {
            $credentialsPath = storage_path('app/firebase-credentials.json');
            $credentials = new ServiceAccountCredentials(
                'https://www.googleapis.com/auth/firebase.messaging',
                json_decode(file_get_contents($credentialsPath), true)
            );

            $token = $credentials->fetchAuthToken();
            $accessToken = $token['access_token'];

            $projectId = json_decode(file_get_contents($credentialsPath), true)['project_id'];

            $response = Http::withToken($accessToken)->post(
                "https://fcm.googleapis.com/v1/projects/{$projectId}/messages:send",
                [
                    'message' => [
                        'token' => $fcmToken,
                        'notification' => [
                            'title' => $title,
                            'body'  => $body,
                        ],
                        'data' => array_map('strval', $data),
                    ]
                ]
            );

            return $response->successful();

        } catch (\Exception $e) {
            \Log::error('FCM Error: ' . $e->getMessage());
            return false;
        }
    }
}
