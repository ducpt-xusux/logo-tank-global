<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'name' => $this->name,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'name_kana' => $this->name_kana,
            'company_name' => $this->company_name,
            'email' => $this->email,
            'role' => $this->role,
            'phone' => $this->phone,
            'picture' => $this->picture,
            'address_line_1' => $this->address_line_1,
            'address_line_2' => $this->address_line_2,
            'postal_code' => $this->postal_code,
            'email_verified_at' => $this->email_verified_at,
            'created_at' => date('Y年m月d日', strtotime($this->created_at)),
        ];
    }
}
