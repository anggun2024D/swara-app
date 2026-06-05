<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resource_verifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('resource_id');
            $table->uuid('user_id');
            $table->enum('type', ['support', 'verify', 'rate', 'review']);
            $table->tinyInteger('rating')->unsigned()->nullable();
            $table->text('review')->nullable();
            $table->timestamps();

            $table->foreign('resource_id')->references('id')->on('economic_resources')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->unique(['user_id', 'resource_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resource_verifications');
    }
};
