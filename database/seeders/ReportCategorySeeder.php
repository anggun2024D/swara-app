<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReportCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Sampah',    'is_active' => true, 'created_at' => now()],
            ['name' => 'Jalan',     'is_active' => true, 'created_at' => now()],
            ['name' => 'Fasilitas Umum',     'is_active' => true, 'created_at' => now()],
            ['name' => 'Lingkungan',    'is_active' => true, 'created_at' => now()],
            ['name' => 'Pelayanan Publik',   'is_active' => true, 'created_at' => now()],
            ['name' => 'Keamanan',   'is_active' => true, 'created_at' => now()],
        ];

        DB::table('report_categories')->insert($categories);
    }
}
