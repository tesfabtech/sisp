<?php

namespace App\Http\Controllers;

use App\Models\Mentor;
use App\Models\MentorshipRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MentorOverviewController extends Controller
{
    public function overview()
    {
        $mentor = Mentor::where('user_id', Auth::id())->firstOrFail();

        return response()->json([
            'available' => $mentor->is_available,

            'stats' => [
                'new_requests' => MentorshipRequest::where('mentor_id', $mentor->id)
                    ->where('status', 'pending')
                    ->count(),

                'active' => MentorshipRequest::where('mentor_id', $mentor->id)
                    ->where('status', 'accepted')
                    ->count(),

                'industries' => is_array($mentor->industries)
                    ? count($mentor->industries)
                    : 0,

                'expertise' => is_array($mentor->expertise)
                    ? count($mentor->expertise)
                    : 0,
            ],

           
        ]);
    }

    public function toggleAvailability()
    {
        $mentor = Mentor::where('user_id', Auth::id())->firstOrFail();
        $mentor->update(['is_available' => !$mentor->is_available]);

        return response()->json([
            'available' => $mentor->is_available,
        ]);
    }
}
