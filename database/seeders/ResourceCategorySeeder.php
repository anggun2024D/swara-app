<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ResourceCategorySeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('resource_categories')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        DB::table('resource_categories')->insert([
            [
                'id'          => 1,
                'name'        => 'UMKM & Industri Kreatif',
                'slug'        => 'umkm',
                'icon'        => '🏭',
                'color'       => '#F59E0B',
                'description' => 'Usaha Mikro, Kecil, Menengah dan industri kreatif lokal',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'id'          => 2,
                'name'        => 'Pertanian & Pangan',
                'slug'        => 'pertanian',
                'icon'        => '🌾',
                'color'       => '#10B981',
                'description' => 'Sektor pertanian, perkebunan, dan ketahanan pangan',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'id'          => 3,
                'name'        => 'Perikanan & Peternakan',
                'slug'        => 'perikanan',
                'icon'        => '🐟',
                'color'       => '#3B82F6',
                'description' => 'Sektor perikanan, budidaya, dan peternakan',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'id'          => 4,
                'name'        => 'Pariwisata & Ekonomi Lokal',
                'slug'        => 'pariwisata',
                'icon'        => '🏝️',
                'color'       => '#8B5CF6',
                'description' => 'Sektor pariwisata, ekonomi kreatif, dan budaya lokal',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
        ]);
    }
}
