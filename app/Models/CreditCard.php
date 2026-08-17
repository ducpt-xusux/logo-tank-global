<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CreditCard extends Model
{
    use SoftDeletes;

    protected $table = 'lt_t_user_credit_cards';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'card_number',
        'brand',
        'fingerprint',
        'card_name',
        'stripe_card_id',
        'date_of_expiry',
    ];
}
