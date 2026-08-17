<?php

namespace App\Http\Resources;

use App\Models\Favorite;
use App\Models\Logo;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\MissingValue;
use Illuminate\Support\Facades\DB;

class PublicFavoriteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $kept = false;
        if (!$this->whenLoaded('logo') instanceof MissingValue) {
            $kept = $this->logo->state == Logo::NEGOTIATION && $this->is_keep;
        }

        return [
            'id' => $this->id,
            'state' => $this->logo->state,
            'kept' => $kept,
            'keep_date' => $this->keep_date,
            'logo_id' => $this->logo_id,
            'logo' => $this->whenLoaded('logo') ? new PublicFavoriteLogoResource($this->logo) : null,
            'payment_status' => $this->payment_status,
            'inactive' => in_array($this->logo->state, [Logo::STOP, Logo::SOLD_OUT, Logo::DELETED]),
        ];
    }
}
