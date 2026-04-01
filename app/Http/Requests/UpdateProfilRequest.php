<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateProfilRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Nama wajib diisi
            'nama'  => 'required|string|min:3|max:100',

            // Email wajib diisi, harus unik
            // Kecuali email milik user sendiri
            'email' => 'required|email|unique:users,email,'
                        . Auth::id() . ',id',
        ];
    }

    public function messages(): array
    {
        return [
            'nama.required'  => 'Nama wajib diisi',
            'nama.min'       => 'Nama minimal 3 karakter',
            'nama.max'       => 'Nama maksimal 100 karakter',
            'email.required' => 'Email wajib diisi',
            'email.email'    => 'Format email tidak valid',
            'email.unique'   => 'Email sudah digunakan',
        ];
    }
}
