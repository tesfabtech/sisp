<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StartupController;
use App\Http\Controllers\MentorController;
use App\Http\Controllers\MentorshipRequestController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\OrganizationEventController;
use App\Http\Controllers\OrganizationChallengeController;
use App\Http\Controllers\OrganizationFundingController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminProfileController;
use App\Http\Controllers\AdminStartupController;
use App\Http\Controllers\AdminMentorController;
use App\Http\Controllers\AdminOrganizationController;
use App\Http\Controllers\AdminChallengeController;
use App\Http\Controllers\AdminEventController;
use App\Http\Controllers\AdminKnowledgeController;
use App\Http\Controllers\AdminFundingController;
use App\Http\Controllers\OpportunityController;
use App\Http\Controllers\KnowledgeHubController;
use App\Http\Controllers\MessageController;
/*
|--------------------------------------------------------------------------
| Public (Unauthenticated) Routes
|--------------------------------------------------------------------------
*/

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

Route::get('/startups', [StartupController::class, 'index']);
Route::get('/startups/all', [StartupController::class, 'listApproved']);
// Public startup detail (no auth)
Route::get('/startups/detail/{id}', [StartupController::class, 'detail']);


Route::get('/opportunities', [OpportunityController::class, 'index']);
Route::get('/opportunities/featured', [OpportunityController::class, 'featured']);
Route::get('/opportunities/{type}/{id}', [OpportunityController::class, 'show']);



Route::get('/knowledge-hub/featured', [KnowledgeHubController::class, 'featured']);
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
    Route::get('/my-startups-with-approved-mentors', [StartupController::class, 'myStartupsWithApprovedMentors']);
    // Mentor
    Route::get('/mentor/profile', [MentorController::class, 'show']);
    Route::post('/mentor/profile', [MentorController::class, 'storeOrUpdate']);

    /*
    |--------------------------------------------------------------------------
    | Mentorship Requests
    |--------------------------------------------------------------------------
    */
    Route::get('/my-startups', [StartupController::class, 'myStartupsSimple']);
    Route::post('/mentorship-requests', [MentorshipRequestController::class, 'store']);
    Route::get('/mentorship-requests/my', [MentorshipRequestController::class, 'myRequests']);
    Route::get('/mentor/my-accepted-startups', [MentorController::class, 'myAcceptedStartups']);

    // Messaging
    Route::get('/messages', [MessageController::class, 'index']);
    Route::post('/messages', [MessageController::class, 'store']);
    Route::delete('/messages/{id}', [MessageController::class, 'destroy']);
    Route::delete('/messages', [MessageController::class, 'destroyAll']);


    // Mentor side
    Route::get('/mentorship-requests/mentor', [MentorshipRequestController::class, 'mentorRequests']);
    Route::patch('/mentorship-requests/{request}', [MentorshipRequestController::class, 'updateStatus']);

    // Admin Profile Management
    Route::put('/admin/profile', [AdminProfileController::class, 'updateProfile']);
    Route::put('/admin/password', [AdminProfileController::class, 'updatePassword']);
});


// Organization

