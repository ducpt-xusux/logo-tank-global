<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PublicOrderLogoResource extends JsonResource
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
            'order_id' => $this->order_id,
            'sub_name' => $this->sub_name,
            'main_name' => $this->main_name,
            'logo_manual' => $this->logo_manual,
            'logo_motion' => $this->logo_motion,
            'logo_manual_price' => $this->logo_manual_price,
            'logo_motion_price' => $this->logo_motion_price,
            'logo' => new LogoDetailResource($this->whenLoaded('logo'))
        ];
    }
}
