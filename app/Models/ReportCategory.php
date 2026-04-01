<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReportCategory extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'name',
        'icon_url',
        'is_active',
    ];

    // Kategori bisa punya banyak laporan
    public function reports()
    {
        return $this->hasMany(Report::class, 'category_id');
    }
}
