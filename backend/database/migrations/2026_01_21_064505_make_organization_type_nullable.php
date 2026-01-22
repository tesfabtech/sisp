<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Make type nullable
        DB::statement("
            ALTER TABLE organizations
            ALTER COLUMN type DROP NOT NULL
        ");

        // Optional: set a default value
        DB::statement("
            ALTER TABLE organizations
            ALTER COLUMN type SET DEFAULT 'ngo'
        ");
    }

    public function down(): void
    {
        // Remove default
        DB::statement("
            ALTER TABLE organizations
            ALTER COLUMN type DROP DEFAULT
        ");

        // Restore NOT NULL constraint
        DB::statement("
            ALTER TABLE organizations
            ALTER COLUMN type SET NOT NULL
        ");
    }
};
