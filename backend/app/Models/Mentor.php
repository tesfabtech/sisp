<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mentor extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'bio',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function expertise()
    {
        return $this->belongsToMany(
            Expertise::class,
            'mentor_expertise',
            'mentor_id',
            'expertise_id'
        );
    }

    public function mentorshipRequests()
    {
        return $this->hasMany(MentorshipRequest::class);
    }
}
