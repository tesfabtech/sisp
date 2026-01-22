<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrganizationChallengeController extends Controller
{
    /**
     * List challenges for the authenticated organization
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'organization') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $organization = $user->organization;

        if (!$organization) {
            return response()->json(['data' => []]);
        }

        $challenges = Challenge::where('organization_id', $organization->id)
            ->latest()
            ->get();

        return response()->json([
            'data' => $challenges
        ]);
    }

    /**
     * Show single challenge
     */
    public function show(Request $request, Challenge $challenge): JsonResponse
    {
        $this->authorizeChallenge($request, $challenge);

        return response()->json([
            'data' => $challenge
        ]);
    }

    /**
     * Create a new challenge
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'organization') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $organization = $user->organization;

        if (!$organization) {
            return response()->json(['message' => 'Organization not found'], 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'short_description' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'nullable|date',
            'award' => 'nullable|string|max:255',
            'participant_number' => 'nullable|integer|min:0',
            'type' => 'required|in:innovation,hackathon,pitch',
            'status' => 'nullable|in:pending,open,cancelled,closed',
        ]);

        $challenge = Challenge::create([
            ...$validated,
            'organization_id' => $organization->id,
            'status' => $validated['status'] ?? 'pending',
        ]);

        return response()->json([
            'message' => 'Challenge created successfully',
            'data' => $challenge
        ], 201);
    }

    /**
     * Update a challenge
     */
    public function update(Request $request, Challenge $challenge): JsonResponse
    {
        $this->authorizeChallenge($request, $challenge);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'short_description' => 'sometimes|nullable|string|max:255',
            'description' => 'sometimes|nullable|string',
            'deadline' => 'sometimes|date',
            'award' => 'sometimes|nullable|string|max:255',
            'participant_number' => 'sometimes|integer|min:0',
            'type' => 'sometimes|in:innovation,hackathon,pitch',

        ]);

        $challenge->update($validated);

        return response()->json([
            'message' => 'Challenge updated successfully',
            'data' => $challenge->fresh()
        ]);
    }

    /**
     * Soft delete a challenge
     */
    public function destroy(Request $request, Challenge $challenge): JsonResponse
    {
        $this->authorizeChallenge($request, $challenge);

        $challenge->delete();

        return response()->json([
            'message' => 'Challenge deleted successfully'
        ]);
    }

    /**
     * Enforce ownership and role
     */
    private function authorizeChallenge(Request $request, Challenge $challenge): void
    {
        $user = $request->user();

        if (
            $user->role !== 'organization' ||
            !$user->organization ||
            $challenge->organization_id !== $user->organization->id
        ) {
            abort(403, 'Unauthorized');
        }
    }

    /**
     * List trashed challenges
     */
    public function trashed(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'organization' || !$user->organization) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $challenges = Challenge::onlyTrashed()
            ->where('organization_id', $user->organization->id)
            ->latest('deleted_at')
            ->get();

        return response()->json([
            'data' => $challenges
        ]);
    }

    /**
     * Restore soft-deleted challenge
     */
    public function restore(Request $request, int $id): JsonResponse
    {
        $challenge = Challenge::onlyTrashed()->findOrFail($id);

        $this->authorizeChallenge($request, $challenge);

        $challenge->restore();

        return response()->json([
            'message' => 'Challenge restored successfully'
        ]);
    }

    /**
     * Permanently delete challenge
     */
    public function forceDelete(Request $request, int $id): JsonResponse
    {
        $challenge = Challenge::onlyTrashed()->findOrFail($id);

        $this->authorizeChallenge($request, $challenge);

        $challenge->forceDelete();

        return response()->json([
            'message' => 'Challenge permanently deleted'
        ]);
    }
}
