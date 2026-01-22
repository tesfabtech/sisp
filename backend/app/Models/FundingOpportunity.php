<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FundingOpportunity extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'title',
        'short_description',
        'description',
        'deadline',
        'amount',
        'application_number',
        'funding_type',
        'status',
    ];

    protected $casts = [
        'deadline' => 'date',
        'amount' => 'decimal:2',
        'application_number' => 'integer',
    ];

    /* ---------------- RELATIONSHIPS ---------------- */

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function applications()
    {
        return $this->hasMany(FundingApplication::class, 'funding_id');
    }
}
