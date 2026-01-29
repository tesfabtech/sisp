<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use App\Models\ChallengeApplication;
use Illuminate\Http\Request;

class ChallengeApplicationController extends Controller
{
    public function store(Request $request, $challengeId)
    {
        $user = $request->user();

        $challenge = Challenge::with('organization')->findOrFail($challengeId);

        if (
            ChallengeApplication::where('challenge_id', $challenge->id)
            ->where('user_id', $user->id)
            ->exists()
        ) {
            return response()->json([
                'message' => 'You already applied to this challenge'
            ], 409);
        }

        ChallengeApplication::create([
            'challenge_id'    => $challenge->id,
            'organization_id' => $challenge->organization_id,
            'user_id'         => $user->id,
            'status'          => 'submitted',
        ]);

        return response()->json([
            'message' => 'Challenge application submitted'
        ], 201);
    }
}
