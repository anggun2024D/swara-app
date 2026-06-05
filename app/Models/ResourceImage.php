<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResourceImage extends Model
{
    protected $table = 'resource_images';

    protected $fillable = [
        'resource_id',
        'image_url',
    ];

    public function resource()
    {
        return $this->belongsTo(EconomicResource::class, 'resource_id');
    }
}
