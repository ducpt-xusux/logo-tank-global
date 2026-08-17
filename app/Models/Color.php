<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Color extends Model
{
    protected $table = 'lt_m_color';

    protected $primaryKey = 'id';

    const CREATED_AT = 'reg_date';

    const UPDATED_AT = 'up_date';

    protected $fillable = [
        'id',
        'state',
        'reg_date',
        'up_date',
        'reg_by',
        'up_by',
        'name',
        'name_vi',
        'name_en',
        'explain',
        'key_name',
    ];
}
