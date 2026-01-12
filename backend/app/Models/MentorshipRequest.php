<?php

namespace App\Models;

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
