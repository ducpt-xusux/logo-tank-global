<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$collection = \App\Models\Logo::limit(2)->get();
$resource = \App\Http\Resources\LogoResource::collection($collection);
echo "\n--- GET ---\n";
echo json_encode($resource);

$paginator = \App\Models\Logo::paginate(2);
$resource2 = \App\Http\Resources\LogoResource::collection($paginator);
echo "\n--- PAGINATE ---\n";
echo json_encode($resource2);
echo "\n";
