<?php

namespace App\Models;

use App\Enums\MentorshipStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MentorshipRequest extends Model
{
    use HasFactory;

    /**
     * Mass assignable attributes
     */
    protected $fillable = [
        'mentor_id',
        'startup_id',
        'status',
    ];

    /**
     * Attribute casting
     */
    protected $casts = [
        'status' => MentorshipStatus::class,
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    /**
     * The mentor being requested
     */
    public function mentor()
    {
        return $this->belongsTo(Mentor::class);
    }

    /**
     * The startup requesting mentorship
     */
    public function startup()
    {
        return $this->belongsTo(Startup::class);
    }

    /**
     * Mentorship sessions under this request
     */
    public function sessions()
    {
        return $this->hasMany(MentorshipSession::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Query Scopes (optional but professional)
    |--------------------------------------------------------------------------
    */

    public function scopePending($query)
    {
        return $query->where('status', MentorshipStatus::PENDING);
    }

    public function scopeAccepted($query)
    {
        return $query->where('status', MentorshipStatus::ACCEPTED);
    }
}
