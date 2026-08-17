<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderPackage extends Model
{
    protected $table = 'lt_t_order_packages';

    protected $fillable = [
        'order_id',
        'package_id',
        'product_code',
        'quantity',
        'logo_manual',
        'logo_motion',
        'main_text',
        'price',
        'logo_manual_price',
        'logo_motion_price',
        'main_text_price',
        'currency',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function package()
    {
        return $this->belongsTo(Package::class, 'package_id');
    }
}
