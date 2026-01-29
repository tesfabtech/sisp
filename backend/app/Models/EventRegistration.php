<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventRegistration extends Model
{
    use HasFactory;

    public $timestamps = false; // important: table does NOT use created_at/updated_at

    protected $fillable = [
        'event_id',
        'organization_id',
        'user_id',
        'registered_at',
    ];

    /* =====================
       Relationships
    ===================== */

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
