<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use App\Models\Event;
use App\Models\FundingOpportunity;

class OpportunityController extends Controller
{
    public function featured()
    {
        return response()->json([
            'challenges' => Challenge::with(['organization.user'])
                ->where('is_featured', true)
                ->where('status', 'open')
                ->get(),

            'events' => Event::with(['organization.user'])
                ->where('is_featured', true)
                ->where('status', 'published')
                ->get(),

            'funding' => FundingOpportunity::with(['organization.user'])
                ->where('is_featured', true)
                ->where('status', 'open')
                ->get(),
        ]);
    }

    public function show($type, $id)
    {
        switch ($type) {
            case 'challenges':
                $item = Challenge::with('organization.user')->find($id);
                break;
            case 'events':
                $item = Event::with('organization.user')->find($id);
                break;
            case 'funding':
                $item = FundingOpportunity::with('organization.user')->find($id);
                break;
            default:
                return response()->json(['message' => 'Invalid type'], 400);
        }

        if (!$item) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json($item);
    }
}
