<?php

namespace App\Http\Controllers;

use App\Models\MentorshipRequest;
use App\Models\Startup;
use App\Models\Mentor;
use App\Enums\MentorshipStatus;
use Illuminate\Http\Request;

class MentorshipRequestController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Store a mentorship request (Startup → Mentor)
    |--------------------------------------------------------------------------
    | Rules enforced:
    | - User must choose a startup
    | - Startup must belong to user
    | - One startup can have ONLY ONE mentor (pending or accepted)
    | - Mentor can have many startups
    */
    public function store(Request $request)
    {
        $data = $request->validate([
            'mentor_id'  => ['required', 'exists:mentors,id'],
            'startup_id' => ['required', 'exists:startups,id'],
        ]);

        $user = $request->user();

        // Ensure startup belongs to the user
        $startup = Startup::where('id', $data['startup_id'])
            ->where('user_id', $user->id)
            ->first();

        if (!$startup) {
            return response()->json([
                'message' => 'Startup not found or does not belong to you.',
            ], 403);
        }

        $mentor = Mentor::find($data['mentor_id']);
        if (!$mentor) {
            return response()->json([
                'message' => 'Mentor not found.',
            ], 404);
        }

        // HARD RULE: one startup → one mentor (pending or accepted)
        $existingRequest = MentorshipRequest::where('startup_id', $startup->id)
            ->whereIn('status', [
                MentorshipStatus::PENDING,
                MentorshipStatus::ACCEPTED,
            ])
            ->exists();

        if ($existingRequest) {
            return response()->json([
                'message' => 'This startup already has a mentor or a pending request.',
            ], 409);
        }

        $mentorshipRequest = MentorshipRequest::create([
            'mentor_id'  => $mentor->id,
            'startup_id' => $startup->id,
            'status'     => MentorshipStatus::PENDING,
        ]);

        return response()->json([
            'message' => 'Mentorship request sent successfully.',
            'data'    => $mentorshipRequest,
        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | Startup: View ALL my sent requests (across all startups)
    |--------------------------------------------------------------------------
    */
    public function myRequests(Request $request)
    {
        $user = $request->user();

        $requests = MentorshipRequest::with([
            'mentor.user',
            'startup',
        ])
            ->whereHas('startup', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->latest()
            ->get();

        return response()->json($requests);
    }

    /*
    |--------------------------------------------------------------------------
    | Mentor: View incoming mentorship requests
    |--------------------------------------------------------------------------
    */
    public function mentorRequests(Request $request)
    {
        $user = $request->user();

        $mentor = Mentor::where('user_id', $user->id)->first();

        if (!$mentor) {
            return response()->json([
                'message' => 'Mentor profile not found.',
            ], 404);
        }

        $requests = MentorshipRequest::with([
            'startup.user',
        ])
            ->where('mentor_id', $mentor->id)
            ->latest()
            ->get();

        return response()->json($requests);
    }

    /*
    |--------------------------------------------------------------------------
    | Mentor: Accept or Reject a request
    |--------------------------------------------------------------------------
    | Extra safety:
    | - Prevent accepting if startup already has an accepted mentor
    */
    public function updateStatus(Request $request, $id)
    {
        $data = $request->validate([
            'status' => ['required', 'in:accepted,rejected'],
        ]);

        $user = $request->user();

        $mentor = Mentor::where('user_id', $user->id)->first();
        if (!$mentor) {
            return response()->json([
                'message' => 'Mentor profile not found.',
            ], 404);
        }

        $mentorshipRequest = MentorshipRequest::where('id', $id)
            ->where('mentor_id', $mentor->id)
            ->first();

        if (!$mentorshipRequest) {
            return response()->json([
                'message' => 'Request not found.',
            ], 404);
        }

        // Safety check when accepting
        if ($data['status'] === 'accepted') {
            $conflict = MentorshipRequest::where('startup_id', $mentorshipRequest->startup_id)
                ->where('status', MentorshipStatus::ACCEPTED)
                ->exists();

            if ($conflict) {
                return response()->json([
                    'message' => 'This startup already has an accepted mentor.',
                ], 409);
            }
        }

        $mentorshipRequest->update([
            'status' => $data['status'],
        ]);

        return response()->json([
            'message' => 'Request status updated.',
            'data'    => $mentorshipRequest,
        ]);
    }
}
