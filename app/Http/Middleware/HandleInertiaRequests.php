<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'avatar' => $user->avatar ?? null,
                    'role' => $user->role,
                    'provider' => $user->provider,
                    'two_factor_confirmed_at' => $user->two_factor_confirmed_at,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'company_name' => $user->company_name,
                    'address_line_1' => $user->address_line_1,
                    'address_line_2' => $user->address_line_2,
                    'postal_code' => $user->postal_code,
                    'phone' => $user->phone,
                ] : null,
            ],
            'ziggy' => fn(): array => [
                ...(new Ziggy($request->is('admin*') ? 'admin' : 'public'))->toArray(),
                'location' => $request->url(),
            ],
            'locale' => $request->route('locale') ?? app()->getLocale(),
            'sidebarOpen' => !$request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
                'order_success' => fn() => $request->session()->get('order_success'),
            ],
            'priceSettings' => cache()->rememberForever('price_settings', function () {
                return Setting::all()->pluck('value', 'key')->map(function ($value) {
                    return json_decode($value, true);
                });
            }),
        ];
    }
}
