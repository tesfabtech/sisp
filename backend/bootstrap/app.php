<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {

        // ✅ Register route middleware aliases (Laravel 12 way)
        $middleware->alias([
            'admin.only' => \App\Http\Middleware\AdminOnly::class,
            'superadmin.only' => \App\Http\Middleware\SuperAdminOnly::class,
        ]);

        // API middleware (no throttle)
        $middleware->api(
            append: [
                \Illuminate\Routing\Middleware\SubstituteBindings::class,
            ]
        );
    })
    ->withExceptions(function (Exceptions $exceptions) {})
    ->create();
