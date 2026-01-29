<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChallengeApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'challenge_id',
        'startup_id',
        'submission_link',
        'status',
    ];

    public function challenge()
    {
        return $this->belongsTo(Challenge::class);
    }

    public function startup()
    {
        return $this->belongsTo(Startup::class);
    }
}
