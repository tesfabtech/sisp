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
        Schema::create('funding_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('funding_opportunity_id')->constrained()->cascadeOnDelete();
            $table->foreignId('startup_id')->constrained()->cascadeOnDelete();
            $table->string('pitch_deck')->nullable();
            $table->timestamps();
        });

        DB::statement("ALTER TABLE funding_applications ADD COLUMN status funding_app_status DEFAULT 'submitted'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('funding_applications');
    }
};
