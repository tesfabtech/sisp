<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'description',
        'logo',
        'cover_image',
        'website',
        'phone',
        'address',
        'status',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function challenges()
    {
        return $this->hasMany(Challenge::class);
    }

    public function events()
    {
        return $this->hasMany(Event::class);
    }

    public function fundingOpportunities()
    {
        return $this->hasMany(FundingOpportunity::class);
    }
}
