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
}
