<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        /*
        |--------------------------------------------------------------------------
        | 1. Ensure event_status ENUM exists
        |--------------------------------------------------------------------------
        */
        DB::statement("
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_status') THEN
                CREATE TYPE event_status AS ENUM (
                    'pending',
                    'published',
                    'cancelled',
                    'completed'
                );
            END IF;
        END $$;
        ");

        /*
        |--------------------------------------------------------------------------
        | 2. Add 'training' to event_type ENUM
        |--------------------------------------------------------------------------
        */
        DB::statement("
            ALTER TYPE event_type
            ADD VALUE IF NOT EXISTS 'training'
        ");

        /*
        |--------------------------------------------------------------------------
        | 3. Modify events table
        |--------------------------------------------------------------------------
        */
        Schema::table('events', function (Blueprint $table) {
            $table->string('short_description', 255)
                ->nullable()
                ->after('title');

            $table->softDeletes(); // adds deleted_at
        });

        DB::statement("
            ALTER TABLE events
            ADD COLUMN status event_status NOT NULL DEFAULT 'pending'
        ");
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            if (Schema::hasColumn('events', 'short_description')) {
                $table->dropColumn('short_description');
            }

            if (Schema::hasColumn('events', 'deleted_at')) {
                $table->dropSoftDeletes();
            }
        });

        DB::statement("
            ALTER TABLE events
            DROP COLUMN IF EXISTS status
        ");

        // ENUM rollback intentionally omitted (PostgreSQL best practice)
    }
};
