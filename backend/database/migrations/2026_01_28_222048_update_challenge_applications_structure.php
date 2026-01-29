<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('challenge_applications', function (Blueprint $table) {

            // ADD required columns
            $table
                ->foreignId('organization_id')
                ->after('challenge_id')
                ->constrained()
                ->cascadeOnDelete();

            $table
                ->foreignId('user_id')
                ->after('organization_id')
                ->constrained()
                ->cascadeOnDelete();

            // REMOVE columns not in final design
            $table->dropForeign(['startup_id']);
            $table->dropColumn('startup_id');

            $table->dropColumn('submission_link');
        });
    }

    public function down(): void
    {
        Schema::table('challenge_applications', function (Blueprint $table) {

            // restore removed columns
            $table
                ->foreignId('startup_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('submission_link')->nullable();

            // remove added columns
            $table->dropForeign(['organization_id']);
            $table->dropColumn('organization_id');

            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
