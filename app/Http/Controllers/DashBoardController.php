<?php

namespace App\Http\Controllers;

use App\Models\Logo;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashBoardController extends Controller
{
    //

    public function index(Request $request)
    {
        $query = Logo::query();

        if ($request->keyword) {
            $query->where('logo_id', $request->keyword);
        }

        if ($request->state) {
            $query->where('state', $request->state);
        }

        if ($request->designers) {
            $designerNames = explode(',', $request->designers);
            $query->whereIn('reg_by', $designerNames);
        }
        $designers = User::designers()->get();
        $logos = $query->paginate(20)->withQueryString();
        $logos->getCollection()->transform(function ($logo) {
            $logo->src = \App\Helper\Common::getLogoSrc($logo->logo_id);

            return $logo;
        });

        return Inertia::render('admin/dashboard', [
            'logos' => $logos,
            'designers' => $designers,
            'filters' => $request->only(['keyword', 'state', 'designers']),
        ]);
    }
}
