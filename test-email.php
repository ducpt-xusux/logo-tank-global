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

// Assuming tester@example.com exists (from the user's prompt)
$request = Illuminate\Http\Request::create('http://localhost:8080/en/forgot-password', 'POST', ['email' => 'tester@example.com']);

// We will capture the mail.
Illuminate\Support\Facades\Mail::fake();

$response = $kernel->handle($request);

$mails = Illuminate\Support\Facades\Mail::sent(App\Mail\SendForgotPasswordMail::class);
if (count($mails) > 0) {
    echo 'Generated Link: '.$mails->first()->resetLink."\n";
} else {
    echo "No mail sent.\n";
}
