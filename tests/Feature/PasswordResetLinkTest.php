<?php

namespace Tests\Feature;

use App\Mail\SendForgotPasswordMail;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class PasswordResetLinkTest extends TestCase
{
    use RefreshDatabase;

    public function test_forgot_password_link_uses_correct_locale()
    {
        Mail::fake();

        $user = User::factory()->create([
            'email' => 'test@example.com',
        ]);

        // Submit form in 'en' locale
        $response = $this->post('/en/forgot-password', [
            'email' => 'test@example.com',
        ]);

        $response->assertSessionHasNoErrors();

        Mail::assertSent(SendForgotPasswordMail::class, function ($mail) {
            // Log the generated link
            dump('Generated Link: '.$mail->resetLink);

            return str_contains($mail->resetLink, '/en/reset-password');
        });
    }
}
