<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
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
        'foto_url',
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

    // =============================================
    // WAJIB UNTUK JWT
    // =============================================
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    // =============================================
    // RELASI
    // =============================================
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
}
