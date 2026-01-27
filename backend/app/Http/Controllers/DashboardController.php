<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\Startup;
use App\Models\KnowledgeHub;
use App\Models\Event;
use App\Models\Mentor;
use App\Models\MentorshipRequest;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function overview()
    {
        $user = Auth::user();

        // Get all startup IDs that belong to this user
        $startupIds = Startup::where('user_id', $user->id)->pluck('id');

        return response()->json([
            'stats' => [
                'organizations' => Organization::count(),

                // startups owned by logged-in user
                'startups' => $startupIds->count(),

                'events' => Event::count(),
                'mentors' => Mentor::count(),
            ],

            // mentorship requests only for user's startups
            'mentor_requests' => [
                'pending' => MentorshipRequest::whereIn('startup_id', $startupIds)
                                ->where('status', 'pending')
                                ->count(),

                'accepted' => MentorshipRequest::whereIn('startup_id', $startupIds)
                                ->where('status', 'accepted')
                                ->count(),
            ],
        ]);
    }
}
