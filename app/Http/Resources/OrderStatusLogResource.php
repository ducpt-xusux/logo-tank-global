<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderStatusLogResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'status' => (int) $this->status,
            'date_time' => Carbon::parse($this->created_at)->format('Y-m-d H:i:s'),
            'date_formatted' => Carbon::parse($this->created_at)->format('Y-m-d'),
            'time_formatted' => Carbon::parse($this->created_at)->format('H:i:s'),
        ];
    }
}
