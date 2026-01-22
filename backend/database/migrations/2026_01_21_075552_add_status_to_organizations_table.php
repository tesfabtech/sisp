<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Create ENUM type if it doesn't exist
        DB::statement("
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'organization_status') THEN
                    CREATE TYPE organization_status AS ENUM ('verified', 'pending', 'rejected');
                END IF;
            END$$;
        ");

        // Add status column with default 'pending'
        DB::statement("
            ALTER TABLE organizations
            ADD COLUMN status organization_status DEFAULT 'pending';
        ");
    }

    public function down(): void
    {
        // Remove column
        DB::statement("
            ALTER TABLE organizations
            DROP COLUMN IF EXISTS status;
        ");

        // Optional: drop enum type (if no other table uses it)
        DB::statement("
            DROP TYPE IF EXISTS organization_status;
        ");
    }
};
