<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$request = Illuminate\Http\Request::create('http://localhost:8080/en');
$kernel->handle($request);
echo 'Route: '.route('password.email', ['locale' => 'en'])."\n";
echo 'Route 2: '.route('password.reset', ['locale' => 'en', 'token' => 'abc'])."\n";
