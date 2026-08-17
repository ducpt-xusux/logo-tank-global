<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use SoftDeletes;

    protected $table = 'lt_t_payments';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'order_id',
        'stripe_id',
        'balance_transaction',
        'currency',
        'payment_method',
    ];
}
