<?php

namespace Tests\Unit;

use App\Mail\SendForgotPasswordMail;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SendForgotPasswordMailTest extends TestCase
{
    #[Test]
    public function it_renders_the_reset_link_in_the_email(): void
    {
        app()->setLocale('ja');

        $resetLink = 'https://example.com/ja/reset-password?token=test-token&email=user%40example.com';

        $html = (new SendForgotPasswordMail($resetLink))->render();

        $this->assertStringContainsString(e($resetLink), $html);
        $this->assertStringContainsString('パスワードをリセットするには、下のリンクをクリックしてください。', $html);
        $this->assertStringNotContainsString('messages.mail_forgot', $html);
    }
}
