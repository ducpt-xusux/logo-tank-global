<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SocialAuthController;
use App\Http\Controllers\TwoFactorAuthenticatedSessionController;
use Illuminate\Support\Facades\Route;

// First time Log-in
Route::middleware('guest')->group(function () {
    Route::get('/login', fn () => inertia('admin/login'))->name('login');
    Route::get('/login/two-factor', fn () => inertia('auth/login-two-factor'))->name('two-factor.login');
    Route::post('/login/two-factor-auth', [TwoFactorAuthenticatedSessionController::class, 'store'])
        ->middleware(array_filter([
            'guest:'.config('fortify.guard'),
            'throttle:two-factor',
        ]))->name('two-factor.login.persist');

    // Social Login Routes
    Route::get('/auth/{provider}', [SocialAuthController::class, 'redirectToProvider'])->name('auth.social');
    Route::get('/auth/{provider}/callback', [SocialAuthController::class, 'handleProviderCallback'])->name('auth.social.callback');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/send-email-2fa', [AuthController::class, 'sendEmail2FA'])->name('two-factor-email.send')
        ->middleware('throttle:email-two-factor');

    Route::post('/confirm-email-2fa', [AuthController::class, 'confirmEmail2FA'])->name('two-factor-email.confirm');
});
