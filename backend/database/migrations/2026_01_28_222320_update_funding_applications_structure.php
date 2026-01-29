<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('funding_applications', function (Blueprint $table) {

            // RENAME funding_opportunity_id → funding_id
            $table->renameColumn('funding_opportunity_id', 'funding_id');

            // ADD required relations
            $table
                ->foreignId('organization_id')
                ->after('funding_id')
                ->constrained()
                ->cascadeOnDelete();

            $table
                ->foreignId('user_id')
                ->after('organization_id')
                ->constrained()
                ->cascadeOnDelete();

            // MAKE startup_id optional
            $table->foreignId('startup_id')->nullable()->change();
        });

        // Prevent duplicate applications
        Schema::table('funding_applications', function (Blueprint $table) {
            $table->unique(['user_id', 'funding_id'], 'unique_user_funding_application');
        });
    }

    public function down(): void
    {
        Schema::table('funding_applications', function (Blueprint $table) {

            // revert uniqueness
            $table->dropUnique('unique_user_funding_application');

            // revert startup_id
            $table->foreignId('startup_id')->nullable(false)->change();

            // drop added columns
            $table->dropForeign(['organization_id']);
            $table->dropColumn('organization_id');

            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');

            // revert column name
            $table->renameColumn('funding_id', 'funding_opportunity_id');
        });
    }
};
