<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            ALTER TYPE user_role
            ADD VALUE IF NOT EXISTS 'super_admin'
        ");
    }

    public function down(): void
    {
        // PostgreSQL does NOT support removing ENUM values safely
        // Intentionally left empty
    }
};
