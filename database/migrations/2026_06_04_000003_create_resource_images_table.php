<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resource_images', function (Blueprint $table) {
            $table->id();
            $table->uuid('resource_id');
            $table->string('image_url');
            $table->timestamps();

            $table->foreign('resource_id')->references('id')->on('economic_resources')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resource_images');
    }
};
