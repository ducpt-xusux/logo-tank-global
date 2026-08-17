<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$request = Illuminate\Http\Request::create('http://localhost:8080/en');
$response = $kernel->handle($request);
echo 'Default: '.config('app.locale')."\n";
