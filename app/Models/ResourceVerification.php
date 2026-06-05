<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ResourceVerification extends Model
{
    protected $table = 'resource_verifications';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'resource_id',
        'user_id',
        'type',
        'rating',
        'review',
    ];

    protected $casts = [
        'rating' => 'integer',
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

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
