<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'startup_id',
        'mentor_id',
        'sender',
        'content',
    ];

    public function startup()
    {
        return $this->belongsTo(Startup::class);
    }

    public function mentor()
    {
        return $this->belongsTo(Mentor::class);
    }
}
