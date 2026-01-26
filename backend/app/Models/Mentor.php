<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Mentor extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'profile_image',
        'title',
        'bio',
        'expertise',
        'industries',
        'is_available',
        'status',      // ✅ REQUIRED
        'featured',    // ✅ OPTIONAL but recommended
    ];

    protected $casts = [
        'expertise' => 'array',
        'industries' => 'array',
        'is_available' => 'boolean',
        'featured' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function mentorshipRequests()
{
    return $this->hasMany(MentorshipRequest::class);
}
}
