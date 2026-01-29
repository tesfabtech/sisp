<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureStartupUser
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'startup') {
            return response()->json([
                'message' => 'Startup registration required'
            ], 403);
        }

        return $next($request);
    }
}
