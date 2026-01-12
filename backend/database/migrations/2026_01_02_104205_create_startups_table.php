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
        Schema::create('startups', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('name');

            $table->string('logo')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('video_url')->nullable();
            $table->string('website')->nullable();
            $table->string('tagline')->nullable();

            $table->text('description')->nullable();
            $table->string('industry', 100)->nullable();

            $table->text('problem_statement')->nullable();
            $table->text('solution_statement')->nullable();

            $table->string('location')->nullable();
            $table->integer('team_size')->nullable();
            $table->integer('founded_year')->nullable();

            $table->timestamps();
        });

        // PostgreSQL ENUM columns
        DB::statement("ALTER TABLE startups ADD COLUMN stage startup_stage");
        DB::statement("ALTER TABLE startups ADD COLUMN status startup_status DEFAULT 'pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('startups');
    }
};
