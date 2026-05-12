<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('no_telp')->nullable()->after('email');
            $table->string('alamat')->nullable()->after('no_telp');
            $table->string('foto')->nullable()->after('alamat');
        });
    }
};
