<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MentorshipFeedback extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'rating',
        'comment',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];

    public function session()
    {
        return $this->belongsTo(MentorshipSession::class);
    }
}
