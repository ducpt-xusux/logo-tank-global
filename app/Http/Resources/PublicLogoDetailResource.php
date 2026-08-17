<?php

namespace App\Http\Resources;

use App\Helper\Common;
use App\Models\Favorite;
use App\Models\Logo;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\MissingValue;

class PublicLogoDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     */
    public function toArray($request): array
    {
        $user = auth()->user();
        $isUserKept = Favorite::query()->where('logo_id', $this->logo_id)->where('is_keep', Favorite::IS_KEEP)->first();

        return [
            'logo_id' => $this->logo_id,
            'state' => $this->state,
            'reg_by' => $this->reg_by,
            'up_by' => $this->up_by,
            'logo_name' => $this->logo_name,
            'logo_explain' => $this->logo_explain,
            'logo_d_id' => $this->logo_d_id,
            'tank_num' => $this->tank_num,
            'tank_num_logo_tank_jp' => $this->tank_num_logo_tank_jp,
            'tank_count' => $this->tank_count ?? 0,
            'url_img_two' => checkExitImage($this->logo_id) ? checkExitImage($this->logo_id) : '',
            'src' => Common::getLogoSrc($this->logo_id),
            'colors' => ColorResource::collection($this->whenLoaded('colors')),
            'industries' => IndustryResource::collection($this->whenLoaded('industries')),
            'alphabets' => AlphabetResource::collection($this->whenLoaded('alphabets')),
            'keywords' => $this->whenLoaded('logoKeywords') instanceof MissingValue ? null : $this->logoKeywords->pluck('keyword'),
            'favorites_count' => $this->whenLoaded('favorites')->count(),
            'logo_language' => $this->whenLoaded('logoLanguage'),
            'tastes' => $this->whenLoaded('logoTastes') instanceof MissingValue ? null : TasteResource::collection($this->logoTastes->pluck('taste')),
            'is_like' => ($user && $this->relationLoaded('favorites'))
            ? ($this->favorites->contains('user_id', $user->id) ? 1 : 0)
            : 0,
            'inactive' => in_array($this->state, [Logo::STOP, Logo::SOLD_OUT, Logo::DELETED]),
            'kept' => $this->state == Logo::NEGOTIATION,
            'is_user_kept' => (bool) $isUserKept,
        ];
    }
}
