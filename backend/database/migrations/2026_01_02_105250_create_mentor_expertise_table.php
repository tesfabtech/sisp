<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mentor_expertise', function (Blueprint $table) {
            $table->foreignId('mentor_id')->constrained()->cascadeOnDelete();
            $table->foreignId('expertise_id')->constrained('expertise')->cascadeOnDelete();
            $table->primary(['mentor_id', 'expertise_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mentor_expertise');
    }
};
