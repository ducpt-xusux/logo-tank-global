<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use SoftDeletes;

    protected $table = 'lt_t_orders';

    // Payment status
    const PAY_UNPAID = 1;

    const PAY_PAID = 2;

    // Order Type
    const TYPE_LOGO = 1;

    const TYPE_PACKAGE = 3;

    // Orders status
    const WAITING_FOR_PAY = 1;

    const PURCHASED = 2;

    const CANCELED = 3;

    // Tracking status
    const STATUS_ORDERED = 1;

    const STATUS_RECEIVED = 2;

    const STATUS_DESIGN_RECEIVED = 3;

    const STATUS_PROCESSING = 4;

    const STATUS_SHIPPING = 5;

    const STATUS_COMPLETED = 6;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'price',
        'tax',
        'commission',
        'tax_rate',
        'type',
        'status',
        'payment_status',
        'payment_date',
        'payment_type',
        'purchase_date',
        'sub_total',
        'total_amount',
        'invoice_num',
        'is_download',
        'download_link',
        'delivery_address',
        'postal_code',
        'delivery_date',
        'payment_intent',
        'currency',
        'payment_intent_client_secret',
    ];

    public function orderLogos()
    {
        return $this->hasMany(OrderLogo::class, 'order_id', 'id');
    }

    public function orderPackages()
    {
        return $this->hasMany(OrderPackage::class, 'order_id', 'id');
    }

    public function statusLogs()
    {
        return $this->hasMany(OrderStatusLog::class, 'order_id', 'id')->orderBy('created_at', 'desc');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
