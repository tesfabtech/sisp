<?php

namespace App\Http\Controllers;

use App\Models\KnowledgeHub;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminKnowledgeController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => KnowledgeHub::latest()->get()
        ]);
    }

    public function show($id)
    {
        $knowledge = KnowledgeHub::withTrashed()->find($id);

        if (!$knowledge) {
            return response()->json([
                'message' => 'Knowledge not found'
            ], 404);
        }

        return response()->json([
            'data' => $knowledge
        ]);
    }


    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'short_description' => 'required|string',
            'description' => 'required|string',
            'type' => 'required|in:startup,funding,marketing,product,technology,legal,finance,operations,leadership,design,ai,general',
            'max_read_time' => 'nullable|integer',
            'image' => 'nullable|image',
            'file' => 'nullable|mimes:pdf|max:10240',
            'status' => 'required|in:draft,published',
            'is_featured' => 'boolean'
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('knowledge/images', 'public');
        }

        if ($request->hasFile('file')) {
            $data['file_path'] = $request->file('file')->store('knowledge/files', 'public');
        }

        $knowledge = KnowledgeHub::create($data);

        return response()->json($knowledge);
    }

    public function update(Request $request, $id)
    {
        $knowledge = KnowledgeHub::findOrFail($id);

        $data = $request->only([
            'title',
            'short_description',
            'description',
            'type',
            'max_read_time',
            'status',
        ]);

        /* ───────── Image Upload ───────── */
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')
                ->store('knowledge/images', 'public');
        }

        /* ───────── PDF Upload ───────── */
        if ($request->hasFile('file')) {
            $data['file'] = $request->file('file')
                ->store('knowledge/files', 'public');
        }

        $knowledge->update($data);

        return response()->json([
            'message' => 'Knowledge updated successfully',
            'data' => $knowledge,
        ]);
    }





    public function destroy($id)
    {
        $knowledge = KnowledgeHub::findOrFail($id);
        $knowledge->delete();

        return response()->json(['message' => 'Deleted']);
    }

    public function restore($id)
    {
        $knowledge = KnowledgeHub::withTrashed()->findOrFail($id);
        $knowledge->restore();

        return response()->json(['message' => 'Restored']);
    }

    public function forceDelete($id)
    {
        $knowledge = KnowledgeHub::withTrashed()->findOrFail($id);
        $knowledge->forceDelete();

        return response()->json(['message' => 'Permanently Deleted']);
    }

    public function trashed()
    {
        $data = KnowledgeHub::onlyTrashed()->get();
        return response()->json(['data' => $data]);
    }

    public function feature($id)
    {
        $knowledge = KnowledgeHub::findOrFail($id);

        $knowledge->is_featured = ! $knowledge->is_featured;
        $knowledge->save();

        return response()->json([
            'message' => 'Feature status updated',
            'is_featured' => $knowledge->is_featured
        ]);
    }
}
