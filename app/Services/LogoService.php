<?php

namespace App\Services;

use App\Http\Resources\ColorResource;
use App\Http\Resources\IndustryResource;
use App\Http\Resources\LogoResource;
use App\Http\Resources\PublicLogoDetailResource;
use App\Http\Resources\TasteResource;
use App\Models\Color;
use App\Models\Industry;
use App\Models\Logo;
use App\Models\Recommend;
use App\Models\Taste;

class LogoService
{
    /**
     * Get search logo results.
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function searchLogos(array $filters)
    {
        $query = Logo::query();

        $query->whereNotIn('state', [
            config('common.logo_status.deleted'),
            config('common.logo_status.stop'),
        ]);

        if (! empty($filters['keyword'])) {
            $keyword = $filters['keyword'];
            $query->where(function ($q) use ($keyword) {
                $q->where('logo_name', 'LIKE', '%'.$keyword.'%')
                    ->orWhere('logo_explain', 'LIKE', '%'.$keyword.'%')
                    ->orWhereHas('logoLanguage', function ($langQ) use ($keyword) {
                        $langQ->where('vi', 'LIKE', '%'.$keyword.'%')
                            ->orWhere('en', 'LIKE', '%'.$keyword.'%')
                            ->orWhere('ja', 'LIKE', '%'.$keyword.'%');
                    });
            });
        }

        if (! empty($filters['industry'])) {
            $industryId = $filters['industry'];
            $query->whereHas('industries', function ($q) use ($industryId) {
                $q->where('id', $industryId);
            });
        }

        if (! empty($filters['alphabet'])) {
            $alphabetChar = strtoupper($filters['alphabet']);
            $alphabets = config('common.alphabets', []);
            $alphabetId = array_search($alphabetChar, $alphabets);
            if ($alphabetId !== false) {
                $query->whereHas('alphabets', function ($q) use ($alphabetId) {
                    $q->where('alphabet_id', $alphabetId);
                });
            }
        }

        if (! empty($filters['taste'])) {
            $tasteId = $filters['taste'];
            $query->whereHas('tastes', function ($q) use ($tasteId) {
                $q->where('id', $tasteId);
            });
        }

        if (! empty($filters['color'])) {
            $colorId = $filters['color'];
            $query->whereHas('colors', function ($q) use ($colorId) {
                $q->where('id', $colorId);
            });
        }

        return $query->with('favorites')
            ->withCount('favorites')
            ->orderBy('up_date', 'desc')
            ->paginate(16);
    }

    public function getExploreData(array $filters): array
    {
        $logos = $this->searchLogos($filters);

        return [
            'logos' => LogoResource::collection($logos),
            'industries' => IndustryResource::collection(Industry::all()),
            'colors' => ColorResource::collection(Color::all()),
            'tastes' => TasteResource::collection(Taste::all()),
            'filters' => $filters,
        ];
    }

    public function getLogoDetailWithRecommendations(int $id)
    {
        $logo = Logo::query()->where('logo_id', '=', $id)->whereNotIn('state', [
            config('common.logo_status.deleted'),
        ])
            ->with(['colors', 'industries', 'tastes', 'alphabets', 'logoKeywords.keyword', 'logoKeywords.keyword.keywordLanguage', 'logoTastes.taste', 'favorites', 'logoLanguage'])
            ->withCount(['favorites'])
            ->first();

        if (empty($logo)) {
            return null;
        }

        $recommend = Recommend::where('logo_id', $id)->first();
        if (! empty($recommend)) {
            $logoIds = array_values(array_filter(
                array_slice($recommend->getAttributes(), 1)
            ));
            $logoIDSort = implode(',', $logoIds);
            $logosRecommend = Logo::with(['favorites', 'logoLanguage'])
                ->withCount(['favorites'])
                ->whereIn('logo_id', $logoIds)
                ->orderByRaw("FIELD(logo_id, {$logoIDSort})")
                ->take(6)
                ->get();
        } else {
            $logosRecommend = Logo::with(['favorites', 'logoLanguage'])
                ->withCount(['favorites'])
                ->where('state', 0)
                ->where('logo_id', '!=', $id)
                ->orderByRaw('RAND()')
                ->limit(6)
                ->get();
        }

        return [
            'logo' => $logo,
            'logosRecommended' => $logosRecommend,
        ];
    }

    public function getPublicDetailData(int $id): ?array
    {
        $result = $this->getLogoDetailWithRecommendations($id);

        if (empty($result)) {
            return null;
        }

        return [
            'logo' => new PublicLogoDetailResource($result['logo']),
            'logosRecommended' => PublicLogoDetailResource::collection($result['logosRecommended']),
        ];
    }

    public function toggleLogoFavorite(\App\Models\User $user, Logo $logo)
    {
        $user->favorites()->toggle($logo->logo_id);
    }
}
