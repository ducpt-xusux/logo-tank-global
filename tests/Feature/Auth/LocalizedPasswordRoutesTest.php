<?php

namespace Tests\Feature\Auth;

use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class LocalizedPasswordRoutesTest extends TestCase
{
    #[Test]
    public function password_reset_routes_are_generated_with_the_active_locale(): void
    {
        $appUrl = config('app.url');

        $this->assertSame(
            "{$appUrl}/en/forgot-password",
            route('password.email', ['locale' => 'en'])
        );

        $this->assertSame(
            "{$appUrl}/en/reset-password",
            route('password.reset', ['locale' => 'en'])
        );
    }

    #[Test]
    public function frontend_password_reset_links_pass_locale_to_ziggy(): void
    {
        $passwordResetComponent = file_get_contents(resource_path('js/components/user/password-reset.tsx'));
        $this->assertStringContainsString('getCurrentRouteLocale(locale)', $passwordResetComponent);
        $this->assertStringContainsString('locale: currentLocale', $passwordResetComponent);
        $this->assertMatchesRegularExpression(
            '/route\(\s*["\']password\.email["\']\s*,\s*\{\s*locale:\s*currentLocale\s*\}\s*\)/',
            $passwordResetComponent
        );
    }

    #[Test]
    public function password_reset_redirects_to_localized_home_with_login_modal(): void
    {
        $authController = file_get_contents(app_path('Http/Controllers/AuthController.php'));

        $this->assertStringContainsString("->route('public.home'", $authController);
        $this->assertStringContainsString("'show_login' => 'true'", $authController);
    }

    #[Test]
    public function reset_password_page_accepts_html_encoded_email_query_fallback(): void
    {
        $routes = file_get_contents(base_path('routes/web.php'));

        $this->assertStringContainsString("request('email') ?? request('amp;email')", $routes);
    }

    #[Test]
    public function error_page_links_to_localized_home_route(): void
    {
        $errorView = file_get_contents(resource_path('views/errors/minimal.blade.php'));

        $this->assertStringNotContainsString("route('home')", $errorView);
        $this->assertStringContainsString("route('public.home'", $errorView);
        $this->assertStringContainsString("'locale' => app()->getLocale()", $errorView);
    }
}
