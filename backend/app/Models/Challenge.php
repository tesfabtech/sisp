<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Challenge extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'title',
        'short_description', // new
        'description',
        'type',
        'deadline',
        'award',
        'status',            // updated enum: pending, open, cancelled, closed
        'participant_number', // new
    ];

    protected $casts = [
        'deadline' => 'date',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function applications()
    {
        return $this->hasMany(ChallengeApplication::class);
    }
}
