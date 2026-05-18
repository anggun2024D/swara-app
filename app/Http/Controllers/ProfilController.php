<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfilRequest;
use App\Http\Requests\UpdateFotoProfilRequest;
use App\Http\Requests\UpdatePasswordRequest;
use App\Models\User;                           // ← tambahkan ini
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Cloudinary\Cloudinary;
use Cloudinary\Configuration\Configuration;

class ProfilController extends Controller
{
    // Format response standar
    private function response(
        $success,
        $message,
        $data = null,
        $code = 200
    ) {
        return response()->json([
            'success' => $success,
            'message' => $message,
            'data'    => $data,
        ], $code);
    }

    // Format data user untuk response
    private function formatUser(User $user): array  // ← tambahkan User
    {
        return [
            'id'                    => $user->id,
            'nama'                  => $user->nama,
            'email'                 => $user->email,
            'foto_url'              => $user->foto ?? null,
            'dark_mode'             => $user->dark_mode,
            'notifications_enabled' => $user->notifications_enabled,
            'role'                  => $user->role->name,
            'bergabung_sejak'       => $user->created_at
                                           ->format('d M Y'),
        ];
    }

    // ================================
    // 1. LIHAT PROFIL
    // GET /api/profil
    // ================================
    public function index()
    {
        /** @var User $user */
        $user = Auth::user();
        $user->load('role');

        return $this->response(
            true,
            'Profil berhasil dimuat',
            $this->formatUser($user)
        );
    }

    // ================================
    // 2. UPDATE PROFIL
    // PUT /api/profil
    // ================================
    public function update(UpdateProfilRequest $request)
    {
        /** @var User $user */
            $user = Auth::user();

        $validated = $request->validate([
            'nama'    => 'sometimes|string|max:255',
            'email'   => 'sometimes|email|unique:users,email,' . $user->id,
            'no_telp' => 'nullable|string|max:20',
            'alamat'  => 'nullable|string',
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui',
            'data'    => $user,
        ]);
    }

    // ================================
    // 3. UPDATE FOTO PROFIL
    // POST /api/profil/foto
    // ================================
    public function updateFoto(UpdateFotoProfilRequest $request)
    {
        /** @var User $user */
        $user = Auth::user();

        // Simpan foto baru
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
        $result = $cloudinary->uploadApi()->upload(
            $request->file('foto')->getRealPath(),
            ['folder' => 'swara/profiles']
        );
        $user->update(['foto' => $result['secure_url']]);

        $user->load('role');

        return $this->response(
            true,
            'Foto profil berhasil diperbarui',
            $this->formatUser($user)
        );
    }

    // ================================
    // 4. GANTI PASSWORD
    // PUT /api/profil/password
    // ================================
    public function updatePassword(UpdatePasswordRequest $request)
    {
        /** @var User $user */
        $user = Auth::user();

        // Cek apakah password lama benar
        if (!Hash::check(
            $request->password_lama,
            $user->password_hash
        )) {
            return $this->response(
                false,
                'Password lama tidak sesuai',
                null,
                422
            );
        }

        // Cek password baru tidak sama dengan lama
        if ($request->password_lama === $request->password_baru) {
            return $this->response(
                false,
                'Password baru tidak boleh sama dengan password lama',
                null,
                422
            );
        }

        // Update password
        $user->update([
            'password_hash' => Hash::make($request->password_baru)
        ]);

        return $this->response(
            true,
            'Password berhasil diperbarui'
        );
    }

    // ================================
    // 5. UPDATE PREFERENSI
    // PUT /api/profil/preferensi
    // ================================
    public function updatePreferensi()
    {
        /** @var User $user */
        $user = Auth::user();

        // Toggle dark mode
        if (request()->has('dark_mode')) {
            $user->update([
                'dark_mode' => request()->boolean('dark_mode')
            ]);
        }

        // Toggle notifikasi
        if (request()->has('notifications_enabled')) {
            $user->update([
                'notifications_enabled' => request()->boolean(
                    'notifications_enabled'
                )
            ]);
        }

        $user->load('role');

        return $this->response(
            true,
            'Preferensi berhasil diperbarui',
            $this->formatUser($user)
        );
    }
}
