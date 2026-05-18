<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;                        // ← pastikan ada ini!
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    // ← Wajib ada! Beritahu Laravel pakai UUID
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
    ];

    protected $hidden = [
        'password_hash',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at'     => 'datetime',
            'dark_mode'             => 'boolean',
            'notifications_enabled' => 'boolean',
            'is_active'             => 'boolean',
        ];
    }

    // ← Wajib ada! Generate UUID otomatis
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

    // Relasi
    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function sessions()
    {
        return $this->hasMany(UserSession::class, 'user_id');
    }

    public function reports()
    {
        return $this->hasMany(Report::class, 'user_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class, 'user_id');
    }

    public function getAuthPassword()
    {
        return $this->password_hash;
    }
}
