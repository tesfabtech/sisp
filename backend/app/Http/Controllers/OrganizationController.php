<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use App\Models\Organization;

class OrganizationController extends Controller
{
    /**
     * Get authenticated organization profile
     */
    public function profile(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'organization') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'user' => [
                'id'         => $user->id,
                'first_name' => $user->first_name,
                'last_name'  => $user->last_name,
                'email'      => $user->email,
            ],
            'organization' => $user->organization
        ]);
    }

    /**
     * Update authenticated organization profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'organization') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'type'        => 'sometimes|nullable|in:government,ngo,private,university,accelerator',
            'description' => 'sometimes|nullable|string',
            'website'     => 'sometimes|nullable|url',
            'phone'       => 'sometimes|nullable|string|max:50',
            'address'     => 'sometimes|nullable|string|max:255',
            'logo'        => 'sometimes|nullable|image|max:2048',
            'cover_image' => 'sometimes|nullable|image|max:4096',
        ]);

        $organization = $user->organization;

        // Create organization if missing
        if (!$organization) {
            $organization = Organization::create([
                'user_id' => $user->id,
                'type'    => $validated['type'] ?? null,
            ]);
        }

        // Handle logo upload
        if ($request->hasFile('logo')) {
            if ($organization->logo) {
                Storage::disk('public')->delete($organization->logo);
            }

            $validated['logo'] =
                $request->file('logo')->store('organizations/logos', 'public');
        }

        // Handle cover image upload
        if ($request->hasFile('cover_image')) {
            if ($organization->cover_image) {
                Storage::disk('public')->delete($organization->cover_image);
            }

            $validated['cover_image'] =
                $request->file('cover_image')->store('organizations/covers', 'public');
        }

        // Prevent overwriting existing data with null
        $cleanData = array_filter($validated, fn($value) => !is_null($value));

        $organization->update($cleanData);

        return response()->json([
            'message'      => 'Profile updated successfully',
            'organization' => $organization->fresh()
        ]);
    }
}
