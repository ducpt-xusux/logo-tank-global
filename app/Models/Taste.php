<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Taste extends Model
{
    protected $table = 'lt_m_taste';

    const CREATED_AT = 'reg_date';

    const UPDATED_AT = 'up_date';

    protected $fillable = [
        'state',
        'reg_date',
        'up_date',
        'reg_by',
        'up_by',
        'name',
        'name_vi',
        'name_en',
        'key_name',
        'explain',
    ];
}
