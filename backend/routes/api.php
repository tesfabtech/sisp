<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StartupController;
use App\Http\Controllers\MentorController;
use App\Http\Controllers\MentorshipRequestController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminProfileController;
use App\Http\Controllers\AdminStartupController;
use App\Http\Controllers\AdminMentorController;

/*
|--------------------------------------------------------------------------
| Public (Unauthenticated) Routes
|--------------------------------------------------------------------------
*/

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

/*
|--------------------------------------------------------------------------
| Admin Authentication (PUBLIC)
|--------------------------------------------------------------------------
*/
Route::post('/admin/login', [AdminAuthController::class, 'login']);

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

    // Mentor
    Route::get('/mentor/profile', [MentorController::class, 'show']);
    Route::post('/mentor/profile', [MentorController::class, 'storeOrUpdate']);

    /*
    |--------------------------------------------------------------------------
    | Mentorship Requests
    |--------------------------------------------------------------------------
    */
    Route::post('/mentorship-requests', [MentorshipRequestController::class, 'store']);
    Route::get('/mentorship-requests/my', [MentorshipRequestController::class, 'myRequests']);

    // Mentor side
    Route::get('/mentorship-requests/mentor', [MentorshipRequestController::class, 'mentorRequests']);
    Route::patch('/mentorship-requests/{request}', [MentorshipRequestController::class, 'updateStatus']);

    // Admin Profile Management
    Route::put('/admin/profile', [AdminProfileController::class, 'updateProfile']);
    Route::put('/admin/password', [AdminProfileController::class, 'updatePassword']);
});

/*
|--------------------------------------------------------------------------
| Super Admin Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'superadmin.only'])
    ->prefix('admin')
    ->group(function () {
        Route::get('admins', [AdminController::class, 'index']);
        Route::post('admins', [AdminController::class, 'store']);
        Route::patch('admins/{id}/status', [AdminController::class, 'toggleStatus']);
    });

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------*/
Route::middleware(['auth:sanctum', 'admin.only'])
    ->prefix('admin')
    ->group(function () {

        // User Management
        Route::get('users', [AdminController::class, 'users']);
        Route::patch('users/{id}/status', [AdminController::class, 'toggleUserStatus']);
    });


Route::prefix('admin')->middleware('auth:sanctum')->group(function () {

    // Startup Management    
    Route::get('/startups', [AdminStartupController::class, 'index']);
    Route::patch('/startups/{id}/approve', [AdminStartupController::class, 'approve']);
    Route::patch('/startups/{id}/reject', [AdminStartupController::class, 'reject']);

    Route::delete('/startups/{id}', [AdminStartupController::class, 'destroy']); // soft delete
    Route::patch('/startups/{id}/restore', [AdminStartupController::class, 'restore']);
    Route::delete('/startups/{id}/force', [AdminStartupController::class, 'forceDelete']);
    Route::get('/startups/deleted', [AdminStartupController::class, 'deleted']);
    Route::patch('/startups/{id}/featured', [AdminStartupController::class, 'toggleFeatured']);
    Route::get('/startups/{id}', [AdminStartupController::class, 'show']);


    // Mentors
    Route::get('/mentors', [AdminMentorController::class, 'index']); // approved
    Route::get('/mentors/requests', [AdminMentorController::class, 'requests']);

    Route::patch('/mentors/{id}/approve', [AdminMentorController::class, 'approve']);
    Route::patch('/mentors/{id}/reject', [AdminMentorController::class, 'reject']);
    Route::patch('/mentors/{id}/featured', [AdminMentorController::class, 'toggleFeatured']);
    Route::patch('/mentors/{id}/availability', [AdminMentorController::class, 'toggleAvailability']);
    Route::get('/mentors/pending', [AdminMentorController::class, 'pending']);
    Route::delete('/mentors/{id}', [AdminMentorController::class, 'destroy']);
    Route::patch('/mentors/{id}/restore', [AdminMentorController::class, 'restore']);
    Route::delete('/mentors/{id}/force', [AdminMentorController::class, 'forceDelete']);
    Route::get('/mentors/deleted', [AdminMentorController::class, 'deleted']);
});
