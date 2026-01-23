<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use Illuminate\Support\Facades\Log;

class AdminOrganizationController extends Controller
{
    public function index()
    {
        return response()->json(
            Organization::with('user')->latest()->get()
        );
    }

    public function show($id)
    {
        return response()->json([
            'organization' => Organization::with('user')->findOrFail($id),
        ]);
    }

    public function approve($id)
    {
        try {
            $org = Organization::findOrFail($id);

            $org->status = 'verified'; // ✅ ENUM VALUE
            $org->save();

            return response()->json([
                'message' => 'Organization verified',
                'status'  => $org->status,
            ]);
        } catch (\Throwable $e) {
            Log::error('ORGANIZATION APPROVE FAILED', [
                'organization_id' => $id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Failed to verify organization',
            ], 500);
        }
    }

    public function reject($id)
    {
        $org = Organization::findOrFail($id);
        $org->status = 'rejected';
        $org->save();

        return response()->json(['message' => 'Rejected']);
    }

    public function destroy($id)
    {
        Organization::findOrFail($id)->delete();

        return response()->json(['message' => 'Deleted']);
    }

    public function deleted()
    {
        return response()->json(
            Organization::onlyTrashed()->with('user')->latest()->get()
        );
    }

    public function restore($id)
    {
        Organization::onlyTrashed()->findOrFail($id)->restore();

        return response()->json(['message' => 'Restored']);
    }

    public function forceDelete($id)
    {
        Organization::onlyTrashed()->findOrFail($id)->forceDelete();

        return response()->json(['message' => 'Deleted permanently']);
    }
}
