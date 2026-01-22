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
        Schema::table('funding_opportunities', function (Blueprint $table) {
            // Short description
            $table->string('short_description')->nullable()->after('title');

            // Application number
            $table->unsignedInteger('application_number')->default(0)->after('deadline');

            // Funding type
            $table->enum('funding_type', [
                'grant',
                'equity',
                'loan',
                'convertible_note'
            ])->after('amount');

            // Status
            $table->enum('status', [
                'pending',
                'open',
                'closed',
                'cancelled'
            ])->default('pending')->after('funding_type');

            // Soft deletes
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('funding_opportunities', function (Blueprint $table) {
            $table->dropColumn([
                'short_description',
                'application_number',
                'funding_type',
                'status'
            ]);

            $table->dropSoftDeletes();
        });
    }
};
