<?php

namespace App\Http\Controllers;

use App\Models\Startup;
use Illuminate\Http\Request;

class AdminStartupController extends Controller
{
    public function index()
    {
        $startups = Startup::with('user:id,first_name,last_name,email')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($startup) {
                return [
                    'id' => $startup->id,
                    'name' => $startup->name,
                    'logo' => $startup->logo,
                    'tagline' => $startup->tagline,
                    'industry' => $startup->industry,
                    'stage' => $startup->stage,
                    'location' => $startup->location,
                    'status' => $startup->status,
                    'featured' => (bool) $startup->featured,
                    'created_at' => $startup->created_at,
                    'founder' => $startup->user ? [
                        'id' => $startup->user->id,
                        'name' => $startup->user->first_name . ' ' . $startup->user->last_name,
                        'email' => $startup->user->email,
                    ] : null,
                ];
            });

        return response()->json([
            'startups' => $startups,
        ]);
    }

    public function approve($id)
    {
        $startup = Startup::findOrFail($id);
        $startup->status = 'approved';
        $startup->save();

        return response()->json([
            'message' => 'Startup approved successfully',
            'status' => $startup->status,
        ]);
    }

    public function reject($id)
    {
        $startup = Startup::findOrFail($id);
        $startup->status = 'rejected';
        $startup->save();

        return response()->json([
            'message' => 'Startup rejected successfully',
            'status' => $startup->status,
        ]);
    }

    public function restore($id)
    {
        $startup = Startup::onlyTrashed()->findOrFail($id);
        $startup->restore();

        return response()->json([
            'message' => 'Startup restored successfully',
            'status' => $startup->status,
        ]);
    }

    public function destroy($id)
    {
        $startup = Startup::findOrFail($id);
        $startup->delete(); // soft delete

        return response()->json([
            'message' => 'Startup deleted successfully',
        ]);
    }

    public function forceDelete($id)
    {
        $startup = Startup::onlyTrashed()->findOrFail($id);
        $startup->forceDelete();

        return response()->json([
            'message' => 'Startup permanently deleted',
        ]);
    }

    public function deleted()
    {
        $startups = Startup::onlyTrashed()
            ->orderBy('deleted_at', 'desc')
            ->get()
            ->map(function ($startup) {
                return [
                    'id' => $startup->id,
                    'name' => $startup->name,
                    'logo' => $startup->logo,
                    'tagline' => $startup->tagline,
                    'industry' => $startup->industry,
                    'stage' => $startup->stage,
                    'status' => $startup->status,
                    'created_at' => $startup->created_at,
                    'deleted_at' => $startup->deleted_at,
                ];
            });

        return response()->json([
            'startups' => $startups,
        ]);
    }

    public function toggleFeatured($id)
    {
        $startup = Startup::findOrFail($id);
        $startup->featured = ! $startup->featured;
        $startup->save();

        return response()->json([
            'featured' => (bool) $startup->featured,
        ]);
    }

    // ✅ Correct single show() method
    public function show($id)
    {
        $startup = Startup::withTrashed()
            ->with('user:id,first_name,last_name,email')
            ->findOrFail($id);

        return response()->json([
            'startup' => [
                'id' => $startup->id,
                'name' => $startup->name,
                'logo' => $startup->logo,
                'cover_image' => $startup->cover_image,
                'tagline' => $startup->tagline,
                'industry' => $startup->industry,
                'stage' => $startup->stage,
                'location' => $startup->location,
                'status' => $startup->status,
                'featured' => (bool) $startup->featured,
                'created_at' => $startup->created_at,
                'updated_at' => $startup->updated_at,
                'description' => $startup->description,
                'video_url' => $startup->video_url,
                'founder' => $startup->user ? [
                    'id' => $startup->user->id,
                    'name' => $startup->user->first_name . ' ' . $startup->user->last_name,
                    'email' => $startup->user->email,
                ] : null,
            ],
        ]);
    }
}
