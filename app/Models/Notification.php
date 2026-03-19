<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $table = 'notifications';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'report_id',
        'type',
        'title',
        'message',
        'is_read',
    ];

    // === RELASI ===
    // Notifikasi ini untuk satu user
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Notifikasi ini terkait satu laporan
    public function report()
    {
        return $this->belongsTo(Report::class, 'report_id');
    }
}
