<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReportImage extends Model
{
    // Tabel ini tidak pakai updated_at
    public $timestamps = false;

    protected $fillable = [
        'report_id',
        'image_url',
    ];

    // Foto dimiliki oleh 1 laporan
    public function report()
    {
        return $this->belongsTo(Report::class, 'report_id');
    }
}
