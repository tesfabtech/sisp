<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FundingApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'funding_id',
        'organization_id',
        'user_id',
        'startup_id',
        'pitch_deck',
        'status',
    ];

    /* =========================
       RELATIONSHIPS
    ========================= */

    public function funding()
    {
        return $this->belongsTo(FundingOpportunity::class, 'funding_id');
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function startup()
    {
        return $this->belongsTo(Startup::class);
    }
}
