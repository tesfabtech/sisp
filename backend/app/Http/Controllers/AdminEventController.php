<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class AdminEventController extends Controller
{
    /* ───────── List ───────── */
    public function index()
    {
        return response()->json(
            Event::with('organization.user')
                ->latest()
                ->paginate(12)
        );
    }

    /* ───────── Show ───────── */
    public function show(Event $event)
    {
        return response()->json(
            $event->load('organization.user')
        );
    }

    /* ───────── Update status ───────── */
    public function updateStatus(Request $request, Event $event)
    {
        $request->validate([
            'status' => 'required|in:pending,published,cancelled,completed',
        ]);

        $event->update(['status' => $request->status]);

        return response()->json(['status' => $event->status]);
    }

    /* ───────── Feature toggle ───────── */
    public function feature($id)
    {
        $event = Event::findOrFail($id);

        $event->update([
            'is_featured' => ! $event->is_featured,
        ]);

        return response()->json([
            'is_featured' => $event->is_featured,
        ]);
    }


    /* ───────── Soft delete ───────── */
    public function destroy(Event $event)
    {
        $event->delete();
        return response()->json(['message' => 'Event deleted']);
    }

    /* ───────── Trashed ───────── */
    public function trashed()
    {
        return response()->json([
            'data' => Event::onlyTrashed()
                ->with('organization.user')
                ->latest()
                ->get(),
        ]);
    }

    /* ───────── Restore ───────── */
    public function restore($id)
    {
        Event::onlyTrashed()->findOrFail($id)->restore();
        return response()->json(['message' => 'Event restored']);
    }

    /* ───────── Force delete ───────── */
    public function forceDelete($id)
    {
        Event::onlyTrashed()->findOrFail($id)->forceDelete();
        return response()->json(['message' => 'Event permanently deleted']);
    }
}
