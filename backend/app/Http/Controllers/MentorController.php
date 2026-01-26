<?php

namespace App\Http\Controllers;

use App\Models\Mentor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\Startup;
use App\Enums\MentorshipStatus;

class MentorController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | PUBLIC: List all mentors (startup browsing)
    |--------------------------------------------------------------------------
    */
    public function index()
    {
        $mentors = Mentor::leftJoin('users', 'mentors.user_id', '=', 'users.id')
            ->select(
                'mentors.id',
                'mentors.title',
                'mentors.industries',
                'mentors.is_available',
                'users.first_name',
                'users.last_name',
                'users.profile_photo'
            )
            ->get()
            ->map(function ($mentor) {
                return [
                    'id' => $mentor->id,
                    'name' => trim(($mentor->first_name ?? '') . ' ' . ($mentor->last_name ?? '')),
                    'title' => $mentor->title,
                    'profile_photo' => $mentor->profile_photo,
                    'industries' => is_array($mentor->industries)
                        ? $mentor->industries
                        : json_decode($mentor->industries ?? '[]', true),
                    'is_available' => $mentor->is_available,
                ];
            });

        return response()->json($mentors);
    }


    /*
    |--------------------------------------------------------------------------
    | Protected: Show current mentor profile
    |--------------------------------------------------------------------------
    */
    public function show()
    {
        return Mentor::where('user_id', Auth::id())->first();
    }

    /*
    |--------------------------------------------------------------------------
    | Protected: Store or update mentor profile
    |--------------------------------------------------------------------------
    */
    public function storeOrUpdate(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'expertise' => 'nullable|array',
            'expertise.*' => 'string|max:255',
            'industries' => 'nullable|array',
            'industries.*' => 'string|max:255',
            'is_available' => 'required|in:0,1',
            'profile_image' => 'nullable|image|max:2048',
        ]);

        $mentor = Mentor::firstOrCreate(
            ['user_id' => Auth::id()],
            ['is_available' => true]
        );

        if ($request->hasFile('profile_image')) {
            // delete old mentor image
            if ($mentor->profile_image) {
                Storage::disk('public')->delete($mentor->profile_image);
            }

            // store new image
            $path = $request->file('profile_image')->store('mentors', 'public');

            // save on mentor
            $validated['profile_image'] = $path;

            // ✅ THIS IS THE IMPORTANT PART
            $mentor->user->update([
                'profile_photo' => $path,
            ]);
        }

        $mentor->update($validated);

        return response()->json([
            'message' => 'Mentor profile updated successfully',
            'mentor' => $mentor,
        ]);
    }

    
public function myAcceptedStartups(Request $request)
{
    $mentor = Mentor::where('user_id', $request->user()->id)->firstOrFail();

    $startups = Startup::whereHas('mentorshipRequests', function ($q) use ($mentor) {
            $q->where('mentor_id', $mentor->id)
              ->where('status', MentorshipStatus::ACCEPTED);
        })
        ->with([
            'user:id,first_name,last_name',
            'mentorshipRequests' => function ($q) use ($mentor) {
                $q->where('mentor_id', $mentor->id)
                  ->where('status', MentorshipStatus::ACCEPTED);
            }
        ])
        ->get()
        ->map(function ($startup) {
            return [
                'id' => $startup->id,
                'name' => $startup->name,
                'owner' => [
                    'name' => $startup->user->first_name . ' ' . $startup->user->last_name,
                ],
            ];
        });

    return response()->json($startups);
}
}
