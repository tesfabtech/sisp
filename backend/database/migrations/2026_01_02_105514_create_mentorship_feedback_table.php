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
        Schema::create('mentorship_feedback', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_id')->constrained('mentorship_sessions')->cascadeOnDelete();
            $table->integer('rating')->check('rating BETWEEN 1 AND 5');
            $table->text('comment')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mentorship_feedback');
    }
};
