<?php

use App\Http\Middleware\EnsureAdminAreaUser;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['sidebar_state']);

        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'admin.area' => EnsureAdminAreaUser::class,
            'setlocale' => \App\Http\Middleware\SetLocale::class,
        ]);

        $middleware->redirectGuestsTo(function (Request $request) {
            if ($request->is('admin/*') || $request->is('admin')) {
                return route('login');
            }
            $locale = request()->segment(1);
            if (!in_array($locale, ['en', 'vi', 'ja'])) {
                $locale = 'en';
            }

            return route('public.home', ['locale' => $locale]).'?show_login=true';
        });
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (NotfoundHttpException $e, Request $request) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Not Found'], 404);
            }

            return inertia('not-found');
        });
    })->create();
