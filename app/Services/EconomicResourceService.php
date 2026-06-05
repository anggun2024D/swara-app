<?php

namespace App\Services;

use App\Models\EconomicResource;
use App\Models\ResourceImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Cloudinary\Cloudinary;
use Cloudinary\Configuration\Configuration;

class EconomicResourceService
{
    /**
     * Ambil daftar potensi ekonomi dengan filter & pagination
     */
    public function getList(Request $request, ?string $userId = null)
    {
        $query = EconomicResource::with(['contributor', 'category', 'images'])
                                 ->latest();

        // Filter berdasarkan pemilik (untuk endpoint "mine")
        if ($userId) {
            $query->where('user_id', $userId)->withTrashed();
        } else {
            // Publik hanya melihat yang aktif
            $query->where('status', 'active');
        }

        // Filter kategori
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter provinsi
        if ($request->filled('province')) {
            $query->where('province', $request->province);
        }

        // Filter kota
        if ($request->filled('city')) {
            $query->where('city', 'like', "%{$request->city}%");
        }

        // Filter skala usaha
        if ($request->filled('business_scale')) {
            $query->where('business_scale', $request->business_scale);
        }

        // Filter status peluang
        if ($request->filled('opportunity_status')) {
            $query->where('opportunity_status', $request->opportunity_status);
        }

        // Pencarian nama / deskripsi / alamat
        if ($request->filled('search')) {
            $keyword = $request->search;
            $query->where(function ($q) use ($keyword) {
                $q->where('resource_name', 'like', "%{$keyword}%")
                  ->orWhere('description', 'like', "%{$keyword}%")
                  ->orWhere('address', 'like', "%{$keyword}%");
            });
        }

        $perHalaman = $request->input('per_halaman');

        if ($perHalaman === 'all') {
            $resources = $query->get();
            return [
                'resources'  => $resources,
                'pagination' => [
                    'total'         => $resources->count(),
                    'per_halaman'   => $resources->count(),
                    'halaman_ini'   => 1,
                    'total_halaman' => 1,
                ],
            ];
        }

        $resources = $query->paginate((int) $perHalaman ?: 10);

        return [
            'resources'  => $resources,
            'pagination' => [
                'total'         => $resources->total(),
                'per_halaman'   => $resources->perPage(),
                'halaman_ini'   => $resources->currentPage(),
                'total_halaman' => $resources->lastPage(),
            ],
        ];
    }

    /**
     * Upload gambar ke Cloudinary dan simpan ke resource_images
     */
    public function uploadImages(string $resourceId, array $files): void
    {
        $cloudinary = new Cloudinary(
            Configuration::instance([
                'cloud' => [
                    'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                    'api_key'    => env('CLOUDINARY_API_KEY'),
                    'api_secret' => env('CLOUDINARY_API_SECRET'),
                ],
                'url' => ['secure' => true],
            ])
        );

        foreach ($files as $file) {
            $result = $cloudinary->uploadApi()->upload(
                $file->getRealPath(),
                ['folder' => 'swara/resources']
            );

            ResourceImage::create([
                'resource_id' => $resourceId,
                'image_url'   => $result['secure_url'],
            ]);
        }
    }

    /**
     * Hapus gambar lama yang tidak ada dalam existing_photos
     */
    public function syncImages(string $resourceId, array $existingUrls): void
    {
        $allImages = ResourceImage::where('resource_id', $resourceId)->get();

        foreach ($allImages as $image) {
            if (!in_array($image->image_url, $existingUrls)) {
                $image->delete();
            }
        }
    }

    /**
     * Data untuk peta publik
     */
    public function getMapData(Request $request): array
    {
        $query = EconomicResource::with(['category'])
            ->where('status', 'active')
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->select([
                'id', 'resource_name', 'opportunity_status', 'business_scale',
                'latitude', 'longitude', 'address', 'province', 'city',
                'category_id', 'verification_score', 'community_verified',
                'investment_needed',
            ]);

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('province')) {
            $query->where('province', $request->province);
        }

        $resources = $query->latest()->get();

        return $resources->map(fn($r) => [
            'id'               => $r->id,
            'resource_name'    => $r->resource_name,
            'opportunity_status' => $r->opportunity_status,
            'business_scale'   => $r->business_scale,
            'verification_score' => $r->verification_score,
            'community_verified' => (bool) $r->community_verified,
            'investment_needed' => $r->investment_needed,
            'lokasi'           => [
                'latitude'  => (float) $r->latitude,
                'longitude' => (float) $r->longitude,
                'address'   => $r->address,
                'province'  => $r->province,
                'city'      => $r->city,
            ],
            'category' => [
                'id'    => $r->category?->id,
                'name'  => $r->category?->name,
                'slug'  => $r->category?->slug,
                'color' => $r->category?->color,
                'icon'  => $r->category?->icon,
            ],
        ])->toArray();
    }
}
