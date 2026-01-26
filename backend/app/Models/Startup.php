<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Startup extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'name',
        'logo',
        'cover_image',
        'video_url',
        'website',
        'tagline',
        'description',
        'industry',
        'stage',
        'problem_statement',
        'solution_statement',
        'location',
        'team_size',
        'founded_year',
        'status',
        'featured',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // ✅ Add this relationship to fix 500 error
    public function mentorshipRequests()
    {
        return $this->hasMany(MentorshipRequest::class);
    }
    
}
