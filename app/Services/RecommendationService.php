<?php

namespace App\Services;

class RecommendationService
{
    /**
     * Peta rekomendasi berdasarkan category_id
     */
    private array $recommendations = [
        1 => [ // UMKM & Industri Kreatif
            ['type' => 'investor',      'label' => 'Investor',        'icon' => '💰', 'description' => 'Cari pendanaan untuk ekspansi usaha'],
            ['type' => 'distributor',   'label' => 'Distributor',     'icon' => '🚚', 'description' => 'Perluas jangkauan distribusi produk'],
            ['type' => 'marketplace',   'label' => 'Marketplace',     'icon' => '🛒', 'description' => 'Jual produk di platform digital'],
            ['type' => 'mentor_bisnis', 'label' => 'Mentor Bisnis',   'icon' => '🎓', 'description' => 'Dapatkan bimbingan dari ahli bisnis'],
        ],
        2 => [ // Pertanian & Pangan
            ['type' => 'distributor',      'label' => 'Distributor',       'icon' => '🚚', 'description' => 'Distribusikan hasil panen ke pasar'],
            ['type' => 'supplier',         'label' => 'Supplier',          'icon' => '📦', 'description' => 'Suplai kebutuhan pertanian'],
            ['type' => 'investor',         'label' => 'Investor',          'icon' => '💰', 'description' => 'Kembangkan lahan dan kapasitas produksi'],
            ['type' => 'mitra_produksi',   'label' => 'Mitra Produksi',    'icon' => '🤝', 'description' => 'Kolaborasi pengolahan hasil tani'],
        ],
        3 => [ // Perikanan & Peternakan
            ['type' => 'supplier_pakan',   'label' => 'Supplier Pakan',    'icon' => '🌾', 'description' => 'Dapatkan pakan berkualitas dengan harga terjangkau'],
            ['type' => 'investor',         'label' => 'Investor',          'icon' => '💰', 'description' => 'Investasi untuk perluasan tambak/kandang'],
            ['type' => 'pengolah_hasil',   'label' => 'Pengolah Hasil',    'icon' => '🏭', 'description' => 'Olah hasil tangkap/ternak menjadi produk bernilai tinggi'],
            ['type' => 'distributor',      'label' => 'Distributor',       'icon' => '🚚', 'description' => 'Distribusikan ke restoran dan pasar'],
        ],
        4 => [ // Pariwisata & Ekonomi Lokal
            ['type' => 'investor',          'label' => 'Investor',           'icon' => '💰', 'description' => 'Investasi pengembangan destinasi wisata'],
            ['type' => 'travel_partner',    'label' => 'Travel Partner',     'icon' => '✈️', 'description' => 'Kolaborasi dengan agen perjalanan'],
            ['type' => 'komunitas_wisata',  'label' => 'Komunitas Wisata',   'icon' => '👥', 'description' => 'Bergabung dengan komunitas pariwisata lokal'],
            ['type' => 'promotor_daerah',   'label' => 'Promotor Daerah',    'icon' => '📣', 'description' => 'Promosikan potensi wisata ke skala nasional'],
        ],
    ];

    /**
     * Ambil rekomendasi berdasarkan kategori resource
     */
    public function getByCategory(int $categoryId): array
    {
        return $this->recommendations[$categoryId] ?? [];
    }

    /**
     * Ambil rekomendasi berdasarkan opportunity_status
     */
    public function getByOpportunityStatus(string $status): array
    {
        return match ($status) {
            'mencari_investor'    => ['investor'],
            'mencari_distributor' => ['distributor'],
            'mencari_supplier'    => ['supplier', 'supplier_pakan'],
            'mencari_mitra'       => ['mitra_produksi', 'travel_partner', 'komunitas_wisata'],
            'ekspansi'            => ['investor', 'distributor', 'marketplace'],
            default               => [],
        };
    }
}
