<?php

namespace App\Http\Controllers;

use App\Models\MentorshipRequest;
use App\Models\Startup;
use App\Models\Mentor;
use Illuminate\Http\Request;

class MentorshipRequestController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Store a mentorship request (Startup → Mentor)
    |--------------------------------------------------------------------------
    */
    public function store(Request $request)
    {
        $data = $request->validate([
            'mentor_id' => 'required|exists:mentors,id',
        ]);

        $user = $request->user();

        $startup = Startup::where('user_id', $user->id)->first();

        if (!$startup) {
            return response()->json([
                'message' => 'Startup not found. Please create a startup profile first.',
            ], 404);
        }

        $mentor = Mentor::find($data['mentor_id']);
        if (!$mentor) {
            return response()->json([
                'message' => 'Mentor not found.',
            ], 404);
        }

        $alreadyRequested = MentorshipRequest::where('mentor_id', $mentor->id)
            ->where('startup_id', $startup->id)
            ->whereIn('status', ['pending', 'accepted'])
            ->exists();

        if ($alreadyRequested) {
            return response()->json([
                'message' => 'You have already sent a request to this mentor.',
            ], 409);
        }

        $mentorshipRequest = MentorshipRequest::create([
            'mentor_id'  => $mentor->id,
            'startup_id' => $startup->id,
            'status'     => 'pending',
        ]);

        return response()->json([
            'message' => 'Mentorship request sent successfully.',
            'data'    => $mentorshipRequest,
        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | Startup: View my sent requests
    |--------------------------------------------------------------------------
    */
    public function myRequests(Request $request)
    {
        $user = $request->user();

        $startup = Startup::where('user_id', $user->id)->first();

        if (!$startup) {
            return response()->json([
                'message' => 'Startup not found.',
            ], 404);
        }

        $requests = MentorshipRequest::with(['mentor.user'])
            ->where('startup_id', $startup->id)
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

        $requests = MentorshipRequest::with(['startup.user'])
            ->where('mentor_id', $mentor->id)
            ->latest()
            ->get();

        return response()->json($requests);
    }

    /*
    |--------------------------------------------------------------------------
    | Mentor: Accept or Reject a request
    |--------------------------------------------------------------------------
    */
    public function updateStatus(Request $request, $id)
    {
        $data = $request->validate([
            'status' => 'required|in:accepted,rejected',
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

        $mentorshipRequest->update([
            'status' => $data['status'],
        ]);

        return response()->json([
            'message' => 'Request status updated.',
            'data'    => $mentorshipRequest,
        ]);
    }
}
