<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mentorship_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mentorship_request_id')->constrained()->cascadeOnDelete();
            $table->timestamp('scheduled_at')->nullable();
            $table->text('notes')->nullable();
        });

        DB::statement("ALTER TABLE mentorship_sessions ADD COLUMN mode session_mode");
        DB::statement("ALTER TABLE mentorship_sessions ADD COLUMN status session_status DEFAULT 'scheduled'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mentorship_sessions');
    }
};
