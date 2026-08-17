<?php

namespace App\Http\Middleware;

use App\Support\AdminAreaAccess;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminAreaUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! AdminAreaAccess::allows($request->user()?->role)) {
            abort(403);
        }

        return $next($request);
    }
}
