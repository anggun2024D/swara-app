<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReportStatusLog extends Model
{
    protected $table = 'report_status_logs';

    public $timestamps = false;

    protected $fillable = [
        'report_id',
        'old_status',
        'new_status',
        'changed_by',
        'note',
    ];

    // === RELASI ===
    // Log ini milik satu laporan
    public function report()
    {
        return $this->belongsTo(Report::class, 'report_id');
    }

    // Log ini dibuat oleh satu user
    public function changedBy()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
