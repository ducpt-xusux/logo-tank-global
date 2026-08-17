<?php

namespace Tests\Unit;

use App\Http\Middleware\SetLocale;
use Illuminate\Http\Request;
use Illuminate\Routing\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SetLocaleTest extends TestCase
{
    #[Test]
    public function it_sets_the_locale_as_a_default_route_parameter(): void
    {
        $request = Request::create('/ja/forgot-password');
        $route = new Route(['GET'], '{locale}/forgot-password', []);
        $route->bind($request);
        $request->setRouteResolver(fn (): Route => $route);

        (new SetLocale)->handle($request, function () {
            $this->assertSame(['locale' => 'ja'], app('url')->getDefaultParameters());
            $this->assertSame(
                config('app.url').'/ja/forgot-password',
                route('password.email')
            );

            return response('');
        });
    }
}
