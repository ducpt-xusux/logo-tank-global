<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Logo;
use App\Services\LogoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LogoController extends Controller
{
    protected LogoService $logoService;

    public function __construct(LogoService $logoService)
    {
        $this->logoService = $logoService;
    }

    public function explore(Request $request)
    {
        return Inertia::render(
            'public/explore',
            $this->logoService->getExploreData(
                $request->only(['keyword', 'industry', 'alphabet', 'taste', 'color'])
            )
        );
    }

    public function publicDetail($locale, $id)
    {
        $data = $this->logoService->getPublicDetailData((int) $id);

        if (empty($data)) {
            abort(404);
        }

        return Inertia::render('public/public-logo-detail', $data);
    }

    public function toggleFavorite(Logo $logo)
    {
        $user = Auth::user();

        if (! $user) {
            return redirect()->back()->with('error', 'Unauthenticated');
        }

        $this->logoService->toggleLogoFavorite($user, $logo);

        return redirect()->back();
    }

}
