<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'logo',
        'website',
    ];

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
