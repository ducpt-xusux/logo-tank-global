<?php

namespace App\Http\Resources;

use App\Helper\Common;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicFavoriteLogoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'logo_id' => $this->logo_id,
            'state' => $this->state,
            'reg_by' => $this->reg_by,
            'up_by' => $this->up_by,
            'logo_name' => $this->logo_name,
            'logo_explain' => $this->logo_explain,
            'logo_d_id' => $this->logo_d_id,
            'tank_num' => $this->tank_num,
            'tank_count' => $this->tank_count??0,
            'src' => Common::getLogoSrc($this->logo_id),
            'logo_language' => new LogoLanguageResource($this->whenLoaded('logoLanguage')),
            'favorites_count' => $this->favorites_count,
        ];
    }
}
