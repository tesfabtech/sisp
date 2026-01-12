<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StartupController;

/*
|--------------------------------------------------------------------------
| Public (Unauthenticated) Routes
|--------------------------------------------------------------------------
*/

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

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
});
