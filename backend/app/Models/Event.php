<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'title',
        'short_description', // ✅ ADD THIS
        'description',
        'event_type',
        'venue',
        'location',
        'event_datetime',
        'status',             // ✅ if you’re using it
    ];

    protected $casts = [
        'event_datetime' => 'datetime',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function registrations()
    {
        return $this->hasMany(EventRegistration::class);
    }
}
