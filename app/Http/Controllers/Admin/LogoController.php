<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\DefaultController;
use App\Http\Resources\ColorResource;
use App\Http\Resources\IndustryResource;
use App\Http\Resources\LogoDetailResource;
use App\Http\Resources\TasteResource;
use App\Models\Color;
use App\Models\Industry;
use App\Models\Logo;
use App\Models\LogoAlphabet;
use App\Models\LogoLanguage;
use App\Models\Taste;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LogoController extends DefaultController
{
    private function getDetailLists(): array
    {
        $alphabets = config('common.alphabets', []);
        $alphabetList = collect($alphabets)
            ->map(function ($name, $id) {
                return [
                    'alphabet_id' => (int) $id,
                    'name' => $name,
                ];
            })
            ->values();

        return [
            'colorsList' => ColorResource::collection(Color::all()),
            'industriesList' => IndustryResource::collection(Industry::all()),
            'tastesList' => TasteResource::collection(Taste::all()),
            'alphabetsList' => $alphabetList,
            'designerList' => User::designers()->select('id', 'name')->get(),
        ];
    }

    protected function _extendIndexQuery(Builder $query): array
    {
        $state = request('state', 0);
        $keyword = request('keyword', null);
        $designers = request('designers', null);
        if (empty($state)) {
            $query->whereNotIn('state', [
                config('common.logo_status.stop'),
                config('common.logo_status.deleted'),
            ]);
        } else {
            $query->where('state', '=', $state);
        }

        if (isset($keyword)) {
            $query->where('logo_id', 'LIKE', '%'.$keyword.'%');
        }

        if (isset($designers)) {
            $listDesigner = explode(',', $designers);
            if (count($listDesigner) > 0) {
                $query->whereIn('reg_by', $listDesigner);
            }
        }

        $query
            ->with(['logoLanguage', 'favorites'])
            ->withCount('favorites')
            ->orderBy('logo_id', 'DESC');

        $allDesigners = User::designers()->select('id', 'name')->get();

        return [
            $query,
            [
                'state' => $state,
                'designers_filter' => $designers,
                'all_designers' => $allDesigners,
                'logo_status_list' => config('common.logo_status'),
            ],
        ];
    }

    public function show(): \Inertia\Response
    {
        return Inertia::render(
            'admin/logodetail',
            array_merge($this->getDetailLists(), [
                'item' => [
                    'logo_id' => null,
                    'logo_name' => '',
                    'logo_explain' => '',
                    'logo_d_id' => '',
                    'reg_by' => '',
                    'logo_language' => [
                        'vi' => '',
                        'en' => '',
                        'ja' => '',
                    ],
                    'colors' => [],
                    'industries' => [],
                    'tastes' => [],
                    'alphabets' => [],
                    'keywords' => [],
                    'src' => '',
                ],
            ]),
        );
    }

    public function detail(Logo $logo): \Inertia\Response
    {
        $logo->load([
            'colors',
            'industries',
            'tastes',
            'alphabets',
            'logoLanguage',
            'logoImages',
            'logoKeywords.keyword.keywordLanguage',
        ]);

        return Inertia::render(
            'admin/logodetail',
            array_merge($this->getDetailLists(), [
                'item' => new LogoDetailResource($logo),
                'tab' => request('tab'),
            ]),
        );
    }

    public function storeDetail(Request $request)
    {
        $validated = $request->validate([
            'logo_name' => 'required|string|max:255',
            'logo_name_vn' => 'required|string|max:255',
            'logo_name_en' => 'required|string|max:255',
            'logo_explain' => 'required|string',
            'logo_d_id' => 'nullable|string|max:255',
            'reg_by' => 'nullable|string|max:255',
        ]);

        $logo = Logo::create([
            'logo_name' => $validated['logo_name'],
            'logo_explain' => $validated['logo_explain'],
            'logo_d_id' => $validated['logo_d_id'] ?? null,
            'reg_by' => $request->user()?->role === 'admin'
                ? $validated['reg_by'] ?? null
                : $request->user()?->name,
            'up_by' => $request->user()?->name,
            'reg_date' => now(),
            'up_date' => now(),
        ]);

        LogoLanguage::create([
            'logo_id' => $logo->logo_id,
            'create_by' => $logo->reg_by,
            'ja' => $validated['logo_name'],
            'vi' => $validated['logo_name_vn'],
            'en' => $validated['logo_name_en'],
        ]);

        return redirect()->route('admin.logo.detail', $logo->logo_id);
    }

    public function updateDetail(Request $request, Logo $logo)
    {
        $validated = $request->validate([
            'logo_name' => 'required|string|max:255',
            'logo_name_vn' => 'required|string|max:255',
            'logo_name_en' => 'required|string|max:255',
            'logo_explain' => 'required|string',
            'logo_d_id' => 'nullable|string|max:255',
            'reg_by' => 'nullable|string|max:255',
            'image' => 'nullable|file|mimes:png,gif',
        ]);

        $logo->logo_name = $validated['logo_name'];
        $logo->logo_explain = $validated['logo_explain'];
        $logo->logo_d_id = $validated['logo_d_id'] ?? null;
        if ($request->user()?->role === 'admin') {
            $logo->reg_by = $validated['reg_by'] ?? $logo->reg_by;
        }
        $logo->up_by = $request->user()?->name ?? $logo->up_by;
        $logo->save();

        LogoLanguage::updateOrCreate(
            ['logo_id' => $logo->logo_id],
            [
                'create_by' => $logo->reg_by,
                'ja' => $validated['logo_name'],
                'vi' => $validated['logo_name_vn'],
                'en' => $validated['logo_name_en'],
            ],
        );

        return redirect()->back();
    }

    public function updateCategories(Request $request, Logo $logo)
    {
        $validated = $request->validate([
            'colors' => 'array',
            'colors.*' => 'integer',
            'industries' => 'array',
            'industries.*' => 'integer',
            'tastes' => 'array',
            'tastes.*' => 'integer',
            'alphabets' => 'array',
            'alphabets.*' => 'integer',
        ]);

        $logo->colors()->sync($validated['colors'] ?? []);
        $logo->industries()->sync($validated['industries'] ?? []);
        $logo->tastes()->sync($validated['tastes'] ?? []);

        LogoAlphabet::where('logo_id', $logo->logo_id)->delete();
        $alphabets = $validated['alphabets'] ?? [];
        if (! empty($alphabets)) {
            $rows = array_map(
                fn ($alphabetId) => [
                    'logo_id' => $logo->logo_id,
                    'alphabet_id' => $alphabetId,
                ],
                $alphabets,
            );
            LogoAlphabet::insert($rows);
        }

        return redirect()->back();
    }

    public function updateState(Request $request, $logoId)
    {
        $validated = $request->validate([
            'state' => 'required|integer',
        ]);
        $logo = Logo::findOrFail($logoId);
        $logo->state = $validated['state'];
        $logo->save();

        return redirect()->back();
    }
}
