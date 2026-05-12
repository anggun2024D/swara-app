<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();                              // integer, auto increment
            $table->uuid('user_id');                   // relasi ke users
            $table->uuid('report_id')->nullable();     // relasi ke reports (nullable)
            $table->string('type')->default('info');   // tipe notifikasi
            $table->string('title');                   // judul notifikasi
            $table->text('message');                   // isi pesan
            $table->boolean('is_read')->default(false);// status baca
            $table->timestamp('created_at')->useCurrent(); // tidak pakai updated_at

            // Foreign keys
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');

            $table->foreign('report_id')
                  ->references('id')
                  ->on('reports')
                  ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
