<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FavoriteResource extends JsonResource
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
            'logo_id' => $this->logo_id,
            'user_id' => $this->user_id,
            'is_keep' => $this->is_keep,
            'keep_date' => $this->keep_date,
        ];
    }
}
