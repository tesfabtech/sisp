<?php

namespace App\Http\Controllers;

use App\Models\Startup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StartupController extends Controller
{
    // ✅ Get all startups for logged-in user
    public function myStartup(Request $request)
    {
        return response()->json(
            $request->user()->startups()->latest()->get()
        );
    }

    public function show(Request $request, Startup $startup)
    {
        // Allow only owner or public startups (optional logic)
        if ($startup->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        return response()->json($startup);
    }

    // ✅ Create startup (user_id auto attached, status always pending)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'website' => 'nullable|url',
            'tagline' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'industry' => 'nullable|string|max:100',
            'stage' => 'nullable|string',
            'problem_statement' => 'nullable|string',
            'solution_statement' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'team_size' => 'nullable|integer|min:1',
            'founded_year' => 'nullable|integer|min:1900|max:' . date('Y'),
            'video_url' => 'nullable|string|max:255',
            'logo' => 'nullable|image|max:2048',
            'cover_image' => 'nullable|image|max:4096',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('startups/logos', 'public');
        }

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $request->file('cover_image')->store('startups/covers', 'public');
        }

        $startup = Startup::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'status' => 'pending', // ✅ always pending
        ]);

        return response()->json([
            'message' => 'Startup created successfully',
            'startup' => $startup
        ], 201);
    }

    // ✅ Update startup (ownership protected, cannot change status)
    public function update(Request $request, Startup $startup)
    {
        if ($startup->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'website' => 'nullable|url',
            'tagline' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'industry' => 'nullable|string|max:100',
            'stage' => 'nullable|string',
            'problem_statement' => 'nullable|string',
            'solution_statement' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'team_size' => 'nullable|integer|min:1',
            'founded_year' => 'nullable|integer|min:1900|max:' . date('Y'),
            'video_url' => 'nullable|string|max:255',
            'logo' => 'nullable|image|max:2048',
            'cover_image' => 'nullable|image|max:4096',
        ]);

        if ($request->hasFile('logo')) {
            Storage::disk('public')->delete($startup->logo);
            $validated['logo'] = $request->file('logo')->store('startups/logos', 'public');
        }

        if ($request->hasFile('cover_image')) {
            Storage::disk('public')->delete($startup->cover_image);
            $validated['cover_image'] = $request->file('cover_image')->store('startups/covers', 'public');
        }

        $startup->update($validated);

        return response()->json([
            'message' => 'Startup updated',
            'startup' => $startup
        ]);
    }
}
