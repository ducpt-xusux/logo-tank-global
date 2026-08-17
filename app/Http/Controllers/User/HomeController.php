<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Logo;
use App\Models\Package;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $query = Logo::query();

        $newestLogos = $query->with('favorites')
            ->withCount('favorites')
            ->orderBy('up_date', 'desc')
            ->limit(8)
            ->get();

        return Inertia::render('public/home', [
            'newestLogos' => \App\Http\Resources\LogoResource::collection($newestLogos),
            'industries' => \App\Http\Resources\IndustryResource::collection(\App\Models\Industry::all()),
            'colors' => \App\Http\Resources\ColorResource::collection(\App\Models\Color::all()),
            'tastes' => \App\Http\Resources\TasteResource::collection(\App\Models\Taste::all()),
        ]);
    }

    public function contactUs()
    {
        return Inertia::render(
            'public/contact-us',
            [
                'packages' => cache()->rememberForever('service_packages_contact_us', function () {
                    return Package::query()
                        ->where('is_active', true)
                        ->select(['id', 'category', 'key', 'prices'])
                        ->get()
                        ->groupBy('category')
                        ->map(fn ($group) => $group->map(fn ($item) => [
                            'id' => $item->id,
                            'key' => $item->key,
                            'prices' => $item->prices,
                        ]))
                        ->toArray();
                }),
            ]
        );
    }

    public function motionLogo()
    {
        return Inertia::render('public/motion-logo');
    }

    public function userInformation()
    {
        return Inertia::render('user/user-information');
    }
}
