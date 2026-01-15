<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StartupController;
use App\Http\Controllers\MentorController;
use App\Http\Controllers\MentorshipRequestController;

/*
|--------------------------------------------------------------------------
| Public (Unauthenticated) Routes
|--------------------------------------------------------------------------
*/

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

/*
    |--------------------------------------------------------------------------
    | Mentor Listing (FOR STARTUPS)
    |--------------------------------------------------------------------------
    */
Route::get('/mentors', [MentorController::class, 'index']);
/*
|--------------------------------------------------------------------------
| Protected Routes (Sanctum Token Auth)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/me', fn() => request()->user());

    // Startup
    Route::get('/startups/me', [StartupController::class, 'myStartup']);
    Route::post('/startups', [StartupController::class, 'store']);
    Route::put('/startups/{startup}', [StartupController::class, 'update']);
    Route::get('/startups/{startup}', [StartupController::class, 'show']);

    //Mentor
    Route::get('/mentor/profile', [MentorController::class, 'show']);
    Route::post('/mentor/profile', [MentorController::class, 'storeOrUpdate']);



    /*
    |--------------------------------------------------------------------------
    | Mentorship Requests
    |--------------------------------------------------------------------------
    */
    Route::post('/mentorship-requests', [MentorshipRequestController::class, 'store']);
    Route::get('/mentorship-requests/my', [MentorshipRequestController::class, 'myRequests']);

    // ✅ Mentor side (ADD THESE)
    Route::get('/mentorship-requests/mentor', [MentorshipRequestController::class, 'mentorRequests']);
    Route::patch('/mentorship-requests/{request}', [MentorshipRequestController::class, 'updateStatus']);
});
