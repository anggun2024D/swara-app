<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'role_id',
        'nama',
        'email',
        'password_hash',
        'google_id',
        'no_telp',
        'alamat',
        'foto',
        'fcm_token',
        'dark_mode',
        'notifications_enabled',
        'is_active',
        // Kolom baru SWARA
        'bio',
        'organization',
        'website',
        'social_media',
        'is_investor',
        'total_verifications_given',
    ];

    protected $hidden = [
        'password_hash',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at'        => 'datetime',
            'dark_mode'                => 'boolean',
            'notifications_enabled'    => 'boolean',
            'is_active'                => 'boolean',
            'social_media'             => 'array',
            'is_investor'              => 'boolean',
            'total_verifications_given' => 'integer',
        ];
    }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = Str::uuid()->toString();
            }
        });
    }

    // JWT Methods
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    // ── Relasi ────────────────────────────────────────────────
    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function sessions()
    {
        return $this->hasMany(UserSession::class, 'user_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class, 'user_id');
    }

    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    public function economicResources()
    {
        return $this->hasMany(EconomicResource::class, 'user_id');
    }

    public function verifications()
    {
        return $this->hasMany(ResourceVerification::class, 'user_id');
    }

    public function savedOpportunities()
    {
        return $this->hasMany(SavedOpportunity::class, 'user_id');
    }

    public function collaborationsInitiated()
    {
        return $this->hasMany(Collaboration::class, 'initiator_id');
    }

    public function collaborationsReceived()
    {
        return $this->hasMany(Collaboration::class, 'target_id');
    }

    // ── Role Dasar (hanya user / admin) ───────────────────────
    public function getRoleName(): string
    {
        return strtolower($this->role?->name ?? 'user');
    }

    public function isAdmin(): bool
    {
        return $this->getRoleName() === 'admin';
    }

    // ── Dynamic Status System ─────────────────────────────────
    // Status didapat berdasarkan AKTIVITAS, bukan pilihan saat registrasi.

    /**
     * Business Owner = user yang memiliki minimal 1 economic resource
     */
    public function isBusinessOwner(): bool
    {
        return $this->economicResources()->exists();
    }

    /**
     * Investor = user yang mengaktifkan profil investor
     */
    public function isInvestor(): bool
    {
        return (bool) $this->is_investor;
    }

    /**
     * Community Contributor = badge reputasi
     * Didapat jika user sudah memberikan >= 10 verifikasi
     */
    public function isCommunityContributor(): bool
    {
        return ($this->total_verifications_given ?? 0) >= 10;
    }

    /**
     * Daftar status aktif user (bisa lebih dari 1)
     */
    public function getActiveStatuses(): array
    {
        $statuses = [];
        if ($this->isBusinessOwner()) $statuses[] = 'business_owner';
        if ($this->isInvestor())      $statuses[] = 'investor';
        return $statuses;
    }

    /**
     * Daftar badge reputasi
     */
    public function getBadges(): array
    {
        $badges = [];
        if ($this->isCommunityContributor()) {
            $badges[] = [
                'key'   => 'community_contributor',
                'label' => 'Community Contributor',
                'icon'  => '🏅',
            ];
        }
        // Tambah badge lain di sini di masa depan
        return $badges;
    }

    /**
     * Format profil lengkap untuk API response
     */
    public function getFullProfile(): array
    {
        return [
            'id'              => $this->id,
            'nama'            => $this->nama,
            'email'           => $this->email,
            'no_telp'         => $this->no_telp,
            'alamat'          => $this->alamat,
            'foto'            => $this->foto,
            'bio'             => $this->bio,
            'organization'    => $this->organization,
            'website'         => $this->website,
            'social_media'    => $this->social_media,
            'role'            => $this->getRoleName(),
            'is_active'       => (bool) $this->is_active,
            'is_investor'     => $this->isInvestor(),
            'is_business_owner' => $this->isBusinessOwner(),
            'is_community_contributor' => $this->isCommunityContributor(),
            'active_statuses' => $this->getActiveStatuses(),
            'badges'          => $this->getBadges(),
            'total_verifications_given' => $this->total_verifications_given ?? 0,
            'created_at'      => $this->created_at?->toISOString(),
        ];
    }
}
