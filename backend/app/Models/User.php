<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Mass assignable attributes.
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'profile_photo',
        'role',
        'status',
    ];

    /**
     * Attributes hidden from JSON responses.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Attribute casting.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function startups()
    {
        return $this->hasMany(Startup::class);
    }

    public function mentor()
    {
        return $this->hasOne(Mentor::class);
    }
    /**
     * Organization account (one-to-one)
     */
    public function organization()
    {
        return $this->hasOne(Organization::class);
    }

// Added relationships for applications and registrations
    public function challengeApplications()
    {
        return $this->hasMany(ChallengeApplication::class);
    }

    public function fundingApplications()
    {
        return $this->hasMany(FundingApplication::class);
    }

    public function eventRegistrations()
    {
        return $this->hasMany(EventRegistration::class);
    }
}
