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
        Schema::create('startup_team_members', function (Blueprint $table) {
            $table->id();

            $table->foreignId('startup_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('name');
            $table->string('role', 100)->nullable();
            $table->string('email')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('startup_team_members');
    }
};
