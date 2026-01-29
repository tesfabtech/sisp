<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Event;
use App\Models\Challenge;
use App\Models\FundingOpportunity;

class OrganizationOverviewController extends Controller
{
    /**
     * Organization dashboard overview
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'organization' || !$user->organization) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $orgId = $user->organization->id;

        // KPI counts
        $totalEvents = Event::where('organization_id', $orgId)->count();
        $totalChallenges = Challenge::where('organization_id', $orgId)->count();
        $totalFunding = FundingOpportunity::where('organization_id', $orgId)->count();

        // Pending logic (based on status enums)
        $pendingChallenges = Challenge::where('organization_id', $orgId)
            ->where('status', 'open')
            ->count();

        // Recent activity (merged & normalized)
        $recentEvents = Event::where('organization_id', $orgId)
            ->latest()
            ->take(3)
            ->get()
            ->map(fn ($e) => [
                'title' => $e->title,
                'created_at' => $e->created_at,
                'status' => 'approved',
            ]);

        $recentChallenges = Challenge::where('organization_id', $orgId)
            ->latest()
            ->take(3)
            ->get()
            ->map(fn ($c) => [
                'title' => $c->title,
                'created_at' => $c->created_at,
                'status' => $c->status === 'open' ? 'pending' : 'approved',
            ]);

        $recentFunding = FundingOpportunity::where('organization_id', $orgId)
            ->latest()
            ->take(3)
            ->get()
            ->map(fn ($f) => [
                'title' => $f->title,
                'created_at' => $f->created_at,
                'status' => 'approved',
            ]);

        $recentActivity = collect()
            ->merge($recentEvents)
            ->merge($recentChallenges)
            ->merge($recentFunding)
            ->sortByDesc('created_at')
            ->take(5)
            ->values();

        return response()->json([
            'data' => [
                'kpis' => [
                    'events' => $totalEvents,
                    'challenges' => $totalChallenges,
                    'funding' => $totalFunding,
                    'pending' => $pendingChallenges,
                ],
                'recent_activity' => $recentActivity,
            ],
        ]);
    }
}
