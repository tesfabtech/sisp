<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('challenges', function (Blueprint $table) {
            if (!Schema::hasColumn('challenges', 'is_featured')) {
                $table
                    ->boolean('is_featured')
                    ->default(false)
                    ->after('status'); // adjust position if needed
            }
        });
    }

    public function down(): void
    {
        Schema::table('challenges', function (Blueprint $table) {
            if (Schema::hasColumn('challenges', 'is_featured')) {
                $table->dropColumn('is_featured');
            }
        });
    }
};
