<?php

use Illuminate\Support\Facades\Cache;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminLoginPageTest extends TestCase
{
    public function test_login_route_renders_the_admin_login_page(): void
    {
        Cache::forever('price_settings', collect());
        $this->withoutVite();

        $response = $this->get('/login');

        $response
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/login')
            );
    }
}
