<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSession extends Model
{
    protected $table = 'user_sessions';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'device_info',
        'ip_address',
        'last_activity',
        'expired_at',
    ];

    // === RELASI ===
    // Sesi ini milik satu user
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
