<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$paginator = \App\Models\Logo::paginate(2);
$resource = \App\Http\Resources\LogoResource::collection($paginator);

echo json_encode(array_merge([], ['logos' => $resource]));
echo "\n";
