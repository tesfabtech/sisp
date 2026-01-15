<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mentor extends Model
{
    protected $fillable = [
        'user_id',
        'profile_image',
        'title',
        'bio',
        'expertise',
        'industries',
        'is_available',
    ];

    protected $casts = [
        'expertise' => 'array',
        'industries' => 'array',
        'is_available' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
