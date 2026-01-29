<?php

namespace App\Http\Controllers;

use App\Models\FundingOpportunity;
use App\Models\FundingApplication;
use Illuminate\Http\Request;

class FundingApplicationController extends Controller
{
    public function store(Request $request, $fundingId)
    {
        $user = $request->user();

        $request->validate([
            'startup_id' => 'nullable|exists:startups,id',
            'pitch_deck' => 'required|string',
        ]);

        $funding = FundingOpportunity::with('organization')->findOrFail($fundingId);

        if (
            FundingApplication::where('funding_id', $funding->id)
            ->where('user_id', $user->id)
            ->exists()
        ) {
            return response()->json([
                'message' => 'You already applied for this funding'
            ], 409);
        }

        FundingApplication::create([
            'funding_id'      => $funding->id,
            'organization_id' => $funding->organization_id,
            'user_id'         => $user->id,
            'startup_id'      => $request->startup_id,
            'pitch_deck'      => $request->pitch_deck,
            'status'          => 'submitted',
        ]);

        return response()->json([
            'message' => 'Funding application submitted'
        ], 201);
    }
}
