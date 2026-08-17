<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IndustryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'key_name' => $this->key_name,
            'name_ja' => $this->name,
            'name_vi' => $this->name_vi,
            'name_en' => $this->name_en,
            'reg_date' => date('Y年m月d日 H:i', strtotime($this->reg_date))
        ];
    }
}
