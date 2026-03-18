<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Report extends Model
{
    use SoftDeletes;

    // Beritahu Laravel bahwa
    // primary key berbentuk UUID bukan angka
    protected $keyType = 'string';
    public $incrementing = false;

    // Kolom yang boleh diisi
    protected $fillable = [
        'user_id',
        'category_id',
        'judul',
        'deskripsi',
        'latitude',
        'longitude',
        'address',
        'status',
        'priority',
    ];

    // Otomatis generate UUID
    // setiap kali data baru dibuat
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->id = Str::uuid();
        });
    }

    // Laporan dimiliki oleh 1 user
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Laporan punya 1 kategori
    public function category()
    {
        return $this->belongsTo(
            ReportCategory::class,
            'category_id'
        );
    }

    // Laporan bisa punya banyak foto
    public function images()
    {
        return $this->hasMany(ReportImage::class, 'report_id');
    }

    // Laporan punya riwayat status
    public function statusLogs()
    {
        return $this->hasMany(
            ReportStatusLog::class,
            'report_id'
        );
    }
}
