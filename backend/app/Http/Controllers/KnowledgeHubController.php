<?php

namespace App\Http\Controllers;

use App\Models\KnowledgeHub;

class KnowledgeHubController extends Controller
{
    /**
     * Get featured & published knowledge hub articles
     */
    public function featured()
    {
        $articles = KnowledgeHub::query()
            ->where('status', 'published')
            ->where('is_featured', true)
            ->orderBy('published_at', 'desc')
            ->take(6) // landing page limit
            ->get()
            ->map(function ($item) {
                return [
                    'id'       => $item->id,
                    'title'    => $item->title,
                    'excerpt'  => $item->short_description,
                    'category' => ucfirst($item->type),
                    'author'   => 'SiSTA', // static for now (no author column)
                    'readTime' => $item->max_read_time
                        ? $item->max_read_time . ' min read'
                        : null,
                    'image'    => $item->image
                        ? asset('storage/' . $item->image)
                        : 'https://via.placeholder.com/600x400',
                    'slug'     => $item->slug,
                ];
            });

        return response()->json($articles);
    }


     /**
     * Show single published knowledge article by slug
     */
    public function show(string $slug)
    {
        $article = KnowledgeHub::query()
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        return response()->json([
            'title' => $article->title,
            'short_description' => $article->short_description,
            'description' => $article->description,
            'type' => $article->type,
            'image' => $article->image
                ? asset('storage/' . $article->image)
                : null,
            'max_read_time' => $article->max_read_time,
            'created_at' => $article->created_at->format('M d, Y • H:i'),
            'author' => 'SiSTA',
        ]);
    }


    public function index()
{
    $articles = KnowledgeHub::query()
        ->where('status', 'published')
        ->orderByDesc('created_at')
        ->get()
        ->map(function ($article) {
            return [
                'id' => $article->id,
                'title' => $article->title,
                'excerpt' => $article->short_description,
                'category' => strtoupper($article->type),
                'author' => 'SiSTA',
                'readTime' => $article->max_read_time
                    ? $article->max_read_time . ' min read'
                    : null,
                'image' => $article->image
                    ? asset('storage/' . $article->image)
                    : 'https://via.placeholder.com/600x400',
                'slug' => $article->slug,
            ];
        });

    return response()->json($articles);
}


}
