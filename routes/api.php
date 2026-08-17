<?php

use App\Http\Controllers\ErrorLogController;
use Illuminate\Support\Facades\Route;

Route::post('log-client-error', [ErrorLogController::class, 'store'])
    ->middleware('throttle:5,60')
    ->name('log.client-error');
