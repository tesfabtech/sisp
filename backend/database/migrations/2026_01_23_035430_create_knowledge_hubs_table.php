<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('knowledge_hubs', function (Blueprint $table) {
            $table->id();

            $table->string('title');
            $table->string('slug')->unique();

            $table->string('image')->nullable();
            $table->text('short_description');
            $table->longText('description');

            $table->enum('type', [
                'startup',
                'funding',
                'marketing',
                'product',
                'technology',
                'legal',
                'finance',
                'operations',
                'leadership',
                'design',
                'ai',
                'general',
            ]);

            $table->integer('max_read_time')->nullable();

            // PDF file only
            $table->string('file_path')->nullable();

            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->boolean('is_featured')->default(false);
            $table->timestamp('published_at')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('knowledge_hubs');
    }
};
