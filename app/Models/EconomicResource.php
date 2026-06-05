<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class EconomicResource extends Model
{
    use SoftDeletes;

    protected $table = 'economic_resources';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'category_id',
        'resource_name',
        'description',
        'latitude',
        'longitude',
        'address',
        'province',
        'city',
        'business_scale',
        'monthly_capacity',
        'investment_needed',
        'collaboration_needed',
        'verification_score',
        'community_verified',
        'verification_level',
        'opportunity_status',
        'contact_information',
        'website',
        'social_media',
        'view_count',
        'status',
        'admin_notes',
    ];

    protected $casts = [
        'social_media'       => 'array',
        'community_verified' => 'boolean',
        'investment_needed'  => 'decimal:2',
        'verification_score' => 'integer',
        'verification_level' => 'integer',
        'view_count'         => 'integer',
        'latitude'           => 'float',
        'longitude'          => 'float',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = Str::uuid()->toString();
            }
            // Default: langsung aktif (tanpa admin review)
            if (empty($model->status)) {
                $model->status = 'active';
            }
            // Default: Level 1 (Terdaftar)
            if (empty($model->verification_level)) {
                $model->verification_level = 1;
            }
        });
    }

    // Relationships
    public function contributor()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function category()
    {
        return $this->belongsTo(ResourceCategory::class, 'category_id');
    }

    public function images()
    {
        return $this->hasMany(ResourceImage::class, 'resource_id');
    }

    public function verifications()
    {
        return $this->hasMany(ResourceVerification::class, 'resource_id');
    }

    public function collaborations()
    {
        return $this->hasMany(Collaboration::class, 'resource_id');
    }

    public function savedBy()
    {
        return $this->hasMany(SavedOpportunity::class, 'resource_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeByProvince($query, $province)
    {
        return $query->where('province', $province);
    }

    public function scopeByOpportunityStatus($query, $status)
    {
        return $query->where('opportunity_status', $status);
    }

    // ── Verification Level Helpers ────────────────────────────
    public function getVerificationLevelLabel(): string
    {
        return \App\Services\VerificationService::getLevelInfo($this->verification_level)['label'] ?? 'Terdaftar';
    }

    public function getVerificationLevelIcon(): string
    {
        return \App\Services\VerificationService::getLevelInfo($this->verification_level)['icon'] ?? '📋';
    }
}
