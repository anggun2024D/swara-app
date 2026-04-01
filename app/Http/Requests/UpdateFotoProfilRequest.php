<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFotoProfilRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Foto wajib diisi
            // Format JPG/JPEG/PNG
            // Maksimal 3MB
            'foto' => 'required|image|mimes:jpg,jpeg,png|max:3072',
        ];
    }

    public function messages(): array
    {
        return [
            'foto.required' => 'Foto wajib diunggah',
            'foto.image'    => 'File harus berupa gambar',
            'foto.mimes'    => 'Format foto harus JPG/JPEG/PNG',
            'foto.max'      => 'Ukuran foto maksimal 3MB',
        ];
    }
}
