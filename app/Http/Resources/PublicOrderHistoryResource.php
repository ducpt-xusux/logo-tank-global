<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicOrderHistoryResource extends JsonResource
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
            'id' => $this->id,
            'user_id' => $this->user_id,
            'invoice_num' => $this->invoice_num,
            'main_name' => $this->main_name,
            'payment_date' => $this->payment_date,
            'status' => $this->status,
            'payment_status' => $this->payment_status,
            'payment_type' => $this->payment_type,
            'price' => $this->price,
            'currency' => $this->currency,
            'purchase_date' => Carbon::parse($this->purchase_date)->toFormattedDateString(),
            'delivery_date' => $this->delivery_date ? Carbon::parse($this->delivery_date)->toFormattedDateString() : '',
            'sub_total' => $this->sub_total ?? 0,
            'total_amount' => $this->total_amount ?? 0,
            'payment_intent' => $this->payment_intent,
            'order_logos' => PublicOrderLogoResource::collection($this->whenLoaded('orderLogos')),
        ];
    }
}
