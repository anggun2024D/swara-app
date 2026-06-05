<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Collaboration extends Model
{
    protected $table = 'collaborations';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'resource_id',
        'initiator_id',
        'target_id',
        'type',
        'message',
        'status',
        'responded_at',
    ];

    protected $casts = [
        'responded_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = Str::uuid()->toString();
            }
        });
    }

    public function resource()
    {
        return $this->belongsTo(EconomicResource::class, 'resource_id');
    }

    public function initiator()
    {
        return $this->belongsTo(User::class, 'initiator_id');
    }

    public function target()
    {
        return $this->belongsTo(User::class, 'target_id');
    }
}
