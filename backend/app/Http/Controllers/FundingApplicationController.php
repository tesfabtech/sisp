<?php


namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\FundingOpportunity;
use App\Models\FundingApplication;
use Illuminate\Http\Request;

class FundingApplicationController extends Controller
{
public function store(FundingOpportunity $funding, Request $request)
{
$user = $request->user();

if ($user->role !== 'startup') {
abort(403, 'Startup role required.');
}

$exists = FundingApplication::where('funding_id', $funding->id)
->where('user_id', $user->id)
->exists();

if ($exists) {
abort(409, 'Already applied.');
}

// Optional startup_id (must belong to user)
if ($request->startup_id) {
if (!$user->startups()->where('id', $request->startup_id)->exists()) {
abort(403, 'Invalid startup.');
}
}

FundingApplication::create([
'funding_id' => $funding->id,
'organization_id' => $funding->organization_id,
'user_id' => $user->id,
'startup_id' => $request->startup_id,
'pitch_deck' => $request->pitch_deck,
]);

return response()->json(['message' => 'Applied successfully'], 201);
}
}