<?php


namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\Request;

class EventApplicationController extends Controller
{
public function store(Event $event, Request $request)
{
$user = $request->user();

if ($user->role !== 'startup') {
abort(403, 'Startup role required.');
}

$exists = EventRegistration::where('event_id', $event->id)
->where('user_id', $user->id)
->exists();

if ($exists) {
abort(409, 'Already applied.');
}

EventRegistration::create([
'event_id' => $event->id,
'organization_id' => $event->organization_id,
'user_id' => $user->id,
]);

return response()->json(['message' => 'Applied successfully'], 201);
}
}