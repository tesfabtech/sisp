<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expertise extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function mentors()
    {
        return $this->belongsToMany(
            Mentor::class,
            'mentor_expertise',
            'expertise_id',
            'mentor_id'
        );
    }
}
