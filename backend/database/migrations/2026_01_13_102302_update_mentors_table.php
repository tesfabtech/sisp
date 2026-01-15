<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('mentors', function (Blueprint $table) {
            // Profile picture (store path or URL)
            $table->string('profile_image')->nullable()->after('user_id');

            // Mentor info
            $table->string('title')->nullable()->change();
            $table->text('bio')->nullable()->change();

            // UI-driven flexible fields
            $table->json('expertise')->nullable();
            $table->json('industries')->nullable();

            // Availability toggle
            $table->boolean('is_available')->default(true);
        });
    }

    public function down(): void
    {
        Schema::table('mentors', function (Blueprint $table) {
            $table->dropColumn([
                'profile_image',
                'expertise',
                'industries',
                'is_available',
            ]);
        });
    }
};
