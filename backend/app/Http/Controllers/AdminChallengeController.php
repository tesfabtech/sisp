<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use Illuminate\Http\Request;

class AdminChallengeController extends Controller
{
    public function index(Request $request)
    {
        $query = Challenge::with('organization.user');

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->type) {
            $query->where('type', $request->type);
        }

        if ($request->search) {
            $query->where('title', 'ilike', "%{$request->search}%");
        }

        if ($request->featured) {
            $query->where('is_featured', true);
        }

        return response()->json(
            $query->latest()->paginate(12)
        );
    }

    public function show($id)
    {
        return Challenge::with(['organization.user', 'applications'])->findOrFail($id);
    }

    public function updateStatus(Request $request, $id)
    {
        $challenge = Challenge::findOrFail($id);
        $challenge->update(['status' => $request->status]);

        return response()->json(['message' => 'Status updated']);
    }

    public function feature($id)
    {
        $challenge = Challenge::findOrFail($id);

        $challenge->update([
            'is_featured' => ! $challenge->is_featured,
        ]);

        return response()->json([
            'is_featured' => $challenge->is_featured,
        ]);
    }


    public function destroy($id)
    {
        Challenge::findOrFail($id)->delete();
        return response()->json(['message' => 'Soft deleted']);
    }

    public function trashed()
    {
        return Challenge::onlyTrashed()
            ->with('organization.user')
            ->paginate(12);
    }

    public function restore($id)
    {
        Challenge::onlyTrashed()->findOrFail($id)->restore();
        return response()->json(['message' => 'Restored']);
    }

    public function forceDelete($id)
    {
        Challenge::onlyTrashed()->findOrFail($id)->forceDelete();
        return response()->json(['message' => 'Deleted permanently']);
    }
}
