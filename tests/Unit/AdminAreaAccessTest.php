<?php

namespace Tests\Unit;

use App\Http\Middleware\EnsureAdminAreaUser;
use App\Support\AdminAreaAccess;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Tests\TestCase;

class AdminAreaAccessTest extends TestCase
{
    public function test_admin_area_access_allows_only_admin_area_roles(): void
    {
        $this->assertTrue(AdminAreaAccess::allows('admin'));
        $this->assertTrue(AdminAreaAccess::allows('designer'));
        $this->assertFalse(AdminAreaAccess::allows('user'));
        $this->assertFalse(AdminAreaAccess::allows(null));
    }

    public function test_middleware_forbids_public_users(): void
    {
        $request = Request::create('/admin');
        $request->setUserResolver(fn () => (object) ['role' => 'user']);

        try {
            (new EnsureAdminAreaUser)->handle(
                $request,
                fn () => new Response('ok'),
            );
        } catch (HttpException $exception) {
            $this->assertSame(403, $exception->getStatusCode());

            return;
        }

        $this->fail('Public users should not access the admin area.');
    }

    public function test_middleware_allows_admin_area_users(): void
    {
        $request = Request::create('/admin');
        $request->setUserResolver(fn () => (object) ['role' => 'admin']);

        $response = (new EnsureAdminAreaUser)->handle(
            $request,
            fn () => new Response('ok'),
        );

        $this->assertSame('ok', $response->getContent());
    }
}
