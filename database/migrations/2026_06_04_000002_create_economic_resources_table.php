<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('economic_resources', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->tinyInteger('category_id')->unsigned();
            $table->string('resource_name');
            $table->text('description');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('address', 500)->nullable();
            $table->string('province', 100)->nullable();
            $table->string('city', 100)->nullable();
            $table->enum('business_scale', ['mikro', 'kecil', 'menengah', 'besar'])->default('mikro');
            $table->string('monthly_capacity')->nullable();
            $table->decimal('investment_needed', 15, 2)->nullable();
            $table->text('collaboration_needed')->nullable();
            $table->integer('verification_score')->default(0);
            $table->boolean('community_verified')->default(false);
            $table->enum('opportunity_status', [
                'aktif', 'mencari_investor', 'mencari_distributor',
                'mencari_supplier', 'mencari_mitra', 'ekspansi'
            ])->default('aktif');
            $table->string('contact_information')->nullable();
            $table->string('website')->nullable();
            $table->json('social_media')->nullable();
            $table->integer('view_count')->default(0);
            $table->enum('status', ['pending', 'active', 'rejected'])->default('pending');
            $table->text('admin_notes')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('resource_categories');
            $table->index('category_id');
            $table->index('province');
            $table->index('city');
            $table->index('opportunity_status');
            $table->index('business_scale');
            $table->index('status');
            $table->index(['latitude', 'longitude']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('economic_resources');
    }
};
