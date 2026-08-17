<?php

namespace Tests\Unit;

use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ResetPasswordPageLocalizationTest extends TestCase
{
    #[Test]
    public function reset_password_page_uses_ts_locale_keys(): void
    {
        $page = file_get_contents(resource_path('js/pages/auth/reset-password.tsx'));

        $this->assertStringContainsString('useTranslation("common"', $page);
        $this->assertStringContainsString('t("reset_password.title")', $page);
        $this->assertStringContainsString('t("reset_password.description")', $page);
        $this->assertStringContainsString('t("reset_password.email")', $page);
        $this->assertStringContainsString('t("reset_password.new_password")', $page);
        $this->assertStringContainsString('t("reset_password.confirm_password")', $page);
        $this->assertStringContainsString('t("reset_password.submit")', $page);

        $this->assertStringNotContainsString('パスワードをリセット', $page);
        $this->assertStringNotContainsString('メールアドレス', $page);
        $this->assertStringNotContainsString('新しいパスワード', $page);
        $this->assertStringNotContainsString('リセット', $page);
    }
}
