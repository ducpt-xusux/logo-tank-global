<?php

namespace App\Http\Resources;

use App\Helper\Common;
use App\Models\Logo;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LogoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     */
    public function toArray($request): array
    {
        $user = auth()->user();

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
            'logo_language' => $this->whenLoaded('logoLanguage'),
            'favorites_count' => $this->favorites_count,
            'is_like' => ($user && $this->relationLoaded('favorites'))
            ? ($this->favorites->contains('user_id', $user->id) ? 1 : 0)
            : 0,
            'favorites' => $this->whenLoaded('favorites'),
            'inactive' => $this->state == Logo::SOLD_OUT,
            'kept' => $this->state == Logo::NEGOTIATION,
            'url_img_two' => checkExitImage($this->logo_id) ? checkExitImage($this->logo_id) : '',
            'src' => Common::getLogoSrc($this->logo_id),
        ];
    }
}
