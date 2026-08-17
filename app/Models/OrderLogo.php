<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderLogo extends Model
{
    use SoftDeletes;

    protected $table = 'lt_t_order_logo';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'logo_id',
        'order_id',
        'logo_manual',
        'logo_motion',
        'sub_name',
        'main_name',
        'logo_manual_price',
        'logo_motion_price',
    ];

    public function logo()
    {
        return $this->belongsTo(Logo::class,'logo_id', 'logo_id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class,'order_id', 'id');
    }

}
