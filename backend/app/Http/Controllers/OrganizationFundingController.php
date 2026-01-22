<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\FundingOpportunity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrganizationFundingController extends Controller
{
    /**
     * List funding opportunities
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'organization' || !$user->organization) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $funding = FundingOpportunity::where('organization_id', $user->organization->id)
            ->latest()
            ->get();

        return response()->json([
            'data' => $funding
        ]);
    }

    /**
     * Show single funding opportunity
     */
    public function show(Request $request, FundingOpportunity $funding): JsonResponse
    {
        $this->authorizeFunding($request, $funding);

        return response()->json([
            'data' => $funding
        ]);
    }

    /**
     * Store funding opportunity
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'organization' || !$user->organization) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'short_description' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'nullable|date',
            'amount' => 'nullable|numeric',
            'application_number' => 'nullable|integer|min:0',
            'funding_type' => 'required|in:grant,equity,loan,debt,convertible_note',
            'status' => 'nullable|in:pending,open,closed,cancelled',
        ]);

        $funding = FundingOpportunity::create([
            ...$data,
            'organization_id' => $user->organization->id,
            'status' => $data['status'] ?? 'pending',
        ]);

        return response()->json([
            'message' => 'Funding opportunity created successfully',
            'data' => $funding
        ], 201);
    }

    /**
     * Update funding opportunity
     */
    public function update(Request $request, FundingOpportunity $funding): JsonResponse
    {
        $this->authorizeFunding($request, $funding);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'short_description' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'nullable|date',
            'amount' => 'nullable|numeric',
            'application_number' => 'nullable|integer|min:0',
            'funding_type' => 'required|in:grant,equity,loan,debt,convertible_note',
            'status' => 'required|in:pending,open,closed,cancelled',
        ]);

        $funding->update($data);

        return response()->json([
            'message' => 'Funding opportunity updated successfully',
            'data' => $funding
        ]);
    }

    /**
     * Soft delete funding opportunity
     */
    public function destroy(Request $request, FundingOpportunity $funding): JsonResponse
    {
        $this->authorizeFunding($request, $funding);

        $funding->delete();

        return response()->json([
            'message' => 'Funding opportunity deleted'
        ]);
    }

    /**
     * List trashed funding opportunities
     */
    public function trashed(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'organization' || !$user->organization) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $funding = FundingOpportunity::onlyTrashed()
            ->where('organization_id', $user->organization->id)
            ->latest('deleted_at')
            ->get();

        return response()->json([
            'data' => $funding
        ]);
    }

    /**
     * Restore funding opportunity
     */
    public function restore(Request $request, int $id): JsonResponse
    {
        $funding = FundingOpportunity::onlyTrashed()->findOrFail($id);

        $this->authorizeFunding($request, $funding);

        $funding->restore();

        return response()->json([
            'message' => 'Funding opportunity restored successfully'
        ]);
    }

    /**
     * Permanently delete funding opportunity
     */
    public function forceDelete(Request $request, int $id): JsonResponse
    {
        $funding = FundingOpportunity::onlyTrashed()->findOrFail($id);

        $this->authorizeFunding($request, $funding);

        $funding->forceDelete();

        return response()->json([
            'message' => 'Funding opportunity permanently deleted'
        ]);
    }

    /**
     * Authorization helper
     */
    private function authorizeFunding(Request $request, FundingOpportunity $funding): void
    {
        $user = $request->user();

        if (
            $user->role !== 'organization' ||
            !$user->organization ||
            $funding->organization_id !== $user->organization->id
        ) {
            abort(403, 'Unauthorized');
        }
    }
}
