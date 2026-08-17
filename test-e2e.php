<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$app->instance('Illuminate\Foundation\Http\Middleware\VerifyCsrfToken', new class
{
    public function handle($request, $next)
    {
        return $next($request);
    }
});

// We need a real user to bypass ModelNotFoundException
$user = \App\Models\User::first();
if (! $user) {
    echo "No user found in DB.\n";
    exit;
}

$request = Illuminate\Http\Request::create('http://localhost:8080/en/forgot-password', 'POST', ['email' => $user->email]);

$response = $kernel->handle($request);
echo 'Response status: '.$response->getStatusCode()."\n";
