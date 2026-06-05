<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Revisi: Tidak perlu role investor/community di tabel roles.
     * Semua user register sebagai "user".
     * Status Business Owner / Investor / Community Contributor
     * didapatkan secara dinamis berdasarkan aktivitas.
     */
    public function up(): void
    {
        // Kosong — tidak insert role investor/community lagi
        // Role yang ada: user, admin (sudah ada dari seeder awal)
    }

    public function down(): void
    {
        // Kosong
    }
};
