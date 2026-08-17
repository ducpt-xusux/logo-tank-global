<?php

namespace Tests\Feature;

use Tests\TestCase;
use Tighten\Ziggy\Ziggy;

class ZiggyPublicRoutesTest extends TestCase
{
    public function test_public_group_includes_social_authentication_routes(): void
    {
        $routes = (new Ziggy('public'))->toArray()['routes'];

        $this->assertArrayHasKey('auth.social', $routes);
        $this->assertArrayHasKey('auth.social.callback', $routes);
    }
}
