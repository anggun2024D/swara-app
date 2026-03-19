<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Report;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil user pertama yang ada
        $user = User::first();

        // Ambil laporan pertama yang ada
        $report = Report::first();

        // Kalau tidak ada user, skip
        if (!$user) {
            echo "Tidak ada user! Buat user dulu.\n";
            return;
        }

        DB::table('notifications')->insert([
            // Notifikasi 1 - belum dibaca
            [
                'user_id'    => $user->id,
                'report_id'  => $report?->id,
                'type'       => 'status_changed',
                'title'      => 'Status Laporan Diperbarui',
                'message'    => 'Laporan kamu sedang dalam proses penanganan',
                'is_read'    => false,
                'created_at' => now(),
            ],
            // Notifikasi 2 - belum dibaca
            [
                'user_id'    => $user->id,
                'report_id'  => $report?->id,
                'type'       => 'status_changed',
                'title'      => 'Laporan Selesai Ditangani',
                'message'    => 'Laporan kamu telah selesai ditangani',
                'is_read'    => false,
                'created_at' => now()->subHours(2),
            ],
            // Notifikasi 3 - sudah dibaca
            [
                'user_id'    => $user->id,
                'report_id'  => null,
                'type'       => 'report_created',
                'title'      => 'Laporan Berhasil Dikirim',
                'message'    => 'Laporan kamu telah berhasil diterima sistem',
                'is_read'    => true,
                'created_at' => now()->subDays(1),
            ],
        ]);
    }
}
