<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LogoImageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     */
    public function toArray($request): array
    {
        $path = $this->path ?? $this->file_path;
        $filename = $this->filename ?? $this->file_name;

        return [
            'id' => $this->id,
            'logo_id' => $this->logo_id,
            'file_name' => $filename,
            'file_path' => $path,
            'filename' => $filename,
            'path' => $path,
            'sort_order' => $this->sort_order,
            'url' => $path ? asset(ltrim($path, '/')) : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
