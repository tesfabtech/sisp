<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1
                    FROM pg_enum
                    JOIN pg_type ON pg_enum.enumtypid = pg_type.oid
                    WHERE pg_type.typname = 'event_venue'
                    AND enumlabel = 'hybrid'
                ) THEN
                    ALTER TYPE event_venue ADD VALUE 'hybrid';
                END IF;
            END $$;
        ");
    }

    public function down(): void
    {
        // PostgreSQL does NOT support removing enum values safely
    }
};
