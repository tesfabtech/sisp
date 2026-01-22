<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('organizations', function (Blueprint $table) {
            // Add user ownership
            $table->foreignId('user_id')
                ->after('id')
                ->constrained('users')
                ->cascadeOnDelete();

            // Remove old name column
            $table->dropColumn('name');

            // Add profile fields
            $table->text('description')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('phone', 30)->nullable();
            $table->string('address')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('organizations', function (Blueprint $table) {
            // Restore name
            $table->string('name');

            // Drop added columns
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
            $table->dropColumn([
                'description',
                'cover_image',
                'phone',
                'address',
            ]);
        });
    }
};
