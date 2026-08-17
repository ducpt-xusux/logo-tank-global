<?php

namespace App\Http\Resources;

use App\Helper\Common;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AlphabetResource extends JsonResource
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
            'alphabet_id' => $this->alphabet_id,
            'name' => Common::getAlphabet($this->alphabet_id)
        ];
    }
}
