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

$request = Illuminate\Http\Request::create('http://localhost:8080/test-locale/en', 'POST');
$response = $kernel->handle($request);

echo $response->getContent()."\n";
