<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class OrganizationEventController extends Controller
{
    /**
     * List events for authenticated organization
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

        $events = Event::where('organization_id', $organization->id)
            ->latest()
            ->get();

        return response()->json([
            'data' => $events
        ]);
    }

    /**
     * Show single event (ownership enforced)
     */
    public function show(Request $request, Event $event): JsonResponse
    {
        $this->authorizeEvent($request, $event);

        return response()->json([
            'data' => $event
        ]);
    }

    /**
     * Create new event (status = pending by default)
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
            'title'             => 'required|string|max:255',
            'short_description' => 'nullable|string|max:255',
            'description'       => 'nullable|string',
            'location'          => 'nullable|string|max:255',
            'event_datetime'    => 'required|date',
            'event_type'        => 'required|in:conference,workshop,networking,bootcamp,training',
            'venue'             => 'required|in:physical,virtual,hybrid',
        ]);

        $event = Event::create([
            ...$validated,
            'organization_id' => $organization->id,
            'status'          => 'pending',
        ]);

        return response()->json([
            'message' => 'Event created successfully',
            'data'    => $event
        ], 201);
    }

    /**
     * Update event (organization can edit content, NOT status)
     */
    public function update(Request $request, Event $event): JsonResponse
    {
        $this->authorizeEvent($request, $event);

        $validated = $request->validate([
            'title'             => 'sometimes|string|max:255',
            'short_description' => 'sometimes|nullable|string|max:255',
            'description'       => 'sometimes|nullable|string',
            'location'          => 'sometimes|nullable|string|max:255',
            'event_datetime'    => 'sometimes|date',
            'event_type'        => 'sometimes|in:conference,workshop,networking,bootcamp,training',
            'venue'             => 'sometimes|in:physical,virtual,hybrid',
        ]);


        // Prevent org from changing status
        unset($validated['status']);

        $event->update($validated);

        return response()->json([
            'message' => 'Event updated successfully',
            'data'    => $event->fresh()
        ]);
    }

    /**
     * Soft delete event
     */
    public function destroy(Request $request, Event $event): JsonResponse
    {
        $this->authorizeEvent($request, $event);

        $event->delete();

        return response()->json([
            'message' => 'Event deleted successfully'
        ]);
    }

    /**
     * Ownership + role enforcement
     */
    private function authorizeEvent(Request $request, Event $event): void
    {
        $user = $request->user();

        if (
            $user->role !== 'organization' ||
            !$user->organization ||
            $event->organization_id !== $user->organization->id
        ) {
            abort(403, 'Unauthorized');
        }
    }


    /**
     * List trashed events
     */
    public function trashed(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'organization' || !$user->organization) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $events = Event::onlyTrashed()
            ->where('organization_id', $user->organization->id)
            ->latest('deleted_at')
            ->get();

        return response()->json([
            'data' => $events
        ]);
    }

    /**
     * Restore soft-deleted event
     */
    public function restore(Request $request, int $id): JsonResponse
    {
        $event = Event::onlyTrashed()->findOrFail($id);

        $this->authorizeEvent($request, $event);

        $event->restore();

        return response()->json([
            'message' => 'Event restored successfully'
        ]);
    }

    /**
     * Permanently delete event
     */
    public function forceDelete(Request $request, int $id): JsonResponse
    {
        $event = Event::onlyTrashed()->findOrFail($id);

        $this->authorizeEvent($request, $event);

        $event->forceDelete();

        return response()->json([
            'message' => 'Event permanently deleted'
        ]);
    }
}
