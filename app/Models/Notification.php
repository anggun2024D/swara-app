<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    // Tabel ini tidak pakai updated_at
    public $timestamps = false;

    protected $table = 'notifications';

    protected $fillable = [
        'user_id',
        'report_id',
        'type',
        'title',
        'message',
        'is_read',
    ];

    protected function casts(): array
    {
        return [
            'is_read'    => 'boolean',
            'created_at' => 'datetime',
        ];
    }

    // Notifikasi dimiliki oleh 1 user
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Notifikasi terkait dengan 1 laporan
    public function report()
    {
        return $this->belongsTo(Report::class, 'report_id');
    }
}
