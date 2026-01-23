<?php

namespace App\Http\Controllers;

use App\Models\Mentor;
use Illuminate\Http\Request;

class AdminMentorController extends Controller
{
    /**
     *  mentors (MAIN TABLE)
     */
    public function index()
    {
        $mentors = Mentor::with('user')
            ->latest()
            ->get();

        return response()->json($mentors);
    }


    /**
     * Pending mentor requests
     */
    public function requests()
    {
        $mentors = Mentor::with('user')
            ->where('status', 'pending')
            ->latest()
            ->get();

        return response()->json($mentors);
    }

    /**
     * Approve mentor
     */
    public function approve($id)
    {
        $mentor = Mentor::findOrFail($id);

        $mentor->update([
            'status' => 'approved',
        ]);

        return response()->json([
            'message' => 'Mentor approved',
            'status' => $mentor->status,
        ]);
    }




    /**
     * Reject mentor
     */
    public function reject($id)
    {
        $mentor = Mentor::findOrFail($id);

        $mentor->update([
            'status' => 'rejected',
        ]);

        return response()->json([
            'message' => 'Mentor rejected',
        ]);
    }

    /**
     * Toggle featured mentor
     */
    public function toggleFeatured($id)
    {
        $mentor = Mentor::findOrFail($id);

        $mentor->featured = ! $mentor->featured;
        $mentor->save();

        return response()->json([
            'featured' => $mentor->featured,
        ]);
    }

    /**
     * Toggle availability
     */
    public function toggleAvailability($id)
    {
        $mentor = Mentor::findOrFail($id);

        $mentor->is_available = ! $mentor->is_available;
        $mentor->save();

        return response()->json([
            'is_available' => $mentor->is_available,
        ]);
    }

    public function pending()
    {
        $mentors = Mentor::with('user')
            ->where('status', 'pending')
            ->latest()
            ->get();

        return response()->json($mentors);
    }

    /**
     * Soft delete mentor
     */
    public function destroy($id)
    {
        $mentor = Mentor::findOrFail($id);
        $mentor->delete();

        return response()->json([
            'message' => 'Mentor deleted successfully',
        ]);
    }

    public function deleted()
    {
        $mentors = Mentor::onlyTrashed()->with('user')->latest()->get();
        return response()->json($mentors);
    }

    public function restore($id)
    {
        $mentor = Mentor::onlyTrashed()->findOrFail($id);
        $mentor->restore();
        return response()->json([
            'message' => 'Mentor restored successfully',
        ]);
    }

    public function forceDelete($id)
    {
        $mentor = Mentor::onlyTrashed()->findOrFail($id);
        $mentor->forceDelete();
        return response()->json([
            'message' => 'Mentor permanently deleted',
        ]);
    }

    public function show($id)
    {
        $mentor = Mentor::with('user')->findOrFail($id);

        return response()->json([
            'mentor' => $mentor,
        ]);
    }
}
