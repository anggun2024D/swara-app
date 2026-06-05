<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('collaborations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('resource_id');
            $table->uuid('initiator_id');
            $table->uuid('target_id');
            $table->enum('type', ['investasi', 'distribusi', 'supply', 'kemitraan', 'ekspansi']);
            $table->text('message');
            $table->enum('status', ['pending', 'accepted', 'rejected', 'cancelled'])->default('pending');
            $table->timestamp('responded_at')->nullable();
            $table->timestamps();

            $table->foreign('resource_id')->references('id')->on('economic_resources')->onDelete('cascade');
            $table->foreign('initiator_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('target_id')->references('id')->on('users')->onDelete('cascade');
            $table->index('status');
            $table->index('initiator_id');
            $table->index('target_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('collaborations');
    }
};
