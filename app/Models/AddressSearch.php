<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AddressSearch extends Model
{
    protected $table = 'lt_t_address_search';

    protected $fillable = [
        'address_ip'
    ];

}
