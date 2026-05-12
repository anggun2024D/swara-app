<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Password lama wajib diisi
            'password_lama' => 'required|string',

            // Password baru minimal 8 karakter
            // Harus dikonfirmasi
            'password_baru' => 'required|string|min:8|confirmed',

            // Konfirmasi password baru
            'password_baru_confirmation' => 'required|same:password_baru',
        ];
    }

    public function messages(): array
    {
        return [
            'password_lama.required'              => 'Password lama wajib diisi',
            'password_baru.required'              => 'Password baru wajib diisi',
            'password_baru.min'                   => 'Password baru minimal 8 karakter',
            'password_baru.confirmed'             => 'Konfirmasi password tidak cocok',
            'password_baru_confirmation.required' => 'Konfirmasi password wajib diisi',
        ];
    }
}
