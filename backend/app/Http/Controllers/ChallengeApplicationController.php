<?php


namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use App\Models\ChallengeApplication;
use Illuminate\Http\Request;

class ChallengeApplicationController extends Controller
{
public function store(Challenge $challenge, Request $request)
{
$user = $request->user();

if ($user->role !== 'startup') {
abort(403, 'Startup role required.');
}

$exists = ChallengeApplication::where('challenge_id', $challenge->id)
->where('user_id', $user->id)
->exists();

if ($exists) {
abort(409, 'Already applied.');
}

ChallengeApplication::create([
'challenge_id' => $challenge->id,
'organization_id' => $challenge->organization_id,
'user_id' => $user->id,
]);

return response()->json(['message' => 'Applied successfully'], 201);
}
}