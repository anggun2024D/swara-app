<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'judul'        => 'required|string|min:5|max:150',
            'deskripsi'    => 'required|string|min:10',
            'category_id'  => 'required|exists:report_categories,id',
            'latitude'     => 'required|numeric|between:-90,90',
            'longitude'    => 'required|numeric|between:-180,180',
            'address'      => 'nullable|string|max:255',
            'images'       => 'required|array|min:1|max:5',
            'images.*'     => 'required|image|mimes:jpg,jpeg,png|max:5120',
            'is_confirmed' => 'required|accepted',
        ];
    }

    public function messages(): array
    {
        return [
            'judul.required'        => 'Judul laporan wajib diisi',
            'judul.min'             => 'Judul minimal 5 karakter',
            'deskripsi.required'    => 'Deskripsi wajib diisi',
            'deskripsi.min'         => 'Deskripsi minimal 10 karakter',
            'category_id.required'  => 'Kategori wajib dipilih',
            'category_id.exists'    => 'Kategori tidak valid',
            'latitude.required'     => 'Lokasi wajib dipilih',
            'longitude.required'    => 'Lokasi wajib dipilih',
            'images.required'       => 'Minimal 1 foto wajib diunggah',
            'images.*.image'        => 'File harus berupa gambar',
            'images.*.mimes'        => 'Format foto harus JPG/JPEG/PNG',
            'images.*.max'          => 'Ukuran foto maksimal 5MB',
            'is_confirmed.required' => 'Konfirmasi wajib dicentang',
            'is_confirmed.accepted' => 'Konfirmasi wajib dicentang',
        ];
    }
}
