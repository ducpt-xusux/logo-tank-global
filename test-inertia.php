<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$request = \Illuminate\Http\Request::capture();
\Inertia\Inertia::setRootView('app');
$paginator = \App\Models\Logo::paginate(2);
$resource = \App\Http\Resources\LogoResource::collection($paginator);

$response = \Inertia\Inertia::render('foo', ['logos' => $resource])->toResponse($request);
echo $response->getContent();
echo "\n";
