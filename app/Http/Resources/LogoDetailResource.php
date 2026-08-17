<?php

namespace App\Http\Resources;

use App\Helper\Common;
use App\Models\LogoZip;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\MissingValue;

class LogoDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     */
    public function toArray($request): array
    {
        // $exist = $this->load('logoKeywords.keyword.keywordLanguage');
        // if ($exist instanceof MissingValue) {
        //     $keywords = null;
        // } else {
        //     $keywords = $this->whenLoaded('logoKeywords.keyword.keywordLanguage')->toArray();
        // }
        return [
            'logo_id' => $this->logo_id,
            'state' => $this->state,
            'reg_by' => $this->reg_by,
            'up_by' => $this->up_by,
            'logo_name' => $this->logo_name,
            'logo_explain' => $this->logo_explain,
            'logo_d_id' => $this->logo_d_id,
            'tank_num' => $this->tank_num,
            'tank_count' => $this->tank_count ?? 0,
            'src' => Common::getLogoSrc($this->logo_id),
            'colors' => ColorResource::collection($this->whenLoaded('colors')),
            'industries' => IndustryResource::collection($this->whenLoaded('industries')),
            'tastes' => TasteResource::collection($this->whenLoaded('tastes')),
            'alphabets' => AlphabetResource::collection($this->whenLoaded('alphabets')),
            'keywords' => $this->logoKeywords,
            'logo_language' => new LogoLanguageResource($this->whenLoaded('logoLanguage')),
            'zip' => LogoZip::where('logo_id', $this->logo_id)->first() ? true : false,
            'logo_images' => LogoImageResource::collection($this->whenLoaded('logoImages')),

        ];
    }
}
