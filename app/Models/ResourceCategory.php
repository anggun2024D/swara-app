<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResourceCategory extends Model
{
    protected $table = 'resource_categories';
    protected $primaryKey = 'id';

    protected $fillable = [
        'name',
        'slug',
        'icon',
        'color',
        'description',
    ];

    public function resources()
    {
        return $this->hasMany(EconomicResource::class, 'category_id');
    }
}
