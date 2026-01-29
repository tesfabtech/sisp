<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\Request;

class EventApplicationController extends Controller
{
    public function store(Request $request, $eventId)
    {
        $user = $request->user();

        $event = Event::with('organization')->findOrFail($eventId);

        // prevent duplicate registration
        if (
            EventRegistration::where('event_id', $event->id)
            ->where('user_id', $user->id)
            ->exists()
        ) {
            return response()->json([
                'message' => 'Already registered for this event'
            ], 409);
        }

        EventRegistration::create([
            'event_id'        => $event->id,
            'organization_id' => $event->organization_id,
            'user_id'         => $user->id,
        ]);

        return response()->json([
            'message' => 'Event registration successful'
        ], 201);
    }
}
