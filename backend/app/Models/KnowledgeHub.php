<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class KnowledgeHub extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'image',
        'short_description',
        'description',
        'type',
        'max_read_time',
        'file_path',
        'status',
        'is_featured',
        'published_at',
    ];

    protected $casts = [
        'is_featured'   => 'boolean',
        'published_at'  => 'datetime',
    ];

    /**
     * Automatically generate slug from title
     */
    protected static function booted()
    {
        static::creating(function ($knowledge) {
            if (empty($knowledge->slug)) {
                $knowledge->slug = static::generateUniqueSlug($knowledge->title);
            }
        });

        static::updating(function ($knowledge) {
            if ($knowledge->isDirty('title')) {
                $knowledge->slug = static::generateUniqueSlug($knowledge->title, $knowledge->id);
            }
        });
    }

    /**
     * Generate a unique slug
     */
    protected static function generateUniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $slug = Str::slug($title);
        $original = $slug;
        $count = 1;

        while (
            static::where('slug', $slug)
            ->when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))
            ->exists()
        ) {
            $slug = $original . '-' . $count++;
        }

        return $slug;
    }
}
