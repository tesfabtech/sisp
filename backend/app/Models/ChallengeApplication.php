<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChallengeApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'challenge_id',
        'organization_id',
        'user_id',
        'status',
    ];

    /* =====================
       Relationships
    ===================== */

    public function challenge()
    {
        return $this->belongsTo(Challenge::class);
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
