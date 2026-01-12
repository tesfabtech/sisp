<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FundingApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'funding_id',
        'startup_id',
        'pitch_deck',
        'status',
    ];

    public function funding()
    {
        return $this->belongsTo(FundingOpportunity::class, 'funding_id');
    }

    public function startup()
    {
        return $this->belongsTo(Startup::class);
    }
}
