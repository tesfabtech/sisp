<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // -----------------------------
        // 1️⃣ Update challenge_status enum safely
        // -----------------------------
        DB::statement("
DO $$
BEGIN
    -- create new enum if not exists
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'challenge_status_new') THEN
        CREATE TYPE challenge_status_new AS ENUM ('pending','open','cancelled','closed');
    END IF;

    -- drop default temporarily
    ALTER TABLE challenges ALTER COLUMN status DROP DEFAULT;

    -- alter type
    ALTER TABLE challenges ALTER COLUMN status TYPE challenge_status_new USING status::text::challenge_status_new;

    -- set new default
    ALTER TABLE challenges ALTER COLUMN status SET DEFAULT 'pending';
END
$$;
        ");

        // Drop old enum if it exists (after the column type change)
        DB::statement("
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'challenge_status') THEN
        DROP TYPE challenge_status;
    END IF;
END
$$;
        ");

        // Rename new enum to original name
        DB::statement("ALTER TYPE challenge_status_new RENAME TO challenge_status;");

        // -----------------------------
        // 2️⃣ Modify table columns
        // -----------------------------
        Schema::table('challenges', function (Blueprint $table) {
            // Add participant_number
            $table->integer('participant_number')->nullable();

            // Add short_description
            $table->string('short_description')->nullable();

            // Soft deletes
            $table->softDeletes();

            // Remove eligibility if exists
            if (Schema::hasColumn('challenges', 'eligibility')) {
                $table->dropColumn('eligibility');
            }
        });
    }

    public function down(): void
    {
        Schema::table('challenges', function (Blueprint $table) {
            $table->dropColumn('participant_number');
            $table->dropColumn('short_description');
            $table->dropSoftDeletes();
            $table->text('eligibility')->nullable();
            $table->string('status')->default('open')->change();
        });

        // Enum rollback is tricky, usually ignored
    }
};
