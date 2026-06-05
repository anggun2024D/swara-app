<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_investor')->default(false)->after('social_media');
            $table->integer('total_verifications_given')->default(0)->after('is_investor');
        });

        Schema::table('economic_resources', function (Blueprint $table) {
            $table->tinyInteger('verification_level')->default(1)->after('community_verified');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['is_investor', 'total_verifications_given']);
        });
        Schema::table('economic_resources', function (Blueprint $table) {
            $table->dropColumn('verification_level');
        });
    }
};
