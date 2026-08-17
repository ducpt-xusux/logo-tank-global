<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TasteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name_ja' => $this->name,
            'name_vi' => $this->name_vi,
            'name_en' => $this->name_en,
            'key_name' => $this->key_name,
            'reg_date' => date('Y年m月d日 H:i', strtotime($this->reg_date)),
        ];
    }
}
