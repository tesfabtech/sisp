<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MentorshipSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'mentorship_request_id',
        'scheduled_at',
        'mode',
        'notes',
        'status',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
    ];

    public function mentorshipRequest()
    {
        return $this->belongsTo(MentorshipRequest::class);
    }

    public function feedback()
    {
        return $this->hasOne(MentorshipFeedback::class);
    }
}
