<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class LogoLanguageResource extends JsonResource
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
            'create_by' => $this->create_by,
            'vi' => $this->vi,
            'en' => $this->en,
            'ja' => $this->name,
        ];
    }
}
