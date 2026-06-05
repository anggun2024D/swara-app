<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DataMigrationSeeder extends Seeder
{
    /**
     * Migrate old reports data → economic_resources
     */
    public function run(): void
    {
        $reports = DB::table('reports')->whereNull('deleted_at')->get();

        foreach ($reports as $report) {
            // Check if already migrated
            $exists = DB::table('economic_resources')
                ->where('id', $report->id)
                ->exists();

            if ($exists) continue;

            DB::table('economic_resources')->insert([
                'id'                   => $report->id,
                'user_id'              => $report->user_id,
                'category_id'          => 1, // Default: UMKM
                'resource_name'        => $report->judul,
                'description'          => $report->deskripsi,
                'latitude'             => $report->latitude,
                'longitude'            => $report->longitude,
                'address'              => $report->address,
                'province'             => null,
                'city'                 => null,
                'business_scale'       => 'mikro',
                'monthly_capacity'     => null,
                'investment_needed'    => null,
                'collaboration_needed' => null,
                'verification_score'   => 0,
                'community_verified'   => false,
                'opportunity_status'   => 'aktif',
                'contact_information'  => null,
                'website'              => null,
                'social_media'         => null,
                'view_count'           => $report->view_count ?? 0,
                'status'               => 'active',
                'admin_notes'          => $report->admin_notes ?? null,
                'deleted_at'           => null,
                'created_at'           => $report->created_at,
                'updated_at'           => $report->updated_at,
            ]);

            // Migrate images
            $images = DB::table('report_images')
                ->where('report_id', $report->id)
                ->get();

            foreach ($images as $image) {
                DB::table('resource_images')->insert([
                    'resource_id' => $report->id,
                    'image_url'   => $image->image_url,
                    'created_at'  => $image->created_at,
                    'updated_at'  => $image->updated_at,
                ]);
            }
        }

        $this->command->info('Data migration selesai: ' . $reports->count() . ' potensi dimigrasikan.');
    }
}
