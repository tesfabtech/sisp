<?php

namespace App\Models;

use App\Enums\MentorshipStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MentorshipRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'mentor_id',
        'startup_id',
        'status',
    ];

    protected $casts = [
        'status' => MentorshipStatus::class,
    ];

    public function mentor()
    {
        return $this->belongsTo(Mentor::class);
    }


    public function startup()
    {
        return $this->belongsTo(Startup::class);
    }

    public function sessions()
    {
        return $this->hasMany(MentorshipSession::class);
    }
}
