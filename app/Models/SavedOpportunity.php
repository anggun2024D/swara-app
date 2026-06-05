<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavedOpportunity extends Model
{
    protected $table = 'saved_opportunities';

    protected $fillable = [
        'user_id',
        'resource_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function resource()
    {
        return $this->belongsTo(EconomicResource::class, 'resource_id');
    }
}
