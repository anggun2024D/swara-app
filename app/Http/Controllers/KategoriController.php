<?php

namespace App\Http\Controllers;

use App\Models\ResourceCategory;
use Illuminate\Http\Request;

class KategoriController extends Controller
{
    private function response($success, $message, $data = null, $code = 200)
    {
        return response()->json(['success' => $success, 'message' => $message, 'data' => $data], $code);
    }

    // ================================================================
    // GET /api/kategori — Daftar Kategori Potensi Ekonomi
    // ================================================================
    public function index()
    {
        $categories = ResourceCategory::withCount('resources')
            ->orderBy('id')
            ->get()
            ->map(fn($c) => [
                'id'          => $c->id,
                'name'        => $c->name,
                'slug'        => $c->slug,
                'icon'        => $c->icon,
                'color'       => $c->color,
                'description' => $c->description,
                'total'       => $c->resources_count,
            ]);

        return $this->response(true, 'Daftar kategori berhasil dimuat', $categories);
    }

    // ================================================================
    // GET /api/kategori/{id} — Detail Kategori
    // ================================================================
    public function show(int $id)
    {
        $category = ResourceCategory::withCount('resources')->find($id);

        if (!$category) {
            return $this->response(false, 'Kategori tidak ditemukan', null, 404);
        }

        return $this->response(true, 'Detail kategori berhasil dimuat', [
            'id'          => $category->id,
            'name'        => $category->name,
            'slug'        => $category->slug,
            'icon'        => $category->icon,
            'color'       => $category->color,
            'description' => $category->description,
            'total'       => $category->resources_count,
        ]);
    }
}
