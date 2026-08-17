<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DefaultResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request): array
    {
        $data = $this->resource->toArray();
        unset($data['deleted_at']);
        $data['created_at'] = date('Y年m月d日 H:i', strtotime($this->created_at));
        return $data;
    }
}