Route::middleware('auth:sanctum')->group(function () {
    // Profile
    Route::get('/organization/profile', [OrganizationController::class, 'profile']);
    Route::patch('/organization/profile', [OrganizationController::class, 'updateProfile']);



    // Events
    Route::get('/organization/events', [OrganizationEventController::class, 'index']);
    // 🔥 Trash Event
    Route::get('/organization/events/trashed', [OrganizationEventController::class, 'trashed']);
    Route::post('/organization/events/{id}/restore', [OrganizationEventController::class, 'restore']);
    Route::delete('/organization/events/{id}/force', [OrganizationEventController::class, 'forceDelete']);
    // Single Event
    Route::get('/organization/events/{event}', [OrganizationEventController::class, 'show']);
    Route::post('/organization/events', [OrganizationEventController::class, 'store']);
    Route::put('/organization/events/{event}', [OrganizationEventController::class, 'update']);
    Route::delete('/organization/events/{event}', [OrganizationEventController::class, 'destroy']);



    // Challenges
    Route::get('/organization/challenges', [OrganizationChallengeController::class, 'index']);
    // Trash routes
    Route::get('/organization/challenges/trashed', [OrganizationChallengeController::class, 'trashed']);
    Route::post('/organization/challenges/{id}/restore', [OrganizationChallengeController::class, 'restore']);
    Route::delete('/organization/challenges/{id}/force', [OrganizationChallengeController::class, 'forceDelete']);
    // Single Challenge
    Route::get('/organization/challenges/{challenge}', [OrganizationChallengeController::class, 'show']);
    Route::post('/organization/challenges', [OrganizationChallengeController::class, 'store']);
    Route::put('/organization/challenges/{challenge}', [OrganizationChallengeController::class, 'update']);
    Route::delete('/organization/challenges/{challenge}', [OrganizationChallengeController::class, 'destroy']);



    // Funding Opportunities
    Route::get('/organization/funding', [OrganizationFundingController::class, 'index']);
    // Trash routes
    Route::get('/organization/funding/trashed', [OrganizationFundingController::class, 'trashed']);
    Route::post('/organization/funding/{id}/restore', [OrganizationFundingController::class, 'restore']);
    Route::delete('/organization/funding/{id}/force', [OrganizationFundingController::class, 'forceDelete']);
    // Single Funding Opportunity
    Route::post('/organization/funding', [OrganizationFundingController::class, 'store']);
    Route::get('/organization/funding/{funding}', [OrganizationFundingController::class, 'show']);
    Route::put('/organization/funding/{funding}', [OrganizationFundingController::class, 'update']);
    Route::delete('/organization/funding/{funding}', [OrganizationFundingController::class, 'destroy']);
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
    Route::get('/mentors/{id}', [AdminMentorController::class, 'show']);


    // Organizations
    Route::get('/organizations', [AdminOrganizationController::class, 'index']);
    Route::get('/organizations/deleted', [AdminOrganizationController::class, 'deleted']);
    Route::get('/organizations/{id}', [AdminOrganizationController::class, 'show']);
    Route::patch('/organizations/{id}/approve', [AdminOrganizationController::class, 'approve']);
    Route::patch('/organizations/{id}/reject', [AdminOrganizationController::class, 'reject']);
    Route::delete('/organizations/{id}', [AdminOrganizationController::class, 'destroy']);
    Route::patch('/organizations/{id}/restore', [AdminOrganizationController::class, 'restore']);
    Route::delete('/organizations/{id}/force', [AdminOrganizationController::class, 'forceDelete']);

    // Challenges
    Route::get('/challenges', [AdminChallengeController::class, 'index']);
    Route::get('/challenges/trashed', [AdminChallengeController::class, 'trashed']);
    Route::get('/challenges/{id}', [AdminChallengeController::class, 'show']);

    Route::patch('/challenges/{id}/status', [AdminChallengeController::class, 'updateStatus']);
    Route::patch('/challenges/{id}/feature', [AdminChallengeController::class, 'feature']);
    Route::delete('/challenges/{id}', [AdminChallengeController::class, 'destroy']);
    Route::patch('/challenges/{id}/restore', [AdminChallengeController::class, 'restore']);
    Route::delete('/challenges/{id}/force', [AdminChallengeController::class, 'forceDelete']);

    // Events
    Route::get('/events', [AdminEventController::class, 'index']);
    Route::get('/events/trashed', [AdminEventController::class, 'trashed']);
    Route::get('/events/{event}', [AdminEventController::class, 'show']);

    Route::patch('/events/{event}/status', [AdminEventController::class, 'updateStatus']);
    Route::patch('/events/{id}/feature', [AdminEventController::class, 'feature']);
    Route::delete('/events/{event}', [AdminEventController::class, 'destroy']);
    Route::patch('/events/{id}/restore', [AdminEventController::class, 'restore']);
    Route::delete('/events/{id}/force', [AdminEventController::class, 'forceDelete']);

    // Knowledge Hub
    Route::get('/knowledge', [AdminKnowledgeController::class, 'index']);
    Route::get('/knowledge/trashed', [AdminKnowledgeController::class, 'trashed']);
    Route::get('/knowledge/{id}', [AdminKnowledgeController::class, 'show']);
    Route::post('/knowledge', [AdminKnowledgeController::class, 'store']);
    Route::post('/knowledge/{id}', [AdminKnowledgeController::class, 'update']);
    Route::delete('/knowledge/{id}', [AdminKnowledgeController::class, 'destroy']);
    Route::patch('/knowledge/{id}/restore', [AdminKnowledgeController::class, 'restore']);
    Route::delete('/knowledge/{id}/force', [AdminKnowledgeController::class, 'forceDelete']);
    Route::patch('/knowledge/{id}/feature', [AdminKnowledgeController::class, 'feature']);


    // Admin Funding
    Route::get('/funding', [AdminFundingController::class, 'index']);
    Route::get('/funding/trashed', [AdminFundingController::class, 'trashed']);
    Route::get('/funding/{id}', [AdminFundingController::class, 'show']);
    Route::post('/funding', [AdminFundingController::class, 'store']);
    Route::patch('/funding/{id}', [AdminFundingController::class, 'update']);
    Route::delete('/funding/{id}', [AdminFundingController::class, 'destroy']);
    Route::patch('/funding/{id}/restore', [AdminFundingController::class, 'restore']);
    Route::delete('/funding/{id}/force', [AdminFundingController::class, 'forceDelete']);
    Route::patch('/funding/{id}/feature', [AdminFundingController::class, 'feature']);
});
